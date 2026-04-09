// .github/scripts/send-notifications.js
const webpush = require('web-push');
const { createSign } = require('crypto');

// ── Config ────────────────────────────────────────────────────────────────────
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@utesa.edu';
const WORKER_URL    = process.env.WORKER_URL;
const WORKER_TOKEN  = process.env.WORKER_AUTH_TOKEN;
const FCM_PROJECT   = process.env.FIREBASE_PROJECT_ID;
const FCM_EMAIL     = process.env.FIREBASE_CLIENT_EMAIL;
const FCM_KEY       = process.env.FIREBASE_PRIVATE_KEY;

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const ALERT_RANGES = [
  { min: 13, max: 15, label: 15 },
  { min:  8, max: 10, label: 10 },
  { min:  3, max:  5, label:  5 },
];
const SLOTS = [
  {m:420,l:'7:00 AM'},{m:465,l:'7:45 AM'},{m:510,l:'8:30 AM'},{m:555,l:'9:15 AM'},
  {m:600,l:'10:00 AM'},{m:645,l:'10:45 AM'},{m:690,l:'11:30 AM'},{m:735,l:'12:15 PM'},
  {m:780,l:'1:00 PM'},{m:825,l:'1:45 PM'},{m:870,l:'2:30 PM'},{m:915,l:'3:15 PM'},
  {m:960,l:'4:00 PM'},{m:1005,l:'4:45 PM'},{m:1050,l:'5:30 PM'},{m:1095,l:'6:15 PM'},
  {m:1140,l:'7:00 PM'},{m:1185,l:'7:45 PM'},{m:1230,l:'8:30 PM'},{m:1275,l:'9:15 PM'},
  {m:1320,l:'10:00 PM'},
];

function nowRD() { return new Date(Date.now() - 4 * 3600000); }
function todayName() { return DIAS[nowRD().getUTCDay()]; }
function nowM() { const d = nowRD(); return d.getUTCHours() * 60 + d.getUTCMinutes(); }

function parseTimeStr(str) {
  if (!str) return 0;
  str = str.trim();
  const isPM = str.toUpperCase().includes('PM');
  const isAM = str.toUpperCase().includes('AM');
  str = str.replace(/AM|PM/gi, '').trim();
  let [h, min] = str.split(':').map(Number);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h * 60 + (min || 0);
}

// ── FCM JWT ───────────────────────────────────────────────────────────────────
function makeJWT() {
  const privateKey = FCM_KEY.replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: FCM_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url');
  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const sig = sign.sign(privateKey, 'base64url');
  return `${signingInput}.${sig}`;
}

async function getFCMAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${makeJWT()}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('FCM token error: ' + JSON.stringify(data));
  return data.access_token;
}

async function sendFCM(accessToken, fcmToken, notif) {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${FCM_PROJECT}/messages:send`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: { title: notif.title, body: notif.body },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channel_id: 'utesa_labs_channel',
            default_sound: true,
            default_vibrate_timings: true,
            notification_priority: 'PRIORITY_MAX',
          },
        },
        data: { url: notif.url || 'https://francisdominguez.github.io/horarios-laboratorios-utesa/' },
      },
    }),
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

// ── Enviar a todos ────────────────────────────────────────────────────────────
async function sendToAll(webSubs, fcmTokens, notif) {
  let ok = 0, expired = 0, failed = 0;

  // Web Push (PWA)
  const payload = JSON.stringify(notif);
  for (const sub of webSubs) {
    try {
      await webpush.sendNotification(sub, payload);
      ok++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await fetch(`${WORKER_URL}/unsubscribe`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub)
        }).catch(() => {});
        expired++;
      } else { failed++; }
    }
  }

  // FCM (Flutter app)
  if (fcmTokens.length > 0) {
    try {
      const accessToken = await getFCMAccessToken();
      for (const token of fcmTokens) {
        const result = await sendFCM(accessToken, token, notif);
        if (result.ok) {
          ok++;
        } else if (result.data?.error?.details?.[0]?.errorCode === 'UNREGISTERED') {
          await fetch(`${WORKER_URL}/fcm-unsubscribe`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }).catch(() => {});
          expired++;
        } else {
          console.warn(`FCM error ${result.status}:`, JSON.stringify(result.data));
          failed++;
        }
      }
    } catch (e) {
      console.warn('⚠️ FCM error:', e.message);
    }
  }

  return { ok, expired, failed };
}

async function main() {
  // ── Schedule ──────────────────────────────────────────────────────────────
  let classes = [];
  try {
    const res = await fetch(`${WORKER_URL}/schedule`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const labelToM = {};
    SLOTS.forEach(s => { labelToM[s.l] = s.m; });
    classes = (data.clases || []).filter(c => c.activa !== false).map(c => {
      let inicioM, finM, inicio, fin;
      if (typeof c.si === 'number') {
        inicioM = SLOTS[c.si].m;
        finM    = SLOTS[c.ei]?.m || 1320;
        inicio  = SLOTS[c.si].l;
        fin     = SLOTS[c.ei]?.l || '10:00 PM';
      } else {
        inicioM = labelToM[c.hora_inicio] || parseTimeStr(c.hora_inicio);
        finM    = labelToM[c.hora_fin]    || parseTimeStr(c.hora_fin);
        inicio  = c.hora_inicio; fin = c.hora_fin;
      }
      return { ...c, inicioM, finM, inicio, fin };
    }).filter(c => c.inicioM > 0);
    console.log(`📋 ${classes.length} clases activas`);
  } catch(e) {
    console.error('❌ Schedule error:', e.message); process.exit(1);
  }

  // ── Suscripciones Web Push ────────────────────────────────────────────────
  let webSubs = [];
  try {
    const res = await fetch(`${WORKER_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    if (res.ok) {
      webSubs = await res.json();
    } else {
      const errText = await res.text();
      console.error(`❌ /subscriptions error ${res.status}: ${errText}`);
    }
    console.log(`👥 ${webSubs.length} suscriptor(es) Web Push`);
  } catch(e) { console.warn('⚠️ Web Push subs error:', e.message); }

  // ── Tokens FCM (Flutter) ──────────────────────────────────────────────────
  let fcmTokens = [];
  try {
    const res = await fetch(`${WORKER_URL}/fcm-tokens`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    if (res.ok) {
      fcmTokens = await res.json();
      console.log(`📱 ${fcmTokens.length} token(s) FCM Flutter`);
    } else {
      const errText = await res.text();
      console.error(`❌ /fcm-tokens error ${res.status}: ${errText}`);
    }
  } catch(e) { console.warn('⚠️ FCM tokens error:', e.message); }

  if (!webSubs.length && !fcmTokens.length) {
    console.log('Sin suscriptores.'); process.exit(0);
  }

  // ── Notificación manual pendiente ─────────────────────────────────────────
  try {
    const pendingRes = await fetch(`${WORKER_URL}/admin/pending-notification`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    if (pendingRes.ok) {
      const pending = await pendingRes.json();
      if (pending?.title) {
        console.log(`📢 Manual: "${pending.title}"`);
        const result = await sendToAll(webSubs, fcmTokens, pending);
        console.log(`"${pending.title}" → ✅ ${result.ok} | 🗑️ ${result.expired} | ❌ ${result.failed}`);
        await fetch(`${WORKER_URL}/admin/pending-notification`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
        }).catch(() => {});
        if (process.env.GITHUB_EVENT_NAME === 'repository_dispatch') {
          console.log('✅ Notificación manual enviada.'); process.exit(0);
        }
      }
    }
  } catch(e) { console.warn('⚠️ Manual notif error:', e.message); }

  // ── Alertas de clases ─────────────────────────────────────────────────────
  const today = todayName();
  const m     = nowM();
  console.log(`🕐 ${nowRD().toUTCString()} | ${today} | min: ${m}`);

  const todayClasses = classes.filter(c => c.dia === today);
  if (!todayClasses.length) { console.log('Sin clases hoy.'); process.exit(0); }

  const upcoming = [], ended = [], started = [];
  todayClasses.forEach(c => {
    const diff    = c.inicioM - m;
    const diffEnd = c.finM - m;
    const range = ALERT_RANGES.find(r => diff >= r.min && diff <= r.max);
    if (range) upcoming.push({ c, diff: range.label });
    if (diffEnd <= 0 && diffEnd >= -2) ended.push({ c });
    if (diff <= 0 && diff >= -2) started.push({ c });
  });

  if (!upcoming.length && !ended.length && !started.length) {
    console.log('Sin alertas.'); process.exit(0);
  }

  const notifications = [];

  if (started.length) notifications.push({
    title: `🟢 ${started.length === 1 ? 'Clase iniciada' : `${started.length} clases iniciadas`}`,
    body: started.map(({ c }) => `${c.aula} · ${c.mat} grp.${c.grp}\n${c.inicio} → ${c.fin}`).join('\n\n'),
    tag: `started-${m}`, url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    icon: '/horarios-laboratorios-utesa/icon-192.png',
    badge: '/horarios-laboratorios-utesa/icon-192.png',
    vibrate: [200, 100, 200],
  });

  if (upcoming.length) {
    const byDiff = {};
    upcoming.forEach(({ c, diff }) => { if (!byDiff[diff]) byDiff[diff] = []; byDiff[diff].push(c); });
    Object.entries(byDiff).forEach(([diff, cs]) => notifications.push({
      title: `⏰ ${cs.length === 1 ? `Clase en ${diff} min` : `${cs.length} clases en ${diff} min`}`,
      body: cs.map(c => `${c.aula} · ${c.mat} grp.${c.grp}\n${c.inicio} → ${c.fin}`).join('\n\n'),
      tag: `upcoming-${diff}min-${m}`, url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
      icon: '/horarios-laboratorios-utesa/icon-192.png',
      badge: '/horarios-laboratorios-utesa/icon-192.png',
      vibrate: [100,50,100,50,300,100,300], requireInteraction: true,
    }));
  }

  if (ended.length) notifications.push({
    title: `✅ ${ended.length === 1 ? 'Clase finalizada' : `${ended.length} clases finalizadas`}`,
    body: ended.map(({ c }) => `${c.aula} · ${c.mat} grp.${c.grp} · ${c.inicio}→${c.fin}`).join('\n'),
    tag: `ended-${m}`, url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    icon: '/horarios-laboratorios-utesa/icon-192.png',
    badge: '/horarios-laboratorios-utesa/icon-192.png',
    vibrate: [200, 100, 200],
  });

  for (const notif of notifications) {
    const result = await sendToAll(webSubs, fcmTokens, notif);
    console.log(`"${notif.title}" → ✅ ${result.ok} | 🗑️ ${result.expired} | ❌ ${result.failed}`);
    await fetch(`${WORKER_URL}/notifications/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${WORKER_TOKEN}` },
      body: JSON.stringify({ title: notif.title, body: notif.body, ts: Date.now(), tag: notif.tag, url: notif.url }),
    }).catch(() => {});
  }

  console.log('✅ Proceso completado.');
}

main().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1); });

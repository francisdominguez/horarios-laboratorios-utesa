const webpush = require('web-push');
const { createSign } = require('crypto');

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
  { min: 10, max: 17, label: 15 },
  { min:  5, max: 12, label: 10 },
  { min:  1, max:  7, label:  5 },
];

const SLOTS = [
  {m:420,l:'7:00 AM'},{m:465,l:'7:45 AM'},{m:510,l:'8:30 AM'},{m:555,l:'9:15 AM'},
  {m:600,l:'10:00 AM'},{m:645,l:'10:45 AM'},{m:690,l:'11:30 AM'},{m:735,l:'12:15 PM'},
  {m:780,l:'1:00 PM'},{m:825,l:'1:45 PM'},{m:870,l:'2:30 PM'},{m:915,l:'3:15 PM'},
  {m:960,l:'4:00 PM'},{m:1005,l:'4:45 PM'},{m:1050,l:'5:30 PM'},{m:1095,l:'6:15 PM'},
  {m:1140,l:'7:00 PM'},{m:1185,l:'7:45 PM'},{m:1230,l:'8:30 PM'},{m:1275,l:'9:15 PM'},
  {m:1320,l:'10:00 PM'},
];

// ── Nombres legibles de laboratorios ──────────────────────────────────────────
const LAB_NAMES = {
  'B120':'Geol. y Topografía','B121':'Materiales','B123':'Hidráulica',
  'B213':'Lab. TIC','B217':'Comunicación','B211':'Comunicación 02','B219':'Programación',
  'C001':'Máquinas y Herram.','C1002':'Taller de Bancos','C101':'Lab. Industrial',
  'C102':'Automatización','C103':'Lab. Industrial 02','C104':'Lab. CAD CAM',
  'C105':'Ing. Térmica','C106':'Lab. Neumática','C107':'Inst. Eléctricas',
  'C201':'Lab. Informática','C202':'Lab. Informática 02','C203':'Lab. Informática 03',
  'C204':'Lab. Informática 04','C205':'Lab. AutoCAD','C206':'Lab. Informática 06',
  'C207':'Lab. Informática 07','C208':'Lab. Mecatrónica','C413':'Lab. Comunicación',
  'C414A':'Lab. Electrónica','C414B':'Lab. Electrónica 02','C415':'Lab. Electricidad',
};

function labName(aula) { return LAB_NAMES[aula] || aula; }

// Formato legible para una sola clase (notificación individual)
function formatClaseSingle(c) {
  return `🏫 ${c.aula} — ${labName(c.aula)}\n📚 ${c.mat}  Grp. ${c.grp}\n🕐 ${c.inicio} → ${c.fin}`;
}

// Formato compacto para listado de múltiples clases
function formatClaseCompact(c) {
  return `• ${c.aula} — ${c.mat} Grp.${c.grp}  |  ${c.inicio}`;
}

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

// ── FCM ───────────────────────────────────────────────────────────────────────
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
  return `${signingInput}.${sign.sign(privateKey, 'base64url')}`;
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
  const data = await res.json();
  const errorStatus = data?.error?.status ?? null;
  const errorReason = data?.error?.details?.find(d => d['@type']?.includes('ErrorInfo'))?.reason ?? null;
  return { ok: res.ok, status: res.status, errorStatus, errorReason };
}

async function sendToAll(webSubs, fcmTokens, notif) {
  let ok = 0, expired = 0, failed = 0;
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

  if (fcmTokens.length > 0) {
    try {
      const accessToken = await getFCMAccessToken();
      for (const token of fcmTokens) {
        try {
          const result = await sendFCM(accessToken, token, notif);
          if (result.ok) { ok++; }
          else if (result.errorStatus === 'NOT_FOUND' || result.errorReason === 'UNREGISTERED') { expired++; }
          else { failed++; }
        } catch(e) { failed++; }
      }
    } catch(e) { console.warn('⚠️ FCM error:', e.message); }
  }

  return { ok, expired, failed };
}

async function main() {
  console.log('🚀 Iniciando...');

  // ── Schedule ──
  let classes = [];
  try {
    const res = await fetch(`${WORKER_URL}/schedule`);
    const data = await res.json();
    const labelToM = {};
    SLOTS.forEach(s => { labelToM[s.l] = s.m; });
    classes = (data.clases || []).filter(c => c.activa !== false).map(c => {
      let inicioM, finM, inicio, fin;
      if (typeof c.si === 'number') {
        inicioM = SLOTS[c.si].m; finM = SLOTS[c.ei]?.m || 1320;
        inicio  = SLOTS[c.si].l; fin  = SLOTS[c.ei]?.l || '10:00 PM';
      } else {
        inicioM = labelToM[c.hora_inicio] || parseTimeStr(c.hora_inicio);
        finM    = labelToM[c.hora_fin]    || parseTimeStr(c.hora_fin);
        inicio  = c.hora_inicio; fin = c.hora_fin;
      }
      return { ...c, inicioM, finM, inicio, fin };
    }).filter(c => c.inicioM > 0);
    console.log(`📋 ${classes.length} clases activas`);
  } catch(e) { console.error('❌ Schedule error:', e.message); process.exit(1); }

  // ── Suscriptores ──
  let webSubs = [];
  try {
    const res = await fetch(`${WORKER_URL}/subscriptions`, { headers: { Authorization: `Bearer ${WORKER_TOKEN}` } });
    if (res.ok) webSubs = await res.json();
    console.log(`👥 ${webSubs.length} Web Push`);
  } catch(e) { console.warn('⚠️ Web error:', e.message); }

  let fcmTokens = [];
  try {
    const res = await fetch(`${WORKER_URL}/fcm-tokens`, { headers: { Authorization: `Bearer ${WORKER_TOKEN}` } });
    if (res.ok) { fcmTokens = await res.json(); console.log(`📱 ${fcmTokens.length} FCM tokens`); }
    else console.log(`⚠️ /fcm-tokens status: ${res.status}`);
  } catch(e) { console.warn('⚠️ FCM tokens error:', e.message); }

  if (!webSubs.length && !fcmTokens.length) { console.log('❌ Sin suscriptores.'); process.exit(0); }

  // ── Notificación manual pendiente ──
  try {
    const res = await fetch(`${WORKER_URL}/admin/pending-notification`, { headers: { Authorization: `Bearer ${WORKER_TOKEN}` } });
    if (res.ok) {
      const pending = await res.json();
      if (pending?.title) {
        console.log(`📢 Manual: "${pending.title}"`);
        const result = await sendToAll(webSubs, fcmTokens, pending);
        console.log(`✅ "${pending.title}" → ok:${result.ok} exp:${result.expired} fail:${result.failed}`);
        await fetch(`${WORKER_URL}/admin/pending-notification`, { method: 'DELETE', headers: { Authorization: `Bearer ${WORKER_TOKEN}` } }).catch(() => {});
        if (process.env.GITHUB_EVENT_NAME === 'repository_dispatch') { console.log('✅ Fin.'); process.exit(0); }
      }
    }
  } catch(e) { console.warn('⚠️ Manual error:', e.message); }

  // ── Alertas de clases ──
  const today = todayName();
  const m = nowM();
  console.log(`🕐 ${today} | ${m} min`);

  const todayClasses = classes.filter(c => c.dia === today);
  if (!todayClasses.length) { console.log('📅 Sin clases hoy.'); process.exit(0); }

  const upcoming = [], ended = [], started = [];
  todayClasses.forEach(c => {
    const diff    = c.inicioM - m;
    const diffEnd = c.finM - m;
    const range   = ALERT_RANGES.find(r => diff >= r.min && diff <= r.max);
    if (range) upcoming.push({ c, diff: range.label });
    if (diffEnd <= 0 && diffEnd >= -4) ended.push({ c });
    if (diff    <= 0 && diff    >= -4) started.push({ c });
  });

  if (!upcoming.length && !ended.length && !started.length) { console.log('⏸️ Sin alertas.'); process.exit(0); }

  const notifications = [];

  // ── Iniciadas ──
  if (started.length === 1) {
    const c = started[0].c;
    notifications.push({
      title: `🟢 Clase iniciada — ${c.aula}`,
      body: formatClaseSingle(c),
      tag: `started-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  } else if (started.length > 1) {
    notifications.push({
      title: `🟢 ${started.length} clases iniciadas`,
      body: started.map(({ c }) => formatClaseCompact(c)).join('\n'),
      tag: `started-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  }

  // ── Próximas ──
  const byDiff = {};
  upcoming.forEach(({ c, diff }) => { if (!byDiff[diff]) byDiff[diff] = []; byDiff[diff].push(c); });
  Object.entries(byDiff).forEach(([diff, cs]) => {
    if (cs.length === 1) {
      notifications.push({
        title: `⏰ Clase en ${diff} min — ${cs[0].aula}`,
        body: formatClaseSingle(cs[0]),
        tag: `upcoming-${diff}min-${m}`,
        url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
      });
    } else {
      notifications.push({
        title: `⏰ ${cs.length} clases en ${diff} min`,
        body: cs.map(c => formatClaseCompact(c)).join('\n'),
        tag: `upcoming-${diff}min-${m}`,
        url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
      });
    }
  });

  // ── Finalizadas ──
  if (ended.length === 1) {
    const c = ended[0].c;
    notifications.push({
      title: `✅ Clase finalizada — ${c.aula}`,
      body: formatClaseSingle(c),
      tag: `ended-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  } else if (ended.length > 1) {
    notifications.push({
      title: `✅ ${ended.length} clases finalizadas`,
      body: ended.map(({ c }) => formatClaseCompact(c)).join('\n'),
      tag: `ended-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  }

  for (const notif of notifications) {
    const result = await sendToAll(webSubs, fcmTokens, notif);
    console.log(`✅ "${notif.title}" → ok:${result.ok} exp:${result.expired} fail:${result.failed}`);
    // Guardar en historial
    await fetch(`${WORKER_URL}/notifications/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${WORKER_TOKEN}` },
      body: JSON.stringify({ title: notif.title, body: notif.body, ts: Date.now(), tag: notif.tag, url: notif.url }),
    }).catch(() => {});
  }

  console.log('✅ Fin.');
}

main().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1); });

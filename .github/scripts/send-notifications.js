// .github/scripts/send-notifications.js
// Usa FCM HTTP v1 API en vez de web-push

const WORKER_URL    = process.env.WORKER_URL;
const WORKER_TOKEN  = process.env.WORKER_AUTH_TOKEN;
const FCM_PROJECT   = process.env.FIREBASE_PROJECT_ID;
const FCM_EMAIL     = process.env.FIREBASE_CLIENT_EMAIL;
const FCM_KEY       = process.env.FIREBASE_PRIVATE_KEY;

const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const ALERT_RANGES = [
  { min: 13, max: 15, label: 15 },
  { min:  8, max: 10, label: 10 },
  { min:  3, max:  5, label:  5 },
];
const SLOTS = [
  {m:420},{m:465},{m:510},{m:555},{m:600},{m:645},{m:690},{m:735},
  {m:780},{m:825},{m:870},{m:915},{m:960},{m:1005},{m:1050},{m:1095},
  {m:1140},{m:1185},{m:1230},{m:1275},{m:1320},
];
const SLOT_LABELS = [
  '7:00 AM','7:45 AM','8:30 AM','9:15 AM','10:00 AM','10:45 AM','11:30 AM','12:15 PM',
  '1:00 PM','1:45 PM','2:30 PM','3:15 PM','4:00 PM','4:45 PM','5:30 PM','6:15 PM',
  '7:00 PM','7:45 PM','8:30 PM','9:15 PM','10:00 PM',
];

function nowRD() { return new Date(Date.now() - 4 * 3600000); }
function todayName() { return DIAS[nowRD().getUTCDay()]; }
function nowM() { const d = nowRD(); return d.getUTCHours() * 60 + d.getUTCMinutes(); }

// ── JWT para FCM ──────────────────────────────────────────────────────────────
const { createSign } = require('crypto');

function makeJWT() {
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
  // Normalizar la private key
  let privateKey = FCM_KEY;
  // Reemplazar \n literales con saltos de línea reales
  privateKey = privateKey.replace(/\\n/g, '\n');
  if (!privateKey.includes('\n')) privateKey = privateKey.replace(/\n/g, '\n');
  const sig = sign.sign(privateKey, 'base64url');
  return `${signingInput}.${sig}`;
}

async function getAccessToken() {
  const jwt = makeJWT();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No access token: ' + JSON.stringify(data));
  return data.access_token;
}

async function sendFCM(accessToken, fcmToken, notif) {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,
          notification: { title: notif.title, body: notif.body },
          android: { priority: 'high', notification: { sound: 'default' } },
          data: {
            url: notif.url || 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
            tag: notif.tag || 'utesa-push',
          },
        },
      }),
    }
  );
  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function getFCMTokens() {
  const res = await fetch(`${WORKER_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const subs = await res.json();
  // Extraer token FCM del endpoint Web Push de Chrome
  return subs
    .filter(s => s?.endpoint?.includes('fcm.googleapis.com') || s?.endpoint?.includes('firebase'))
    .map(s => {
      // El token es la última parte del endpoint
      const parts = s.endpoint.split('/');
      return parts[parts.length - 1].trim();
    })
    .filter(t => t && t.length > 10);
}

async function sendToAll(accessToken, notif, tokens) {
  let ok = 0, expired = 0, failed = 0;
  for (const token of tokens) {
    const result = await sendFCM(accessToken, token, notif);
    if (result.ok) {
      ok++;
    } else if (result.data?.error?.details?.[0]?.errorCode === 'UNREGISTERED' || result.status === 404) {
      expired++;
    } else {
      console.warn(`FCM error ${result.status}:`, JSON.stringify(result.data));
      failed++;
    }
  }
  return { ok, expired, failed };
}

async function main() {
  console.log('🔑 Obteniendo access token FCM...');
  const accessToken = await getAccessToken();
  console.log('✅ Token FCM obtenido');

  // ── Tokens FCM ──
  let tokens = [];
  try {
    tokens = await getFCMTokens();
    console.log(`📱 ${tokens.length} token(s) FCM`);
  } catch(e) {
    console.error('❌ Error obteniendo tokens:', e.message);
    process.exit(1);
  }

  if (!tokens.length) {
    console.log('Sin suscriptores FCM.');
    process.exit(0);
  }

  // ── Notificación manual pendiente ──
  try {
    const pendingRes = await fetch(`${WORKER_URL}/admin/pending-notification`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    if (pendingRes.ok) {
      const pending = await pendingRes.json();
      if (pending?.title) {
        console.log(`📢 Notificación manual: "${pending.title}"`);
        const result = await sendToAll(accessToken, pending, tokens);
        console.log(`"${pending.title}" → ✅ ${result.ok} | 🗑️ ${result.expired} expiradas | ❌ ${result.failed} errores`);
        await fetch(`${WORKER_URL}/admin/pending-notification`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
        }).catch(() => {});
        if (process.env.GITHUB_EVENT_NAME === 'repository_dispatch') {
          console.log('✅ Notificación manual enviada.'); process.exit(0);
        }
      }
    }
  } catch(e) { console.warn('⚠️ Error notif manual:', e.message); }

  // ── Alertas de clases ──
  let classes = [];
  try {
    const res = await fetch(`${WORKER_URL}/schedule`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const labelToM = {};
    SLOT_LABELS.forEach((l, i) => { labelToM[l] = SLOTS[i].m; });

    classes = (data.clases || []).filter(c => c.activa !== false).map(c => {
      let inicioM, finM, inicio, fin;
      if (typeof c.si === 'number') {
        inicioM = SLOTS[c.si].m;
        finM    = SLOTS[c.ei]?.m || 1320;
        inicio  = SLOT_LABELS[c.si];
        fin     = SLOT_LABELS[c.ei] || '10:00 PM';
      } else {
        inicioM = labelToM[c.hora_inicio] || 0;
        finM    = labelToM[c.hora_fin] || 0;
        inicio  = c.hora_inicio; fin = c.hora_fin;
      }
      return { ...c, inicioM, finM, inicio, fin };
    }).filter(c => c.inicioM > 0);
    console.log(`📋 ${classes.length} clases activas`);
  } catch(e) {
    console.error('❌ No se pudo obtener schedule:', e.message);
    process.exit(1);
  }

  const today = todayName();
  const m     = nowM();
  console.log(`🕐 Hora RD: ${nowRD().toUTCString()} | Día: ${today} | Minuto: ${m}`);

  const todayClasses = classes.filter(c => c.dia === today);
  if (!todayClasses.length) { console.log(`Sin clases hoy (${today}).`); process.exit(0); }

  const pending = [], ended = [], started = [];
  todayClasses.forEach(c => {
    const diff = c.inicioM - m;
    const diffEnd = c.finM - m;
    const range = ALERT_RANGES.find(r => diff >= r.min && diff <= r.max);
    if (range) pending.push({ c, diff: range.label });
    if (diffEnd <= 0 && diffEnd >= -2) ended.push({ c });
    if (diff <= 0 && diff >= -2) started.push({ c });
  });

  if (!pending.length && !ended.length && !started.length) {
    console.log('Sin alertas en este minuto.'); process.exit(0);
  }

  const notifications = [];

  if (started.length) {
    notifications.push({
      title: `🟢 ${started.length === 1 ? 'Clase iniciada' : `${started.length} clases iniciadas`}`,
      body: started.map(c => `🟢 ${c.aula} · ${c.mat} grp.${c.grp}\n⏰ ${c.inicio} → ${c.fin}`).join('\n\n'),
      tag: `started-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  }

  if (pending.length) {
    const byDiff = {};
    pending.forEach(({ c, diff }) => { if (!byDiff[diff]) byDiff[diff] = []; byDiff[diff].push(c); });
    Object.entries(byDiff).forEach(([diff, cs]) => {
      notifications.push({
        title: `⏰ ${cs.length === 1 ? `Clase en ${diff} min` : `${cs.length} clases en ${diff} min`}`,
        body: cs.map(c => `📍 ${c.aula} · ${c.mat} grp.${c.grp}\n⏰ ${c.inicio} → ${c.fin}`).join('\n\n'),
        tag: `upcoming-${diff}min-${m}`,
        url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
      });
    });
  }

  if (ended.length) {
    notifications.push({
      title: `✅ ${ended.length === 1 ? 'Clase finalizada' : `${ended.length} clases finalizadas`}`,
      body: ended.map(({ c }) => `✅ ${c.aula} · ${c.mat} grp.${c.grp} · ${c.inicio}→${c.fin}`).join('\n'),
      tag: `ended-${m}`,
      url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    });
  }

  for (const notif of notifications) {
    const result = await sendToAll(accessToken, notif, tokens);
    console.log(`"${notif.title}" → ✅ ${result.ok} | 🗑️ ${result.expired} | ❌ ${result.failed}`);
  }

  console.log('✅ Proceso completado.');
}

main().catch(e => { console.error('❌ Error fatal:', e.message); process.exit(1); });

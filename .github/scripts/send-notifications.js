const webpush = require('web-push');
const { SLOTS, raw } = require(__dirname + '/schedule-data.js');

// ── CONFIG ──
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@utesa.edu';
const ALERT_MINUTES = parseInt(process.env.ALERT_MINUTES || '15');

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

// ── SUBSCRIPTIONS ──
// Stored as JSON array in GitHub Secret PUSH_SUBSCRIPTIONS
let subscriptions = [];
try {
  subscriptions = JSON.parse(process.env.SUBSCRIPTIONS || '[]');
} catch(e) {
  console.error('Error parsing subscriptions:', e.message);
  process.exit(0);
}

if (!subscriptions.length) {
  console.log('No subscriptions yet.');
  process.exit(0);
}

// ── SCHEDULE DATA ──
const SLOT_END_M   = 1320;
const SLOT_END_LBL = '10:00 PM';

const classes = raw.map(c => ({
  ...c,
  durMin:  (c.ei - c.si) * 45,
  inicio:  SLOTS[c.si].l,
  fin:     SLOTS[c.ei] ? SLOTS[c.ei].l : SLOT_END_LBL,
  inicioM: SLOTS[c.si].m,
  finM:    SLOTS[c.ei] ? SLOTS[c.ei].m : SLOT_END_M,
}));

// ── TIME HELPERS ──
const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function nowRD() {
  // República Dominicana = UTC-4
  const utc = Date.now() + (new Date().getTimezoneOffset() * 60000);
  return new Date(utc - (4 * 3600000));
}

function todayName() {
  return DIAS[nowRD().getDay()];
}

function nowM() {
  const d = nowRD();
  return d.getHours() * 60 + d.getMinutes();
}

// ── CHECK ALERTS ──
const today = todayName();
const m     = nowM();

console.log(`🕐 Hora RD: ${nowRD().toLocaleTimeString()} | Día: ${today} | Minuto: ${m}`);

// Skip if today has no classes
const todayHasClasses = classes.some(c => c.dia === today);
if (!todayHasClasses) {
  console.log(`No hay clases programadas hoy (${today}).`);
  process.exit(0);
}

const pending = [];
const ended   = [];

classes.forEach(c => {
  if (c.dia !== today) return;

  const diff    = c.inicioM - m;
  const diffEnd = c.finM - m;

  // Clase próxima
  if (diff > 0 && diff <= ALERT_MINUTES) {
    pending.push({ c, diff });
  }

  // Clase finalizada (ventana de 2 min)
  if (diffEnd <= 0 && diffEnd >= -2) {
    ended.push({ c });
  }
});

if (!pending.length && !ended.length) {
  console.log('Sin alertas que enviar en este minuto.');
  process.exit(0);
}

console.log(`📬 Enviando: ${pending.length} próximas, ${ended.length} finalizadas`);

// ── BUILD NOTIFICATIONS ──
const notifications = [];

if (pending.length > 0) {
  const label = pending.length === 1
    ? `Clase en ${pending[0].diff} min`
    : `${pending.length} clases próximas`;

  const body = pending.map(({ c, diff }) =>
    `📍 ${c.aula} · ${c.mat} grp.${c.grp}\n⏰ ${c.inicio} → ${c.fin} · En ${diff} min`
  ).join('\n\n');

  notifications.push({
    title: `⏰ ${label}`,
    body,
    tag:  `upcoming-${m}`,
    icon: '/horarios-laboratorios-utesa/icon-192.png',
    badge:'/horarios-laboratorios-utesa/icon-192.png',
    url:  'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    vibrate: [100, 50, 100, 50, 300, 100, 300],
    requireInteraction: true,
  });
}

if (ended.length > 0) {
  const label = ended.length === 1 ? 'Clase finalizada' : `${ended.length} clases finalizadas`;
  const body  = ended.map(({ c }) =>
    `✅ ${c.aula} · ${c.mat} grp.${c.grp} · ${c.inicio}→${c.fin}`
  ).join('\n');

  notifications.push({
    title: `✅ ${label}`,
    body,
    tag:  `ended-${m}`,
    icon: '/horarios-laboratorios-utesa/icon-192.png',
    badge:'/horarios-laboratorios-utesa/icon-192.png',
    url:  'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    vibrate: [200, 100, 200],
  });
}

// ── SEND TO ALL SUBSCRIPTIONS ──
async function sendAll() {
  for (const notif of notifications) {
    const payload = JSON.stringify(notif);

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        console.log(`✅ Enviado a ${sub.endpoint.slice(-20)}`);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`🗑️  Suscripción expirada: ${sub.endpoint.slice(-20)}`);
          // TODO: remove expired subscriptions
        } else {
          console.error(`❌ Error enviando: ${err.message}`);
        }
      }
    }
  }
}

sendAll().then(() => {
  console.log('✅ Proceso completado.');
});

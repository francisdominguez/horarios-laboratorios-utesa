// .github/scripts/send-notifications.js

const webpush = require('web-push');
const path = require('path');

const { SLOTS, raw } = require(path.join(__dirname, 'schedule-data.js'));

// ── CONFIG ──
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@utesa.edu';
const WORKER_URL    = process.env.WORKER_URL;
const WORKER_TOKEN  = process.env.WORKER_AUTH_TOKEN;

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

// ── SUBSCRIPTIONS desde el Worker ──
let subscriptions = [];
try {
  const res = await fetch(`${WORKER_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
  });
  if (!res.ok) {
    console.error(`❌ Error obteniendo suscripciones del Worker: ${res.status}`);
    process.exit(1);
  }
  subscriptions = await res.json();
} catch(e) {
  console.error('❌ No se pudo conectar al Worker:', e.message);
  process.exit(1);
}

if (!subscriptions.length) {
  console.log('No hay suscriptores aún.');
  process.exit(0);
}

console.log(`📋 ${subscriptions.length} suscriptor(es) obtenidos del Worker`);

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
  return new Date(Date.now() - 4 * 3600000);
}
function todayName() {
  return DIAS[nowRD().getUTCDay()];
}
function nowM() {
  const d = nowRD();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

// ── RANGOS DE ALERTA ──
const ALERT_RANGES = [
  { min: 13, max: 15, label: 15 },
  { min:  8, max: 10, label: 10 },
  { min:  3, max:  5, label:  5 },
];

// ── CHECK ALERTS ──
const today = todayName();
const m     = nowM();

console.log(`🕐 Hora RD: ${nowRD().toUTCString()} | Día: ${today} | Minuto: ${m}`);

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
  const matchedRange = ALERT_RANGES.find(r => diff >= r.min && diff <= r.max);
  if (matchedRange) pending.push({ c, diff: matchedRange.label });
  if (diffEnd <= 0 && diffEnd >= -2) ended.push({ c });
});

if (!pending.length && !ended.length) {
  console.log('Sin alertas que enviar en este minuto.');
  process.exit(0);
}

console.log(`📬 Enviando: ${pending.length} próximas, ${ended.length} finalizadas`);

// ── BUILD NOTIFICATIONS ──
const notifications = [];

if (pending.length > 0) {
  const byDiff = {};
  pending.forEach(({ c, diff }) => {
    if (!byDiff[diff]) byDiff[diff] = [];
    byDiff[diff].push(c);
  });
  Object.entries(byDiff).forEach(([diff, cs]) => {
    const label = cs.length === 1 ? `Clase en ${diff} min` : `${cs.length} clases en ${diff} min`;
    const body  = cs.map(c => `📍 ${c.aula} · ${c.mat} grp.${c.grp}\n⏰ ${c.inicio} → ${c.fin}`).join('\n\n');
    notifications.push({
      title: `⏰ ${label}`, body,
      tag:   `upcoming-${diff}min-${m}`,
      icon:  '/horarios-laboratorios-utesa/icon-192.png',
      badge: '/horarios-laboratorios-utesa/icon-192.png',
      url:   'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
      vibrate: [100, 50, 100, 50, 300, 100, 300],
      requireInteraction: true,
    });
  });
}

if (ended.length > 0) {
  const label = ended.length === 1 ? 'Clase finalizada' : `${ended.length} clases finalizadas`;
  const body  = ended.map(({ c }) => `✅ ${c.aula} · ${c.mat} grp.${c.grp} · ${c.inicio}→${c.fin}`).join('\n');
  notifications.push({
    title: `✅ ${label}`, body,
    tag:   `ended-${m}`,
    icon:  '/horarios-laboratorios-utesa/icon-192.png',
    badge: '/horarios-laboratorios-utesa/icon-192.png',
    url:   'https://francisdominguez.github.io/horarios-laboratorios-utesa/',
    vibrate: [200, 100, 200],
  });
}

// ── SEND TO ALL SUBSCRIPTIONS ──
for (const notif of notifications) {
  const payload = JSON.stringify(notif);
  let ok = 0, expired = 0, failed = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      ok++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Eliminar suscripción expirada del Worker automáticamente
        await fetch(`${WORKER_URL}/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub)
        }).catch(() => {});
        console.log(`🗑️  Suscripción expirada eliminada del Worker`);
        expired++;
      } else if (err.statusCode === 401) {
        console.error(`🔑 Error 401: VAPID_PUBLIC_KEY no coincide con la suscripción.`);
        expired++;
      } else {
        console.error(`❌ Error ${err.statusCode}: ${err.message}`);
        failed++;
      }
    }
  }
  console.log(`"${notif.title}" → ✅ ${ok} enviadas | 🗑️ ${expired} expiradas | ❌ ${failed} errores`);
}

console.log('✅ Proceso completado.');

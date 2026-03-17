// .github/scripts/send-notifications.js

const webpush = require('web-push');

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@utesa.edu';
const WORKER_URL    = process.env.WORKER_URL;
const WORKER_TOKEN  = process.env.WORKER_AUTH_TOKEN;

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

const SLOT_END_M   = 1320;
const SLOT_END_LBL = '10:00 PM';
const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

const ALERT_RANGES = [
  { min: 13, max: 15, label: 15 },
  { min:  8, max: 10, label: 10 },
  { min:  3, max:  5, label:  5 },
];

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

async function main() {
  // ── 1. Obtener schedule fusionado del Worker (incluye admin overrides y disabled) ──
  let classes = [];
  try {
    const res = await fetch(`${WORKER_URL}/schedule`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Solo clases activas
    const raw = (data.clases || []).filter(c => c.activa !== false);

    // Convertir formato del Worker al formato que necesitamos
    // Las clases base usan si/ei, las del admin usan hora_inicio/hora_fin como strings
    const SLOTS = [
      {m:420,l:'7:00 AM'},{m:465,l:'7:45 AM'},{m:510,l:'8:30 AM'},{m:555,l:'9:15 AM'},
      {m:600,l:'10:00 AM'},{m:645,l:'10:45 AM'},{m:690,l:'11:30 AM'},{m:735,l:'12:15 PM'},
      {m:780,l:'1:00 PM'},{m:825,l:'1:45 PM'},{m:870,l:'2:30 PM'},{m:915,l:'3:15 PM'},
      {m:960,l:'4:00 PM'},{m:1005,l:'4:45 PM'},{m:1050,l:'5:30 PM'},{m:1095,l:'6:15 PM'},
      {m:1140,l:'7:00 PM'},{m:1185,l:'7:45 PM'},{m:1230,l:'8:30 PM'},{m:1275,l:'9:15 PM'},
      {m:1320,l:'10:00 PM'},
    ];

    // Mapa de label → minutos para clases del admin
    const labelToM = {};
    SLOTS.forEach(s => { labelToM[s.l] = s.m; });

    classes = raw.map(c => {
      let inicioM, finM, inicio, fin;

      if (typeof c.si === 'number') {
        // Clase base con índices de slot
        inicioM = SLOTS[c.si].m;
        finM    = SLOTS[c.ei] ? SLOTS[c.ei].m : SLOT_END_M;
        inicio  = SLOTS[c.si].l;
        fin     = SLOTS[c.ei] ? SLOTS[c.ei].l : SLOT_END_LBL;
      } else {
        // Clase del admin con strings de hora
        const hi = c.hora_inicio || '';
        const hf = c.hora_fin || '';
        // Intentar mapear desde label conocido
        inicioM = labelToM[hi] || parseTimeStr(hi);
        finM    = labelToM[hf] || parseTimeStr(hf);
        inicio  = hi;
        fin     = hf;
      }

      return { ...c, inicioM, finM, inicio, fin };
    }).filter(c => c.inicioM > 0);

    console.log(`📋 ${classes.length} clases activas cargadas del Worker`);
  } catch(e) {
    console.error('❌ No se pudo obtener el schedule del Worker:', e.message);
    process.exit(1);
  }

  // ── 2. Obtener suscripciones ──
  let subscriptions = [];
  try {
    const res = await fetch(`${WORKER_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    subscriptions = await res.json();
  } catch(e) {
    console.error('❌ No se pudo obtener suscripciones:', e.message);
    process.exit(1);
  }

  if (!subscriptions.length) {
    console.log('No hay suscriptores aún.');
    process.exit(0);
  }
  console.log(`👥 ${subscriptions.length} suscriptor(es)`);

  // ── 2b. Verificar notificación manual pendiente (siempre, independiente de clases) ──
  try {
    const pendingRes = await fetch(`${WORKER_URL}/admin/pending-notification`, {
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
    });
    console.log('📦 pending-notification status:', pendingRes.status);
    if (pendingRes.ok) {
      const pending = await pendingRes.json();
      console.log('📦 pending data:', JSON.stringify(pending));
      if (pending && pending.title) {
        console.log(`📢 Notificación manual: "${pending.title}"`);
        const payload = JSON.stringify(pending);
        let ok = 0, expired = 0, failed = 0;
        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification(sub, payload);
            ok++;
          } catch (err) {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await fetch(`${WORKER_URL}/unsubscribe`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
              }).catch(() => {});
              expired++;
            } else { failed++; }
          }
        }
        console.log(`"${pending.title}" → ✅ ${ok} | 🗑️ ${expired} expiradas | ❌ ${failed} errores`);
        await fetch(`${WORKER_URL}/admin/pending-notification`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${WORKER_TOKEN}` }
        }).catch(() => {});
        // Si fue dispatch manual terminar aquí
        if (process.env.GITHUB_EVENT_NAME === 'repository_dispatch') {
          console.log('✅ Notificación manual enviada.'); process.exit(0);
        }
      }
    }
  } catch(e) { console.warn('⚠️ Error verificando notif manual:', e.message); }

  // ── 3. Calcular alertas ──
  const today = todayName();
  const m     = nowM();
  console.log(`🕐 Hora RD: ${nowRD().toUTCString()} | Día: ${today} | Minuto: ${m}`);

  const todayClasses = classes.filter(c => c.dia === today);
  if (!todayClasses.length) {
    console.log(`No hay clases hoy (${today}).`);
    process.exit(0);
  }

  const pending = [];
  const ended   = [];

  todayClasses.forEach(c => {
    const diff    = c.inicioM - m;
    const diffEnd = c.finM - m;
    const matchedRange = ALERT_RANGES.find(r => diff >= r.min && diff <= r.max);
    if (matchedRange) pending.push({ c, diff: matchedRange.label });
    if (diffEnd <= 0 && diffEnd >= -2) ended.push({ c });
  });

  if (!pending.length && !ended.length) {
    console.log('Sin alertas en este minuto.');
    process.exit(0);
  }

  console.log(`📬 ${pending.length} próximas, ${ended.length} finalizadas`);

  // ── 4. Construir notificaciones ──
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
        vibrate: [100,50,100,50,300,100,300],
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
      vibrate: [200,100,200],
    });
  }

  // ── 5. Enviar ──
  for (const notif of notifications) {
    const payload = JSON.stringify(notif);
    let ok = 0, expired = 0, failed = 0;

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        ok++;
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await fetch(`${WORKER_URL}/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
          }).catch(() => {});
          expired++;
        } else if (err.statusCode === 401) {
          console.error('🔑 Error 401: VAPID_PUBLIC_KEY no coincide.');
          expired++;
        } else {
          console.error(`❌ Error ${err.statusCode}: ${err.message}`);
          failed++;
        }
      }
    }
    console.log(`"${notif.title}" → ✅ ${ok} | 🗑️ ${expired} expiradas | ❌ ${failed} errores`);
  }

  console.log('✅ Proceso completado.');
}

// Parsear strings como "07:00" o "1:00 PM" a minutos
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

main();

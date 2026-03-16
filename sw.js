const CACHE = 'utesa-labs-v23';
const ASSETS = [
  '/horarios-laboratorios-utesa/',
  '/horarios-laboratorios-utesa/index.html',
  '/horarios-laboratorios-utesa/manifest.json',
  '/horarios-laboratorios-utesa/icon-192.png',
  '/horarios-laboratorios-utesa/icon-512.png',
  '/horarios-laboratorios-utesa/img0.jpeg',
  '/horarios-laboratorios-utesa/img1.jpeg',
  '/horarios-laboratorios-utesa/img2.jpeg',
  '/horarios-laboratorios-utesa/img3.jpeg',
  '/horarios-laboratorios-utesa/img4.jpeg',
  '/horarios-laboratorios-utesa/img5.jpeg',
  '/horarios-laboratorios-utesa/img6.jpeg',
  '/horarios-laboratorios-utesa/img7.jpeg',
  '/horarios-laboratorios-utesa/img8.jpeg',
  '/horarios-laboratorios-utesa/img9.jpeg',
  '/horarios-laboratorios-utesa/img10.jpeg',
  '/horarios-laboratorios-utesa/img11.jpeg',
  '/horarios-laboratorios-utesa/img12.jpeg',
  '/horarios-laboratorios-utesa/img13.jpeg',
  '/horarios-laboratorios-utesa/img14.jpeg',
  '/horarios-laboratorios-utesa/img15.jpeg',
  '/horarios-laboratorios-utesa/img16.jpeg',
  '/horarios-laboratorios-utesa/img17.jpeg',
  '/horarios-laboratorios-utesa/img18.jpeg',
  '/horarios-laboratorios-utesa/img19.jpeg',
  '/horarios-laboratorios-utesa/img20.jpeg',
  '/horarios-laboratorios-utesa/img21.jpeg',
  '/horarios-laboratorios-utesa/img22.jpeg',
  '/horarios-laboratorios-utesa/img23.jpeg',
  '/horarios-laboratorios-utesa/img24.jpeg',
  '/horarios-laboratorios-utesa/img25.jpeg',
  '/horarios-laboratorios-utesa/img26.jpeg',
  '/horarios-laboratorios-utesa/img27.jpeg',
];

// ── DATOS DE CLASES (para alertas en background) ──
const SLOTS=[
  {m:420,l:'7:00 AM'},{m:465,l:'7:45 AM'},{m:510,l:'8:30 AM'},{m:555,l:'9:15 AM'},
  {m:600,l:'10:00 AM'},{m:645,l:'10:45 AM'},{m:690,l:'11:30 AM'},{m:735,l:'12:15 PM'},
  {m:780,l:'1:00 PM'},{m:825,l:'1:45 PM'},{m:870,l:'2:30 PM'},{m:915,l:'3:15 PM'},
  {m:960,l:'4:00 PM'},{m:1005,l:'4:45 PM'},{m:1050,l:'5:30 PM'},{m:1095,l:'6:15 PM'},
  {m:1140,l:'7:00 PM'},{m:1185,l:'7:45 PM'},{m:1230,l:'8:30 PM'},{m:1275,l:'9:15 PM'},
  {m:1320,l:'10:00 PM'},
];
const SLOT_END_M=1320, SLOT_END_LBL='10:00 PM';
const raw=[
  // B120
  {aula:'B120',mat:'ICV416',grp:'004',dia:'Lunes',     si:11,ei:15},
  {aula:'B120',mat:'ICV245',grp:'008',dia:'Martes',    si:12,ei:14},
  {aula:'B120',mat:'ICV245',grp:'006',dia:'Martes',    si:15,ei:17},
  {aula:'B120',mat:'ICV416',grp:'001',dia:'Miércoles', si:11,ei:15},
  {aula:'B120',mat:'ICV245',grp:'005',dia:'Jueves',    si:14,ei:16},
  // B121
  {aula:'B121',mat:'ICV223',grp:'001',dia:'Lunes',     si:6, ei:10},
  {aula:'B121',mat:'ICV416',grp:'003',dia:'Lunes',     si:10,ei:14},
  {aula:'B121',mat:'ICV223',grp:'003',dia:'Miércoles', si:10,ei:14},
  {aula:'B121',mat:'ICV195',grp:'001',dia:'Miércoles', si:16,ei:18},
  {aula:'B121',mat:'ICV223',grp:'004',dia:'Jueves',    si:10,ei:14},
  {aula:'B121',mat:'ICV195',grp:'003',dia:'Viernes',   si:16,ei:18},
  {aula:'B121',mat:'ICV223',grp:'002',dia:'Sábado',    si:3, ei:7},
  {aula:'B121',mat:'ICV416',grp:'002',dia:'Sábado',    si:10,ei:14},
  // B123
  {aula:'B123',mat:'ICV955',grp:'006',dia:'Lunes',     si:11,ei:13},
  {aula:'B123',mat:'ICV475',grp:'001',dia:'Lunes',     si:13,ei:15},
  {aula:'B123',mat:'IMC925',grp:'001',dia:'Lunes',     si:18,ei:20},
  {aula:'B123',mat:'ICV955',grp:'009',dia:'Martes',    si:9, ei:11},
  {aula:'B123',mat:'ICV475',grp:'003',dia:'Martes',    si:11,ei:13},
  {aula:'B123',mat:'ICV955',grp:'007',dia:'Martes',    si:13,ei:15},
  {aula:'B123',mat:'ICV955',grp:'004',dia:'Martes',    si:15,ei:17},
  {aula:'B123',mat:'ICV475',grp:'006',dia:'Miércoles', si:16,ei:18},
  {aula:'B123',mat:'IMC925',grp:'004',dia:'Miércoles', si:18,ei:20},
  {aula:'B123',mat:'IMC015',grp:'001',dia:'Jueves',    si:18,ei:20},
  {aula:'B123',mat:'ICV475',grp:'004',dia:'Viernes',   si:14,ei:16},
  // B213
  {aula:'B213',mat:'MED203',grp:'004',dia:'Lunes',     si:0, ei:2},
  {aula:'B213',mat:'MED203',grp:'009',dia:'Lunes',     si:8, ei:10},
  {aula:'B213',mat:'MED203',grp:'007',dia:'Lunes',     si:10,ei:12},
  {aula:'B213',mat:'INF117',grp:'004',dia:'Lunes',     si:15,ei:18},
  {aula:'B213',mat:'INF117',grp:'009',dia:'Lunes',     si:18,ei:20},
  {aula:'B213',mat:'INF113',grp:'014',dia:'Martes',    si:5, ei:9},
  {aula:'B213',mat:'MED203',grp:'016',dia:'Martes',    si:9, ei:11},
  {aula:'B213',mat:'INF164',grp:'002',dia:'Martes',    si:13,ei:16},
  {aula:'B213',mat:'MED203',grp:'012',dia:'Martes',    si:16,ei:18},
  {aula:'B213',mat:'INF117',grp:'009',dia:'Martes',    si:18,ei:20},
  {aula:'B213',mat:'MED203',grp:'005',dia:'Miércoles', si:0, ei:2},
  {aula:'B213',mat:'MED203',grp:'007',dia:'Miércoles', si:8, ei:10},
  {aula:'B213',mat:'MED203',grp:'016',dia:'Miércoles', si:10,ei:12},
  {aula:'B213',mat:'INF103',grp:'028',dia:'Miércoles', si:12,ei:15},
  {aula:'B213',mat:'INF117',grp:'004',dia:'Miércoles', si:15,ei:18},
  {aula:'B213',mat:'INF117',grp:'009',dia:'Miércoles', si:18,ei:20},
  {aula:'B213',mat:'MED203',grp:'005',dia:'Jueves',    si:0, ei:2},
  {aula:'B213',mat:'INF103',grp:'081',dia:'Jueves',    si:3, ei:6},
  {aula:'B213',mat:'MED203',grp:'008',dia:'Jueves',    si:6, ei:10},
  {aula:'B213',mat:'MED203',grp:'011',dia:'Jueves',    si:13,ei:17},
  {aula:'B213',mat:'INF103',grp:'004',dia:'Jueves',    si:17,ei:20},
  {aula:'B213',mat:'MED203',grp:'004',dia:'Viernes',   si:0, ei:2},
  {aula:'B213',mat:'MER402',grp:'001',dia:'Viernes',   si:15,ei:17},
  {aula:'B213',mat:'INF113',grp:'037',dia:'Viernes',   si:18,ei:20},
  {aula:'B213',mat:'INF503',grp:'002',dia:'Sábado',    si:3, ei:7},
  // B217
  {aula:'B217',mat:'INF113',grp:'043',dia:'Lunes',     si:14,ei:16},
  {aula:'B217',mat:'CON500',grp:'004',dia:'Lunes',     si:17,ei:20},
  {aula:'B217',mat:'INF706',grp:'007',dia:'Martes',    si:14,ei:18},
  {aula:'B217',mat:'CCO145',grp:'001',dia:'Martes',    si:18,ei:20},
  {aula:'B217',mat:'CCO225',grp:'001',dia:'Miércoles', si:14,ei:17},
  {aula:'B217',mat:'CCO145',grp:'001',dia:'Miércoles', si:17,ei:20},
  {aula:'B217',mat:'INF700',grp:'001',dia:'Jueves',    si:17,ei:20},
  {aula:'B217',mat:'CCO130',grp:'001',dia:'Viernes',   si:17,ei:20},
  {aula:'B217',mat:'INF910',grp:'002',dia:'Sábado',    si:4, ei:7},
  // B211
  {aula:'B211',mat:'INF412',grp:'003',dia:'Lunes',     si:14,ei:16},
  {aula:'B211',mat:'TUR220',grp:'001',dia:'Martes',    si:15,ei:17},
  {aula:'B211',mat:'INF406',grp:'004',dia:'Miércoles', si:14,ei:16},
  {aula:'B211',mat:'CCO906',grp:'001',dia:'Miércoles', si:17,ei:20},
  {aula:'B211',mat:'TUR220',grp:'001',dia:'Jueves',    si:4, ei:6},
  {aula:'B211',mat:'CCO530',grp:'001',dia:'Jueves',    si:16,ei:19},
  {aula:'B211',mat:'CCO176',grp:'001',dia:'Viernes',   si:14,ei:17},
  {aula:'B211',mat:'CCO305',grp:'001',dia:'Sábado',    si:3, ei:5},
  // B219
  {aula:'B219',mat:'INF113',grp:'055',dia:'Lunes',     si:1, ei:5},
  {aula:'B219',mat:'INF113',grp:'056',dia:'Lunes',     si:5, ei:9},
  {aula:'B219',mat:'INF503',grp:'001',dia:'Lunes',     si:14,ei:16},
  {aula:'B219',mat:'INF840',grp:'001',dia:'Lunes',     si:16,ei:20},
  {aula:'B219',mat:'INF117',grp:'008',dia:'Martes',    si:9, ei:12},
  {aula:'B219',mat:'INF168',grp:'003',dia:'Martes',    si:13,ei:15},
  {aula:'B219',mat:'INF700',grp:'002',dia:'Martes',    si:16,ei:18},
  {aula:'B219',mat:'INF185',grp:'001',dia:'Martes',    si:18,ei:20},
  {aula:'B219',mat:'INF117',grp:'008',dia:'Miércoles', si:9, ei:12},
  {aula:'B219',mat:'INF113',grp:'037',dia:'Miércoles', si:14,ei:16},
  {aula:'B219',mat:'INF113',grp:'021',dia:'Miércoles', si:16,ei:20},
  {aula:'B219',mat:'MED203',grp:'012',dia:'Jueves',    si:15,ei:17},
  {aula:'B219',mat:'MED963',grp:'001',dia:'Jueves',    si:17,ei:20},
  {aula:'B219',mat:'INF503',grp:'001',dia:'Viernes',   si:14,ei:16},
  {aula:'B219',mat:'INF820',grp:'002',dia:'Viernes',   si:16,ei:19},
  {aula:'B219',mat:'INF025',grp:'002',dia:'Sábado',    si:1, ei:6},
  // C001 — Máquinas y Herramientas
  {aula:'C001',mat:'IMC215',grp:'001',dia:'Lunes',si:14,ei:16},
  {aula:'C001',mat:'IMC105',grp:'002',dia:'Lunes',si:16,ei:18},
  {aula:'C001',mat:'IID631',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C001',mat:'IMC305',grp:'003',dia:'Martes',si:16,ei:18},
  {aula:'C001',mat:'IID631',grp:'002',dia:'Miércoles',si:18,ei:20},
  {aula:'C001',mat:'IMC321',grp:'001',dia:'Jueves',si:16,ei:18},
  {aula:'C001',mat:'IMC321',grp:'003',dia:'Jueves',si:18,ei:20},
  // C1002 — Taller de Bancos
  {aula:'C1002',mat:'IMC105',grp:'011',dia:'Jueves',si:14,ei:16},
  {aula:'C1002',mat:'IMC426',grp:'001',dia:'Lunes',si:16,ei:18},
  {aula:'C1002',mat:'IID631',grp:'001',dia:'Martes',si:16,ei:18},
  {aula:'C1002',mat:'IMC321',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C1002',mat:'IMC321',grp:'004',dia:'Miércoles',si:18,ei:20},
  {aula:'C1002',mat:'IID631',grp:'001',dia:'Viernes',si:18,ei:20},
  // C101 — Lab. Industrial
  {aula:'C101',mat:'ARQ540',grp:'001',dia:'Lunes',si:3,ei:5},
  {aula:'C101',mat:'IID915',grp:'002',dia:'Lunes',si:14,ei:16},
  {aula:'C101',mat:'IID870',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C101',mat:'ARQ605',grp:'001',dia:'Martes',si:12,ei:14},
  {aula:'C101',mat:'IID522',grp:'002',dia:'Martes',si:13,ei:17},
  {aula:'C101',mat:'IET921',grp:'001',dia:'Martes',si:17,ei:20},
  {aula:'C101',mat:'IID522',grp:'002',dia:'Miércoles',si:13,ei:16},
  {aula:'C101',mat:'IID915',grp:'002',dia:'Miércoles',si:16,ei:18},
  {aula:'C101',mat:'IID870',grp:'002',dia:'Miércoles',si:18,ei:20},
  {aula:'C101',mat:'IEL425',grp:'001',dia:'Jueves',si:14,ei:16},
  {aula:'C101',mat:'IID500',grp:'001',dia:'Jueves',si:16,ei:18},
  {aula:'C101',mat:'IID481',grp:'003',dia:'Jueves',si:18,ei:20},
  {aula:'C101',mat:'ARQ605',grp:'001',dia:'Viernes',si:10,ei:12},
  {aula:'C101',mat:'IEL905',grp:'003',dia:'Viernes',si:14,ei:16},
  {aula:'C101',mat:'IID950',grp:'003',dia:'Viernes',si:16,ei:20},
  {aula:'C101',mat:'IID522',grp:'001',dia:'Sábado',si:1,ei:7},
  {aula:'C101',mat:'IID950',grp:'001',dia:'Sábado',si:8,ei:12},
  // C102 C102 — Automatización
  {aula:'C102',mat:'IID420',grp:'001',dia:'Lunes',si:11,ei:14},
  {aula:'C102',mat:'IID615',grp:'002',dia:'Lunes',si:14,ei:16},
  {aula:'C102',mat:'IID420',grp:'002',dia:'Lunes',si:17,ei:20},
  {aula:'C102',mat:'IID420',grp:'007',dia:'Martes',si:14,ei:18},
  {aula:'C102',mat:'IMC925',grp:'003',dia:'Martes',si:17,ei:19},
  {aula:'C102',mat:'IMC915',grp:'001',dia:'Miércoles',si:15,ei:17},
  {aula:'C102',mat:'IID420',grp:'008',dia:'Miércoles',si:17,ei:20},
  {aula:'C102',mat:'IID980',grp:'001',dia:'Jueves',si:14,ei:17},
  {aula:'C102',mat:'IID420',grp:'004',dia:'Jueves',si:17,ei:20},
  {aula:'C102',mat:'IEL405',grp:'008',dia:'Viernes',si:14,ei:16},
  {aula:'C102',mat:'IID420',grp:'003',dia:'Viernes',si:17,ei:20},
  // C103  — Lab. Industrial 02
  {aula:'C103',mat:'ICV215',grp:'006',dia:'Miércoles',si:12,ei:15},
  {aula:'C103',mat:'IID480',grp:'001',dia:'Lunes',si:15,ei:18},
  {aula:'C103',mat:'IID481',grp:'001',dia:'Lunes',si:18,ei:20},
  {aula:'C103',mat:'INF705',grp:'002',dia:'Martes',si:16,ei:18},
  {aula:'C103',mat:'IID480',grp:'003',dia:'Martes',si:18,ei:20},
  {aula:'C103',mat:'IET725',grp:'003',dia:'Miércoles',si:15,ei:17},
  {aula:'C103',mat:'IID481',grp:'001',dia:'Miércoles',si:18,ei:20},
  {aula:'C103',mat:'IID481',grp:'003',dia:'Jueves',si:16,ei:20},
  {aula:'C103',mat:'IID481',grp:'005',dia:'Viernes',si:13,ei:17},
  {aula:'C103',mat:'ICV215',grp:'001',dia:'Viernes',si:17,ei:20},
  {aula:'C103',mat:'IID480',grp:'003',dia:'Miércoles',si:16,ei:18},
  {aula:'C103',mat:'IET725',grp:'003',dia:'Jueves',si:14,ei:16},
  // C104 — Lab. CAD CAM
  {aula:'C104',mat:'IET825',grp:'001',dia:'Lunes',si:14,ei:16},
  {aula:'C104',mat:'INF706',grp:'004',dia:'Martes',si:14,ei:16},
  {aula:'C104',mat:'IMC500',grp:'001',dia:'Martes',si:16,ei:20},
  {aula:'C104',mat:'IMC102',grp:'001',dia:'Miércoles',si:16,ei:18},
  {aula:'C104',mat:'IMC070',grp:'001',dia:'Jueves',si:14,ei:16},
  {aula:'C104',mat:'IMC102',grp:'001',dia:'Viernes',si:16,ei:19},
  {aula:'C104',mat:'IMC530',grp:'001',dia:'Sábado',si:7,ei:10},
  // C105 — Ing. Térmica
  {aula:'C105',mat:'IMC960',grp:'001',dia:'Lunes',si:14,ei:18},
  {aula:'C105',mat:'IMC965',grp:'001',dia:'Lunes',si:18,ei:20},
  {aula:'C105',mat:'IMC070',grp:'001',dia:'Martes',si:14,ei:16},
  {aula:'C105',mat:'IMC075',grp:'001',dia:'Martes',si:16,ei:18},
  {aula:'C105',mat:'IEL140',grp:'001',dia:'Miércoles',si:14,ei:16},
  {aula:'C105',mat:'IMC805',grp:'002',dia:'Miércoles',si:16,ei:18},
  {aula:'C105',mat:'IEL405',grp:'001',dia:'Miércoles',si:18,ei:20},
  {aula:'C105',mat:'IEL520',grp:'001',dia:'Viernes',si:16,ei:18},
  {aula:'C105',mat:'IMC805',grp:'001',dia:'Sábado',si:10,ei:12},
  // C106 — Lab. Neumática
  {aula:'C106',mat:'IMC675',grp:'001',dia:'Lunes',si:15,ei:17},
  {aula:'C106',mat:'IMC635',grp:'003',dia:'Martes',si:16,ei:18},
  {aula:'C106',mat:'IMC110',grp:'002',dia:'Martes',si:18,ei:20},
  {aula:'C106',mat:'IMC920',grp:'001',dia:'Miércoles',si:15,ei:18},
  {aula:'C106',mat:'INF706',grp:'004',dia:'Jueves',si:14,ei:16},
  {aula:'C106',mat:'IID241',grp:'002',dia:'Jueves',si:16,ei:18},
  {aula:'C106',mat:'IID241',grp:'004',dia:'Jueves',si:18,ei:20},
  {aula:'C106',mat:'IMC815',grp:'001',dia:'Viernes',si:14,ei:16},
  {aula:'C106',mat:'IEL915',grp:'003',dia:'Sábado',si:8,ei:10},
  // C107 — Inst. Eléctricas
  {aula:'C107',mat:'IEL315',grp:'004',dia:'Lunes',si:14,ei:16},
  {aula:'C107',mat:'IEL405',grp:'009',dia:'Martes',si:12,ei:14},
  {aula:'C107',mat:'IET930',grp:'001',dia:'Martes',si:14,ei:17},
  {aula:'C107',mat:'IEL405',grp:'006',dia:'Martes',si:18,ei:20},
  {aula:'C107',mat:'IEL640',grp:'001',dia:'Miércoles',si:11,ei:14},
  {aula:'C107',mat:'IEL505',grp:'001',dia:'Miércoles',si:14,ei:16},
  {aula:'C107',mat:'IEL500',grp:'001',dia:'Miércoles',si:16,ei:19},
  {aula:'C107',mat:'IEL405',grp:'002',dia:'Jueves',si:14,ei:16},
  {aula:'C107',mat:'IEL640',grp:'001',dia:'Jueves',si:17,ei:20},
  {aula:'C107',mat:'IEL640',grp:'001',dia:'Viernes',si:11,ei:14},
  {aula:'C107',mat:'IEL620',grp:'001',dia:'Viernes',si:18,ei:20},
  // C201 — Lab. Informática
  {aula:'C201',mat:'INF103',grp:'056',dia:'Lunes',si:3,ei:6},
  {aula:'C201',mat:'INF113',grp:'017',dia:'Lunes',si:6,ei:8},
  {aula:'C201',mat:'INF103',grp:'057',dia:'Lunes',si:9,ei:12},
  {aula:'C201',mat:'INF113',grp:'040',dia:'Lunes',si:12,ei:14},
  {aula:'C201',mat:'INF204',grp:'003',dia:'Lunes',si:14,ei:17},
  {aula:'C201',mat:'CCO222',grp:'004',dia:'Lunes',si:16,ei:20},
  {aula:'C201',mat:'INF113',grp:'023',dia:'Martes',si:1,ei:3},
  {aula:'C201',mat:'INF103',grp:'031',dia:'Martes',si:3,ei:6},
  {aula:'C201',mat:'INF113',grp:'017',dia:'Martes',si:6,ei:8},
  {aula:'C201',mat:'INF113',grp:'031',dia:'Martes',si:9,ei:11},
  {aula:'C201',mat:'INF113',grp:'006',dia:'Martes',si:12,ei:14},
  {aula:'C201',mat:'INF204',grp:'003',dia:'Martes',si:14,ei:17},
  {aula:'C201',mat:'INF103',grp:'009',dia:'Martes',si:17,ei:20},
  {aula:'C201',mat:'INF113',grp:'023',dia:'Miércoles',si:1,ei:5},
  {aula:'C201',mat:'INF113',grp:'024',dia:'Miércoles',si:5,ei:9},
  {aula:'C201',mat:'INF113',grp:'006',dia:'Miércoles',si:12,ei:14},
  {aula:'C201',mat:'INF117',grp:'007',dia:'Miércoles',si:14,ei:18},
  {aula:'C201',mat:'MED203',grp:'021',dia:'Miércoles',si:18,ei:20},
  {aula:'C201',mat:'INF103',grp:'093',dia:'Jueves',si:1,ei:4},
  {aula:'C201',mat:'INF103',grp:'025',dia:'Jueves',si:8,ei:11},
  {aula:'C201',mat:'INF113',grp:'013',dia:'Jueves',si:12,ei:16},
  {aula:'C201',mat:'INF345',grp:'001',dia:'Jueves',si:18,ei:20},
  {aula:'C201',mat:'INF103',grp:'038',dia:'Viernes',si:4,ei:7},
  {aula:'C201',mat:'INF103',grp:'072',dia:'Viernes',si:8,ei:11},
  {aula:'C201',mat:'INF103',grp:'013',dia:'Viernes',si:11,ei:14},
  {aula:'C201',mat:'INF113',grp:'028',dia:'Viernes',si:14,ei:18},
  {aula:'C201',mat:'INF113',grp:'032',dia:'Viernes',si:18,ei:20},
  {aula:'C201',mat:'INF445',grp:'001',dia:'Sábado',si:2,ei:6},
  {aula:'C201',mat:'INF331',grp:'003',dia:'Sábado',si:8,ei:11},
  {aula:'C201',mat:'INF204',grp:'003',dia:'Miércoles',si:18,ei:20},
  {aula:'C201',mat:'INF387',grp:'001',dia:'Jueves',si:16,ei:18},
  // C202 — Lab. Informática 02
  {aula:'C202',mat:'INF113',grp:'009',dia:'Lunes',si:1,ei:5},
  {aula:'C202',mat:'INF103',grp:'098',dia:'Lunes',si:15,ei:18},
  {aula:'C202',mat:'INF173',grp:'006',dia:'Lunes',si:18,ei:20},
  {aula:'C202',mat:'INF113',grp:'011',dia:'Martes',si:1,ei:5},
  {aula:'C202',mat:'INF103',grp:'017',dia:'Martes',si:5,ei:8},
  {aula:'C202',mat:'INF103',grp:'016',dia:'Martes',si:12,ei:15},
  {aula:'C202',mat:'INF103',grp:'035',dia:'Martes',si:9,ei:12},
  {aula:'C202',mat:'INF103',grp:'001',dia:'Martes',si:15,ei:18},
  {aula:'C202',mat:'INF406',grp:'001',dia:'Martes',si:18,ei:20},
  {aula:'C202',mat:'INF103',grp:'007',dia:'Miércoles',si:2,ei:5},
  {aula:'C202',mat:'INF103',grp:'060',dia:'Miércoles',si:5,ei:8},
  {aula:'C202',mat:'INF103',grp:'021',dia:'Miércoles',si:11,ei:14},
  {aula:'C202',mat:'INF353',grp:'011',dia:'Miércoles',si:14,ei:15},
  {aula:'C202',mat:'INF103',grp:'010',dia:'Miércoles',si:17,ei:20},
  {aula:'C202',mat:'INF103',grp:'019',dia:'Jueves',si:10,ei:13},
  {aula:'C202',mat:'INF165',grp:'006',dia:'Jueves',si:13,ei:15},
  {aula:'C202',mat:'MED203',grp:'014',dia:'Jueves',si:17,ei:20},
  {aula:'C202',mat:'INF113',grp:'026',dia:'Viernes',si:1,ei:5},
  {aula:'C202',mat:'INF113',grp:'027',dia:'Viernes',si:5,ei:9},
  {aula:'C202',mat:'INF113',grp:'025',dia:'Viernes',si:12,ei:16},
  {aula:'C202',mat:'CON500',grp:'002',dia:'Viernes',si:15,ei:17},
  {aula:'C202',mat:'INF482',grp:'001',dia:'Viernes',si:16,ei:18},
  {aula:'C202',mat:'INF113',grp:'033',dia:'Viernes',si:18,ei:20},
  {aula:'C202',mat:'INF225',grp:'002',dia:'Sábado',si:6,ei:12},
  {aula:'C202',mat:'CON500',grp:'002',dia:'Jueves',si:15,ei:17},
  // C203 — Lab. Informática 03
  {aula:'C203',mat:'MED203',grp:'001',dia:'Lunes',si:3,ei:5},
  {aula:'C203',mat:'MED203',grp:'002',dia:'Lunes',si:5,ei:7},
  {aula:'C203',mat:'INF117',grp:'003',dia:'Lunes',si:12,ei:15},
  {aula:'C203',mat:'INF103',grp:'006',dia:'Lunes',si:15,ei:18},
  {aula:'C203',mat:'INF353',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C203',mat:'MED203',grp:'001',dia:'Martes',si:3,ei:5},
  {aula:'C203',mat:'MED203',grp:'002',dia:'Martes',si:5,ei:7},
  {aula:'C203',mat:'MED203',grp:'003',dia:'Martes',si:7,ei:9},
  {aula:'C203',mat:'INF103',grp:'023',dia:'Martes',si:11,ei:14},
  {aula:'C203',mat:'CON500',grp:'001',dia:'Martes',si:18,ei:20},
  {aula:'C203',mat:'INF113',grp:'038',dia:'Miércoles',si:4,ei:8},
  {aula:'C203',mat:'INF117',grp:'003',dia:'Miércoles',si:12,ei:15},
  {aula:'C203',mat:'INF173',grp:'002',dia:'Miércoles',si:15,ei:17},
  {aula:'C203',mat:'INF113',grp:'019',dia:'Miércoles',si:10,ei:12},
  {aula:'C203',mat:'CON500',grp:'001',dia:'Miércoles',si:19,ei:20},
  {aula:'C203',mat:'INF113',grp:'007',dia:'Jueves',si:4,ei:8},
  {aula:'C203',mat:'INF113',grp:'019',dia:'Jueves',si:10,ei:12},
  {aula:'C203',mat:'INF353',grp:'011',dia:'Jueves',si:12,ei:14},
  {aula:'C203',mat:'INF113',grp:'046',dia:'Jueves',si:14,ei:18},
  {aula:'C203',mat:'INF214',grp:'001',dia:'Jueves',si:18,ei:20},
  {aula:'C203',mat:'INF113',grp:'047',dia:'Viernes',si:1,ei:5},
  {aula:'C203',mat:'INF113',grp:'048',dia:'Viernes',si:5,ei:9},
  {aula:'C203',mat:'INF113',grp:'029',dia:'Viernes',si:14,ei:16},
  {aula:'C203',mat:'INF706',grp:'001',dia:'Viernes',si:16,ei:20},
  {aula:'C203',mat:'INF706',grp:'006',dia:'Sábado',si:3,ei:7},
  {aula:'C203',mat:'INF408',grp:'007',dia:'Sábado',si:8,ei:12},
  {aula:'C203',mat:'MED203',grp:'003',dia:'Lunes',si:7,ei:9},
  {aula:'C203',mat:'INF113',grp:'029',dia:'Martes',si:16,ei:18},
  {aula:'C203',mat:'INF103',grp:'030',dia:'Jueves',si:8,ei:9},
  // C204 — Lab. Informática 04
  {aula:'C204',mat:'INF113',grp:'049',dia:'Lunes',si:1,ei:5},
  {aula:'C204',mat:'INF113',grp:'035',dia:'Lunes',si:5,ei:9},
  {aula:'C204',mat:'INF113',grp:'041',dia:'Lunes',si:10,ei:14},
  {aula:'C204',mat:'INF204',grp:'004',dia:'Lunes',si:16,ei:18},
  {aula:'C204',mat:'INF165',grp:'007',dia:'Lunes',si:18,ei:20},
  {aula:'C204',mat:'INF103',grp:'022',dia:'Martes',si:2,ei:5},
  {aula:'C204',mat:'INF103',grp:'003',dia:'Martes',si:5,ei:8},
  {aula:'C204',mat:'INF113',grp:'016',dia:'Martes',si:12,ei:15},
  {aula:'C204',mat:'INF387',grp:'003',dia:'Martes',si:14,ei:16},
  {aula:'C204',mat:'INF113',grp:'032',dia:'Martes',si:16,ei:18},
  {aula:'C204',mat:'INF103',grp:'032',dia:'Martes',si:18,ei:20},
  {aula:'C204',mat:'INF113',grp:'036',dia:'Miércoles',si:1,ei:5},
  {aula:'C204',mat:'INF113',grp:'016',dia:'Miércoles',si:12,ei:15},
  {aula:'C204',mat:'INF113',grp:'044',dia:'Miércoles',si:7,ei:11},
  {aula:'C204',mat:'MER402',grp:'003',dia:'Miércoles',si:18,ei:20},
  {aula:'C204',mat:'MED203',grp:'009',dia:'Jueves',si:1,ei:3},
  {aula:'C204',mat:'INF113',grp:'042',dia:'Jueves',si:10,ei:14},
  {aula:'C204',mat:'INF103',grp:'019',dia:'Jueves',si:3,ei:5},
  {aula:'C204',mat:'INF406',grp:'001',dia:'Jueves',si:14,ei:16},
  {aula:'C204',mat:'INF103',grp:'062',dia:'Jueves',si:16,ei:19},
  {aula:'C204',mat:'INF353',grp:'002',dia:'Jueves',si:19,ei:20},
  {aula:'C204',mat:'INF113',grp:'015',dia:'Viernes',si:9,ei:13},
  {aula:'C204',mat:'INF103',grp:'034',dia:'Viernes',si:14,ei:17},
  {aula:'C204',mat:'MER402',grp:'003',dia:'Viernes',si:18,ei:20},
  {aula:'C204',mat:'INF408',grp:'002',dia:'Sábado',si:4,ei:8},
  {aula:'C204',mat:'INF445',grp:'003',dia:'Sábado',si:8,ei:12},
  // C205  — Lab. AutoCAD
  {aula:'C205',mat:'ICV915',grp:'003',dia:'Sábado',si:1,ei:4},
  {aula:'C205',mat:'ICV915',grp:'002',dia:'Sábado',si:4,ei:7},
  {aula:'C205',mat:'ARQ545',grp:'001',dia:'Lunes',si:9,ei:12},
  {aula:'C205',mat:'INF218',grp:'001',dia:'Lunes',si:14,ei:16},
  {aula:'C205',mat:'ARQ640',grp:'003',dia:'Lunes',si:16,ei:18},
  {aula:'C205',mat:'ARQ545',grp:'001',dia:'Martes',si:9,ei:12},
  {aula:'C205',mat:'ICV945',grp:'001',dia:'Martes',si:17,ei:20},
  {aula:'C205',mat:'ICV915',grp:'003',dia:'Miércoles',si:9,ei:12},
  {aula:'C205',mat:'ICV915',grp:'002',dia:'Miércoles',si:12,ei:15},
  {aula:'C205',mat:'ICV945',grp:'002',dia:'Miércoles',si:15,ei:17},
  {aula:'C205',mat:'ICV450',grp:'001',dia:'Miércoles',si:17,ei:20},
  {aula:'C205',mat:'ICV945',grp:'001',dia:'Jueves',si:3,ei:6},
  {aula:'C205',mat:'INF113',grp:'043',dia:'Jueves',si:14,ei:16},
  {aula:'C205',mat:'INF331',grp:'004',dia:'Jueves',si:18,ei:20},
  {aula:'C205',mat:'ICV945',grp:'002',dia:'Viernes',si:8,ei:12},
  // C206 — Lab. Informática 06
  {aula:'C206',mat:'INF113',grp:'003',dia:'Lunes',si:1,ei:5},
{aula:'C206',mat:'INF117',grp:'002',dia:'Lunes',si:5,ei:8},
{aula:'C206',mat:'INF113',grp:'053',dia:'Lunes',si:10,ei:12},
{aula:'C206',mat:'INF113',grp:'010',dia:'Lunes',si:12,ei:16},
{aula:'C206',mat:'INF165',grp:'008',dia:'Lunes',si:16,ei:18},
{aula:'C206',mat:'INF168',grp:'005',dia:'Lunes',si:18,ei:20},
{aula:'C206',mat:'INF117',grp:'002',dia:'Martes',si:2,ei:5},
{aula:'C206',mat:'INF113',grp:'051',dia:'Martes',si:8,ei:10},
{aula:'C206',mat:'INF113',grp:'053',dia:'Martes',si:10,ei:12},
{aula:'C206',mat:'INF113',grp:'020',dia:'Martes',si:12,ei:14},
{aula:'C206',mat:'INF406',grp:'004',dia:'Martes',si:14,ei:16},
{aula:'C206',mat:'INF117',grp:'010',dia:'Martes',si:16,ei:18},
{aula:'C206',mat:'MER402',grp:'001',dia:'Martes',si:18,ei:20},
{aula:'C206',mat:'INF113',grp:'045',dia:'Miércoles',si:3,ei:7},
{aula:'C206',mat:'INF113',grp:'051',dia:'Miércoles',si:8,ei:10},
{aula:'C206',mat:'INF113',grp:'008',dia:'Miércoles',si:10,ei:14},
{aula:'C206',mat:'TUR101',grp:'003',dia:'Miércoles',si:15,ei:18},
{aula:'C206',mat:'INF412',grp:'002',dia:'Miércoles',si:18,ei:20},
{aula:'C206',mat:'INF113',grp:'001',dia:'Jueves',si:1,ei:5},
{aula:'C206',mat:'INF113',grp:'002',dia:'Jueves',si:5,ei:9},
{aula:'C206',mat:'INF113',grp:'020',dia:'Jueves',si:12,ei:14},
{aula:'C206',mat:'MED203',grp:'021',dia:'Jueves',si:14,ei:17},
{aula:'C206',mat:'INF165',grp:'004',dia:'Jueves',si:16,ei:18},
{aula:'C206',mat:'INF113',grp:'018',dia:'Viernes',si:4,ei:8},
{aula:'C206',mat:'INF391',grp:'001',dia:'Viernes',si:14,ei:16},
{aula:'C206',mat:'INF113',grp:'030',dia:'Viernes',si:16,ei:20},
{aula:'C206',mat:'INF024',grp:'001',dia:'Sábado',si:1,ei:4},
{aula:'C206',mat:'INF840',grp:'002',dia:'Sábado',si:7,ei:12},
  {aula:'C206',mat:'INF168',grp:'002',dia:'Jueves',si:18,ei:20},
  // C207 — Lab. Informática 07
 {aula:'C207',mat:'INF117',grp:'005',dia:'Lunes',si:1,ei:4},
{aula:'C207',mat:'INF113',grp:'050',dia:'Lunes',si:5,ei:9},
{aula:'C207',mat:'INF113',grp:'031',dia:'Lunes',si:12,ei:14},
{aula:'C207',mat:'INF173',grp:'001',dia:'Lunes',si:14,ei:16},
{aula:'C207',mat:'INF482',grp:'002',dia:'Lunes',si:18,ei:20},
{aula:'C207',mat:'INF113',grp:'012',dia:'Martes',si:2,ei:6},
{aula:'C207',mat:'INF103',grp:'078',dia:'Martes',si:7,ei:9},
{aula:'C207',mat:'INF113',grp:'005',dia:'Martes',si:10,ei:12},
{aula:'C207',mat:'INF113',grp:'040',dia:'Martes',si:12,ei:14},
{aula:'C207',mat:'MED203',grp:'014',dia:'Martes',si:15,ei:16},
{aula:'C207',mat:'INF535',grp:'001',dia:'Martes',si:16,ei:18},
{aula:'C207',mat:'INF103',grp:'030',dia:'Miércoles',si:7,ei:9},
{aula:'C207',mat:'INF113',grp:'005',dia:'Miércoles',si:10,ei:12},
{aula:'C207',mat:'INF113',grp:'033',dia:'Miércoles',si:14,ei:16},
{aula:'C207',mat:'INF103',grp:'005',dia:'Miércoles',si:16,ei:18},
{aula:'C207',mat:'INF168',grp:'001',dia:'Miércoles',si:18,ei:20},
{aula:'C207',mat:'INF103',grp:'078',dia:'Jueves',si:7,ei:9},
{aula:'C207',mat:'INF113',grp:'039',dia:'Jueves',si:8,ei:12},
{aula:'C207',mat:'INF165',grp:'005',dia:'Jueves',si:15,ei:17},
{aula:'C207',mat:'INF168',grp:'002',dia:'Jueves',si:18,ei:20},
{aula:'C207',mat:'INF117',grp:'005',dia:'Viernes',si:1,ei:4},
{aula:'C207',mat:'INF117',grp:'001',dia:'Viernes',si:12,ei:16},
{aula:'C207',mat:'INF387',grp:'002',dia:'Viernes',si:18,ei:20},
{aula:'C207',mat:'INF113',grp:'022',dia:'Sábado',si:1,ei:5},
{aula:'C207',mat:'INF167',grp:'003',dia:'Sábado',si:5,ei:8},
{aula:'C207',mat:'INF535',grp:'001',dia:'Sábado',si:8,ei:11},
  // C208 C208 — Lab. Mecatrónica
  {aula:'C208',mat:'IEL415',grp:'001',dia:'Lunes',si:5,ei:9},
  {aula:'C208',mat:'IEL315',grp:'002',dia:'Lunes',si:14,ei:16},
  {aula:'C208',mat:'IEL955',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C208',mat:'IEL915',grp:'001',dia:'Martes',si:14,ei:16},
  {aula:'C208',mat:'IEL125',grp:'001',dia:'Miércoles',si:14,ei:16},
  {aula:'C208',mat:'IID750',grp:'001',dia:'Miércoles',si:16,ei:20},
  {aula:'C208',mat:'IEL905',grp:'001',dia:'Jueves',si:14,ei:16},
  {aula:'C208',mat:'IEL955',grp:'002',dia:'Viernes',si:14,ei:16},
  {aula:'C208',mat:'IEL955',grp:'004',dia:'Viernes',si:16,ei:20},
  {aula:'C208',mat:'IEL415',grp:'001',dia:'Sábado',si:6,ei:8},
  {aula:'C208',mat:'IEL625',grp:'002',dia:'Sábado',si:11,ei:14},
  {aula:'C208',mat:'IEL525',grp:'002',dia:'Sábado',si:8,ei:11},
  {aula:'C208',mat:'IEL415',grp:'002',dia:'Sábado',si:0,ei:2},
  // C413 — Lab. Comunicación
  {aula:'C413',mat:'IET675',grp:'001',dia:'Lunes',si:14,ei:16},
  {aula:'C413',mat:'IET415',grp:'002',dia:'Lunes',si:18,ei:20},
  {aula:'C413',mat:'IET325',grp:'002',dia:'Martes',si:16,ei:18},
  {aula:'C413',mat:'IET545',grp:'002',dia:'Miércoles',si:16,ei:18},
  {aula:'C413',mat:'IET325',grp:'001',dia:'Miércoles',si:18,ei:20},
  {aula:'C413',mat:'IET425',grp:'001',dia:'Jueves',si:16,ei:18},
  {aula:'C413',mat:'IET605',grp:'001',dia:'Jueves',si:18,ei:20},
  {aula:'C413',mat:'IET745',grp:'001',dia:'Viernes',si:18,ei:20},
  {aula:'C413',mat:'IET845',grp:'001',dia:'Sábado',si:4,ei:6},
  {aula:'C413',mat:'IEL305',grp:'004',dia:'Sábado',si:7,ei:9},
  // C414A — Lab. Electrónica
  {aula:'C414A',mat:'IET315',grp:'001',dia:'Martes',si:16,ei:18},
  {aula:'C414A',mat:'IET965',grp:'002',dia:'Miércoles',si:14,ei:16},
  {aula:'C414A',mat:'IET545',grp:'002',dia:'Miércoles',si:17,ei:19},
  {aula:'C414A',mat:'IET715',grp:'003',dia:'Jueves',si:16,ei:18},
  {aula:'C414A',mat:'IET705',grp:'001',dia:'Sábado',si:2,ei:4},
  {aula:'C414A',mat:'IET815',grp:'001',dia:'Sábado',si:4,ei:6},
  {aula:'C414A',mat:'IET415',grp:'001',dia:'Sábado',si:11,ei:13},
  // C414B — Lab. Electrónica 02
  {aula:'C414B',mat:'IET315',grp:'002',dia:'Viernes',si:15,ei:17},
  // C415
  {aula:'C415',mat:'IEL105',grp:'010',dia:'Lunes',si:14,ei:16},
  {aula:'C415',mat:'IEL205',grp:'005',dia:'Lunes',si:18,ei:20},
  {aula:'C415',mat:'IET115',grp:'001',dia:'Martes',si:16,ei:18},
  {aula:'C415',mat:'IEL205',grp:'004',dia:'Miércoles',si:12,ei:14},
  {aula:'C415',mat:'IET405',grp:'001',dia:'Miércoles',si:16,ei:18},
  {aula:'C415',mat:'IEL115',grp:'001',dia:'Miércoles',si:14,ei:16},
  {aula:'C415',mat:'IEL205',grp:'004',dia:'Miércoles',si:14,ei:16},
  {aula:'C415',mat:'IEL105',grp:'009',dia:'Jueves',si:18,ei:20},
  {aula:'C415',mat:'IEL105',grp:'001',dia:'Viernes',si:14,ei:16},
  {aula:'C415',mat:'IEL105',grp:'002',dia:'Viernes',si:16,ei:18},
  {aula:'C415',mat:'IEL105',grp:'003',dia:'Viernes',si:18,ei:20},
  {aula:'C415',mat:'IEL115',grp:'003',dia:'Sábado',si:10,ei:12},
  {aula:'C415',mat:'IEL305',grp:'001',dia:'Miércoles',si:18,ei:20},
  {aula:'C415',mat:'IEL105',grp:'004',dia:'Jueves',si:14,ei:16},
];
const classes=raw.map(c=>{
  const durMin=(c.ei-c.si)*45;
  const inicio=SLOTS[c.si].l;
  const fin=SLOTS[c.ei]?SLOTS[c.ei].l:SLOT_END_LBL;
  const inicioM=SLOTS[c.si].m;
  const finM=SLOTS[c.ei]?SLOTS[c.ei].m:SLOT_END_M;
  return{...c,durMin,inicio,fin,inicioM,finM};
});

// ── Skip waiting on demand from app ──
self.addEventListener('message', e=>{
  if(!e.data) return;
  // Actualizar SW
  if(e.data.type==='SKIP_WAITING'){
    self.skipWaiting();
    return;
  }
  // Sincronizar config de alertas
  if(e.data.type==='UPDATE_CONFIG'){
    // config stored for future background checks
    return;
  }
  // ── Notificación local enviada desde la app (celular desbloqueado en background) ──
  if(e.data.type==='SHOW_NOTIFICATION'){
    self.registration.showNotification(e.data.title||'UTESA Labs', {
      body:    e.data.body||'',
      icon:    '/horarios-laboratorios-utesa/icon-192.png',
      badge:   '/horarios-laboratorios-utesa/icon-192.png',
      tag:     e.data.tag||'utesa-local',
      vibrate: [100,50,100,50,300,100,300],
      requireInteraction: true,
      data:    { url: 'https://francisdominguez.github.io/horarios-laboratorios-utesa/' }
    });
    // Solo guardar manuales, no las de clase
    return;
  }
});

// ── Recibir push del servidor (GitHub Actions) ──
self.addEventListener('push', e=>{
  if(!e.data) return;
  let data;
  try { data = e.data.json(); } catch(err) { return; }
  e.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title||'UTESA Labs', {
        body:    data.body||'',
        icon:    data.icon||'/horarios-laboratorios-utesa/icon-192.png',
        badge:   data.badge||'/horarios-laboratorios-utesa/icon-192.png',
        tag:     data.tag||'utesa-push',
        vibrate: data.vibrate||[200,100,200],
        data:    { url: data.url||'/horarios-laboratorios-utesa/' }
      }),
      if(data.tag && data.tag.startsWith('manual')) saveNotifHistory({ title: data.title, body: data.body, ts: Date.now(), tag: data.tag })
    ])
  );
});

// ── Al tocar la notificación abre la app ──
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
      if(list.length>0)return list[0].focus();
      return clients.openWindow('/horarios-laboratorios-utesa/');
    })
  );
});

// ── Activación ──
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>{
      self.clients.claim();
      // Notify all clients that new version is active
      self.clients.matchAll({type:'window'}).then(cls=>{
        cls.forEach(c=>c.postMessage({type:'RELOAD'}));
      });
      // background check handled by GitHub Actions push
    })
  );
});

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS))
  );

});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request))
  );
});

// ── Historial de notificaciones (localStorage vía clients) ───────────────────
function saveNotifHistory(notif){
  // Enviar a todos los clientes abiertos para que lo guarden en localStorage
  self.clients.matchAll({type:'window'}).then(cls=>{
    cls.forEach(c=>c.postMessage({ type:'SAVE_NOTIF_HISTORY', notif }));
  });
}

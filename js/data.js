/*
 * Datos ilustrativos del prototipo.
 * Ninguna cifra, nombre de proveedor ni de empleado proviene de la operación real del negocio.
 * Las fechas se calculan contra el día de hoy para que el tablero siempre se vea vigente.
 */
(function () {
  const hoy = new Date();

  function dia(n, h, m) {
    const d = new Date(hoy);
    d.setDate(d.getDate() - n);
    d.setHours(h || 8, m || 0, 0, 0);
    return d;
  }

  const usuarios = {
    mario: { nombre: 'Mario', perfil: 'Dueño' },
    ana: { nombre: 'Ana R.', perfil: 'Control interno' },
    luis: { nombre: 'Luis M.', perfil: 'Área de proceso' },
    jorge: { nombre: 'Jorge P.', perfil: 'Área de proceso' },
    oficina: { nombre: 'Rosa T.', perfil: 'Oficina' },
    pedro: { nombre: 'Pedro G.', perfil: 'Mostrador' }
  };

  const proveedores = {
    dcn: 'Distribuidora Cárnica Norte',
    pda: 'Porcinos del Altiplano',
    all: 'Avícola Las Lomas',
    esr: 'Embutidos San Rafael'
  };

  // unidad = unidad de inventario; la unidad de venta siempre es el kilo.
  const productos = [
    { clave: 'R-001', nombre: 'Pulpa blanca de res', categoria: 'Res', unidad: 'caja', piezas: 7, kg: 166.5, min: 4, max: 12, costo: 142, sat: '50112000', ubicacion: 'Cámara 1' },
    { clave: 'R-002', nombre: 'Bistec de res', categoria: 'Res', unidad: 'kg', piezas: null, kg: 38.2, min: 25, max: 80, costo: 171, sat: '50112000', ubicacion: 'Vitrina', derivado: 'D-0318' },
    { clave: 'R-003', nombre: 'Milanesa de res', categoria: 'Res', unidad: 'kg', piezas: null, kg: 14.5, min: 15, max: 45, costo: 171, sat: '50112000', ubicacion: 'Vitrina', derivado: 'D-0318' },
    { clave: 'R-004', nombre: 'Molida de res', categoria: 'Res', unidad: 'kg', piezas: null, kg: 22.8, min: 10, max: 35, costo: 118, sat: '50112000', ubicacion: 'Vitrina', derivado: 'D-0318' },
    { clave: 'R-005', nombre: 'Costilla de res', categoria: 'Res', unidad: 'caja', piezas: 5, kg: 101.3, min: 3, max: 10, costo: 118, sat: '50112000', ubicacion: 'Cámara 1' },
    { clave: 'R-006', nombre: 'Arrachera marinada', categoria: 'Res', unidad: 'caja', piezas: 3, kg: 29.7, min: 2, max: 8, costo: 215, sat: '50112000', ubicacion: 'Congelador 2' },
    { clave: 'C-001', nombre: 'Pierna de cerdo', categoria: 'Cerdo', unidad: 'pieza', piezas: 24, kg: 192.5, min: 10, max: 40, costo: 78, sat: '50112000', ubicacion: 'Cámara 2' },
    { clave: 'C-002', nombre: 'Bistec de cerdo', categoria: 'Cerdo', unidad: 'kg', piezas: null, kg: 41.0, min: 20, max: 60, costo: 104, sat: '50112000', ubicacion: 'Vitrina', derivado: 'D-0316' },
    { clave: 'C-003', nombre: 'Chuleta de cerdo', categoria: 'Cerdo', unidad: 'caja', piezas: 1, kg: 14.2, min: 3, max: 8, costo: 96, sat: '50112000', ubicacion: 'Cámara 2' },
    { clave: 'C-004', nombre: 'Costilla de cerdo', categoria: 'Cerdo', unidad: 'caja', piezas: 4, kg: 70.9, min: 2, max: 6, costo: 92, sat: '50112000', ubicacion: 'Cámara 2' },
    { clave: 'C-005', nombre: 'Lomo de cerdo', categoria: 'Cerdo', unidad: 'pieza', piezas: 5, kg: 19.8, min: 6, max: 14, costo: 112, sat: '50112000', ubicacion: 'Cámara 2' },
    { clave: 'C-006', nombre: 'Trozo de cerdo', categoria: 'Cerdo', unidad: 'kg', piezas: null, kg: 26.4, min: 10, max: 40, costo: 88, sat: '50112000', ubicacion: 'Vitrina', derivado: 'D-0316' },
    { clave: 'A-001', nombre: 'Pollo entero', categoria: 'Aves', unidad: 'pieza', piezas: 46, kg: 101.2, min: 30, max: 80, costo: 52, sat: '50112000', ubicacion: 'Cámara 3' },
    { clave: 'A-002', nombre: 'Pechuga de pollo', categoria: 'Aves', unidad: 'caja', piezas: 13, kg: 262.0, min: 4, max: 10, costo: 89, sat: '50112000', ubicacion: 'Cámara 3' },
    { clave: 'M-001', nombre: 'Chorizo de la casa', categoria: 'Misceláneos', unidad: 'paquete', piezas: 18, kg: 18.0, min: 10, max: 30, costo: 95, sat: '50112000', ubicacion: 'Refrigerador 1' }
  ];

  // Las cantidades son kilos. "cant" es la cuenta en unidad de inventario.
  const notas = [
    {
      folio: '4471', proveedor: 'dcn', fecha: dia(1, 7, 45), estado: 'Confirmada', recibio: 'ana', pago: 'Crédito a 7 días',
      renglones: [
        { clave: 'R-001', cant: 12, fact: 286.4, rec: 284.1, lote: 'L-4471-A', cad: 9 },
        { clave: 'R-005', cant: 10, fact: 201.0, rec: 199.8, lote: 'L-4471-B', cad: 9 },
        { clave: 'R-006', cant: 8, fact: 80.6, rec: 80.6, lote: 'L-4471-C', cad: 20 },
        { clave: 'C-001', cant: 34, fact: 274.0, rec: 272.5, lote: 'L-4471-D', cad: 8 }
      ]
    },
    {
      folio: '0941', proveedor: 'pda', fecha: dia(0, 7, 5), estado: 'Por pesar', recibio: 'ana', pago: 'Pendiente',
      renglones: [
        { clave: 'C-001', cant: 20, fact: 160.0, rec: null, lote: '', cad: null },
        { clave: 'C-004', cant: 5, fact: 94.0, rec: null, lote: '', cad: null }
      ]
    },
    {
      folio: 'A-2291', proveedor: 'all', fecha: dia(2, 7, 30), estado: 'Confirmada', recibio: 'ana', pago: 'Contado',
      renglones: [
        { clave: 'A-001', cant: 100, fact: 220.0, rec: 220.0, lote: 'A-2291', cad: 5 },
        { clave: 'A-002', cant: 10, fact: 200.0, rec: 200.0, lote: 'A-2291', cad: 6 }
      ]
    },
    {
      folio: '4468', proveedor: 'dcn', fecha: dia(3, 7, 55), estado: 'Confirmada', recibio: 'ana', pago: 'Pagada',
      renglones: [
        { clave: 'R-001', cant: 12, fact: 287.2, rec: 286.0, lote: 'L-4468-A', cad: 7 },
        { clave: 'R-005', cant: 8, fact: 163.4, rec: 162.0, lote: 'L-4468-B', cad: 7 },
        { clave: 'R-006', cant: 6, fact: 60.4, rec: 60.4, lote: 'L-4468-C', cad: 18 },
        { clave: 'C-001', cant: 13, fact: 104.0, rec: 104.0, lote: 'L-4468-D', cad: 6 }
      ]
    },
    {
      folio: '0937', proveedor: 'pda', fecha: dia(4, 8, 10), estado: 'Confirmada', recibio: 'ana', pago: 'Pagada ayer',
      renglones: [
        { clave: 'C-003', cant: 10, fact: 150.5, rec: 149.0, lote: 'P-0937-A', cad: 5 },
        { clave: 'C-004', cant: 6, fact: 108.0, rec: 107.2, lote: 'P-0937-B', cad: 3 },
        { clave: 'C-005', cant: 30, fact: 130.0, rec: 129.8, lote: 'P-0937-C', cad: 6 }
      ]
    },
    {
      folio: '4463', proveedor: 'dcn', fecha: dia(6, 7, 40), estado: 'Confirmada', recibio: 'ana', pago: 'Pagada',
      renglones: [
        { clave: 'R-001', cant: 13, fact: 309.6, rec: 307.0, lote: 'L-4463-A', cad: 4 },
        { clave: 'R-005', cant: 9, fact: 181.2, rec: 180.5, lote: 'L-4463-B', cad: 4 },
        { clave: 'C-001', cant: 26, fact: 210.4, rec: 210.4, lote: 'L-4463-C', cad: 3 }
      ]
    },
    {
      folio: 'A-2280', proveedor: 'all', fecha: dia(7, 7, 25), estado: 'Confirmada', recibio: 'ana', pago: 'Pagada',
      renglones: [
        { clave: 'A-001', cant: 90, fact: 198.0, rec: 197.6, lote: 'A-2280', cad: 2 },
        { clave: 'A-002', cant: 10, fact: 202.0, rec: 202.0, lote: 'A-2280', cad: 2 }
      ]
    }
  ];

  const recetas = [
    {
      id: 'RC-01', origen: 'R-001', version: 2,
      derivados: [
        { clave: 'R-002', pct: 58 },
        { clave: 'R-003', pct: 22 },
        { clave: 'R-004', pct: 12 }
      ],
      merma: 8
    },
    {
      id: 'RC-02', origen: 'C-001', version: 1,
      derivados: [
        { clave: 'C-002', pct: 60 },
        { clave: 'C-006', pct: 25 }
      ],
      merma: 15
    }
  ];

  // Kilos obtenidos por derivado, en el mismo orden que la receta.
  const despieces = [
    { folio: 'D-0318', receta: 'RC-01', fecha: dia(0, 6, 40), turno: 'Matutino', resp: 'luis', entrada: 120.0, obtenido: [66.1, 25.9, 14.2] },
    { folio: 'D-0317', receta: 'RC-01', fecha: dia(1, 15, 30), turno: 'Vespertino', resp: 'jorge', entrada: 96.0, obtenido: [56.0, 21.0, 11.4] },
    { folio: 'D-0316', receta: 'RC-02', fecha: dia(1, 7, 20), turno: 'Matutino', resp: 'luis', entrada: 80.0, obtenido: [47.1, 19.6] },
    { folio: 'D-0315', receta: 'RC-01', fecha: dia(2, 7, 20), turno: 'Matutino', resp: 'luis', entrada: 110.0, obtenido: [61.0, 23.5, 13.0] },
    { folio: 'D-0314', receta: 'RC-02', fecha: dia(2, 15, 10), turno: 'Vespertino', resp: 'jorge', entrada: 72.0, obtenido: [43.6, 18.1] },
    { folio: 'D-0313', receta: 'RC-01', fecha: dia(3, 9, 0), turno: 'Matutino', resp: 'luis', entrada: 100.0, obtenido: [55.4, 21.6, 11.9] }
  ];

  // Puntos de desviación de merma a partir de los cuales se señala la operación.
  const umbralDesviacion = 2;

  const kardexPulpa = [
    { fecha: dia(4, 21, 0), tipo: 'Saldo', doc: 'Saldo anterior', cant: 22.4, usuario: 'Sistema' },
    { fecha: dia(3, 7, 55), tipo: 'Entrada', doc: 'Nota 4468', cant: 286.0, usuario: 'ana' },
    { fecha: dia(3, 9, 0), tipo: 'Despiece', doc: 'D-0313', cant: -100.0, usuario: 'luis' },
    { fecha: dia(2, 7, 20), tipo: 'Despiece', doc: 'D-0315', cant: -110.0, usuario: 'luis' },
    { fecha: dia(1, 7, 45), tipo: 'Entrada', doc: 'Nota 4471 (ampara 286.4 kg)', cant: 284.1, usuario: 'ana' },
    { fecha: dia(1, 15, 30), tipo: 'Despiece', doc: 'D-0317', cant: -96.0, usuario: 'jorge' },
    { fecha: dia(0, 6, 40), tipo: 'Despiece', doc: 'D-0318', cant: -120.0, usuario: 'luis' }
  ];

  const caducidades = [
    { clave: 'A-002', lote: 'A-2280', kg: 62.0, dias: 2 },
    { clave: 'C-004', lote: 'P-0937-B', kg: 18.4, dias: 3 },
    { clave: 'M-001', lote: 'CH-114', kg: 6.0, dias: 5 },
    { clave: 'R-006', lote: 'L-4468-C', kg: 9.8, dias: 6 }
  ];

  const cierre = {
    fecha: dia(1, 21, 5),
    capturo: 'oficina',
    fondo: 3000,
    ventas: [
      { forma: 'Efectivo', importe: 71420 },
      { forma: 'Tarjeta', importe: 9860 },
      { forma: 'Transferencia · Cuenta 1', importe: 6300 },
      { forma: 'Transferencia · Cuenta 2', importe: 2150 },
      { forma: 'Transferencia · Cuenta 3', importe: 1980 }
    ],
    gastos: [
      { concepto: 'Gas de la cámara', importe: 850 },
      { concepto: 'Bolsas y charolas', importe: 400 }
    ],
    pagosProveedor: [
      { proveedor: 'pda', importe: 26120, nota: '0937' },
      { proveedor: 'esr', importe: 12480, nota: null }
    ],
    retiros: [
      { concepto: 'Depósito a banco', importe: 20000 }
    ],
    contado: 14230
  };

  const concentrado = [
    { n: 1, venta: 91710, dif: -340 },
    { n: 2, venta: 88240, dif: 0 },
    { n: 3, venta: 95130, dif: 20 },
    { n: 4, venta: 86905, dif: -150 },
    { n: 5, venta: 102480, dif: 0 },
    { n: 6, venta: 118300, dif: -520 },
    { n: 7, venta: 84770, dif: 0 },
    { n: 8, venta: 90115, dif: -60 },
    { n: 9, venta: 87560, dif: 0 },
    { n: 10, venta: 93890, dif: -210 }
  ].map(function (r) { return Object.assign({ fecha: dia(r.n, 21, 0) }, r); });

  const ajustes = [
    { folio: 'AJ-0042', clave: 'C-004', kg: -3.2, motivo: 'Producto en mal estado', comentario: 'Costilla con mal olor al abrir la caja, lote P-0937-B.', solicito: 'ana', fecha: dia(1, 12, 40) },
    { folio: 'AJ-0043', clave: 'R-005', kg: -2.6, motivo: 'Diferencia en conteo cíclico', comentario: 'Conteo del grupo B de ayer, cerrado con faltante.', solicito: 'ana', fecha: dia(0, 7, 20) }
  ];
  const umbralAutorizacion = 250;

  const bitacora = [
    { fecha: dia(0, 7, 20), usuario: 'ana', tipo: 'Ajuste', evento: 'Solicitó el ajuste AJ-0043 de Costilla de res por −2.6 kg', antes: '', despues: 'Pendiente de autorizar' },
    { fecha: dia(0, 7, 5), usuario: 'ana', tipo: 'Entrada', evento: 'Registró la nota 0941 de Porcinos del Altiplano, por pesar', antes: '', despues: '254.0 kg facturados' },
    { fecha: dia(0, 6, 40), usuario: 'luis', tipo: 'Despiece', evento: 'Registró el despiece D-0318 de Pulpa blanca de res', antes: '', despues: '120.0 kg → 106.2 kg' },
    { fecha: dia(1, 21, 5), usuario: 'oficina', tipo: 'Cierre', evento: 'Confirmó el cierre del día', antes: '', despues: 'Diferencia de efectivo −$340' },
    { fecha: dia(1, 18, 30), usuario: 'oficina', tipo: 'Precio', evento: 'Cambió el precio de menudeo de Bistec de res', antes: '$189.00 / kg', despues: '$195.00 / kg' },
    { fecha: dia(1, 16, 12), usuario: 'pedro', tipo: 'Acceso', evento: 'Intentó cambiar el precio de Chuleta de cerdo. Rechazado: su perfil no tiene permiso', antes: '$128.00 / kg', despues: 'Sin cambio', rechazado: true },
    { fecha: dia(1, 15, 30), usuario: 'jorge', tipo: 'Despiece', evento: 'Registró el despiece D-0317 de Pulpa blanca de res', antes: '', despues: '96.0 kg → 88.4 kg' },
    { fecha: dia(1, 12, 40), usuario: 'ana', tipo: 'Ajuste', evento: 'Solicitó el ajuste AJ-0042 de Costilla de cerdo por −3.2 kg', antes: '', despues: 'Pendiente de autorizar' },
    { fecha: dia(1, 7, 45), usuario: 'ana', tipo: 'Entrada', evento: 'Confirmó la nota 4471 de Distribuidora Cárnica Norte', antes: '842.0 kg facturados', despues: '837.0 kg recibidos' },
    { fecha: dia(2, 10, 5), usuario: 'oficina', tipo: 'Catálogo', evento: 'Dio de alta el producto Trozo de cerdo (C-006)', antes: '', despues: 'Unidad: kg · Clave SAT 50112000' },
    { fecha: dia(2, 9, 40), usuario: 'oficina', tipo: 'Catálogo', evento: 'Cambió el mínimo de Lomo de cerdo', antes: '4 piezas', despues: '6 piezas' }
  ];

  // Hoja de conteo cíclico del día: grupo A. "contado" es lo que se usa si no se captura nada.
  const conteo = {
    grupo: 'A',
    claves: [
      { clave: 'R-001', contado: 166.5 },
      { clave: 'R-006', contado: 29.7 },
      { clave: 'R-002', contado: 37.4 },
      { clave: 'A-002', contado: 257.5 },
      { clave: 'C-001', contado: 192.5 }
    ]
  };

  window.DS = {
    hoy: hoy,
    dia: dia,
    usuarios: usuarios,
    proveedores: proveedores,
    productos: productos,
    notas: notas,
    recetas: recetas,
    despieces: despieces,
    umbralDesviacion: umbralDesviacion,
    kardexPulpa: kardexPulpa,
    caducidades: caducidades,
    cierre: cierre,
    concentrado: concentrado,
    ajustes: ajustes,
    umbralAutorizacion: umbralAutorizacion,
    bitacora: bitacora,
    conteo: conteo
  };
})();

/*
 * Don Salvador — prototipo visual de la Fase 1.
 * Nada se guarda: cada acción muestra cómo se vería. Las rutas viven en el hash (#/tablero, #/entradas/4471…).
 */
(function () {
  'use strict';

  var DS = window.DS;
  var root = document.getElementById('root');
  var toastEl = document.getElementById('toast');

  /* ───────────── Formatos ───────────── */

  var fMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  var fMoneda2 = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var fUno = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var fEntero = new Intl.NumberFormat('es-MX');
  var fFechaLarga = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  var fFechaCorta = new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  var fHora = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });

  var MENOS = '−';

  function dinero(n) { return (n < 0 ? MENOS : '') + fMoneda.format(Math.abs(n)); }
  function dinero2(n) { return (n < 0 ? MENOS : '') + fMoneda2.format(Math.abs(n)); }
  function dineroSigno(n) { return (n > 0 ? '+' : '') + dinero(n); }
  function kg(n) { return fUno.format(n) + ' kg'; }
  function kgSigno(n) { return (n > 0 ? '+' : n < 0 ? MENOS : '') + fUno.format(Math.abs(n)) + ' kg'; }
  function pct(n) { return fUno.format(n) + ' %'; }
  function pts(n) { return (n > 0 ? '+' : n < 0 ? MENOS : '') + fUno.format(Math.abs(n)) + ' pts'; }
  function r1(n) { return Math.round(n * 10) / 10; }

  var PLURAL = { caja: 'cajas', pieza: 'piezas', paquete: 'paquetes' };
  function unidades(n, u) {
    if (u === 'kg') return kg(n);
    return fEntero.format(n) + ' ' + (n === 1 ? u : PLURAL[u]);
  }

  function capital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function mismoDia(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  function cuando(d) {
    var ayer = DS.dia(1);
    if (mismoDia(d, DS.hoy)) return 'Hoy ' + fHora.format(d);
    if (mismoDia(d, ayer)) return 'Ayer ' + fHora.format(d);
    return capital(fFechaCorta.format(d)).replace(/\./g, '') + ' · ' + fHora.format(d);
  }

  function fechaCorta(d) { return capital(fFechaCorta.format(d)).replace(/\./g, ''); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ───────────── Íconos ───────────── */

  var ICONOS = {
    tablero: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    camion: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    caja: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
    tijeras: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    lista: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    billete: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    campana: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    buscar: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    alerta: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    derecha: '<path d="m9 18 6-6-6-6"/>',
    izquierda: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    cerrar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    descargar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    imprimir: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
    candado: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    bascula: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    calendario: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    ojo: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>'
  };

  function ic(nombre, clase) {
    return '<svg class="icon ' + (clase || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[nombre] || '') + '</svg>';
  }

  /* ───────────── Cálculos sobre los datos ───────────── */

  function prod(clave) {
    for (var i = 0; i < DS.productos.length; i++) if (DS.productos[i].clave === clave) return DS.productos[i];
    return null;
  }

  function existenciaInv(p) { return p.unidad === 'kg' ? p.kg : p.piezas; }

  function estadoStock(p) {
    var e = existenciaInv(p);
    if (e < p.min) return 'bajo';
    if (e > p.max) return 'sobre';
    return 'ok';
  }

  function badgeStock(p) {
    var e = estadoStock(p);
    if (e === 'bajo') return '<span class="badge bad">Bajo su mínimo</span>';
    if (e === 'sobre') return '<span class="badge warn">Sobre su máximo</span>';
    return '<span class="badge ok">En rango</span>';
  }

  function valorInventario() {
    return DS.productos.reduce(function (s, p) { return s + p.kg * p.costo; }, 0);
  }

  function kgInventario() {
    return DS.productos.reduce(function (s, p) { return s + p.kg; }, 0);
  }

  function totalesNota(n) {
    var t = { fact: 0, rec: 0, dif: 0, importe: 0, pesada: true };
    n.renglones.forEach(function (r) {
      t.fact += r.fact;
      if (r.rec === null) { t.pesada = false; return; }
      t.rec += r.rec;
      t.dif += r.rec - r.fact;
      t.importe += (r.rec - r.fact) * prod(r.clave).costo;
    });
    t.fact = r1(t.fact); t.rec = r1(t.rec); t.dif = r1(t.dif);
    return t;
  }

  function nota(folio) {
    for (var i = 0; i < DS.notas.length; i++) if (DS.notas[i].folio === folio) return DS.notas[i];
    return null;
  }

  function recepcionPorProveedor() {
    var mapa = {};
    DS.notas.forEach(function (n) {
      var t = totalesNota(n);
      if (!t.pesada) return;
      var m = mapa[n.proveedor] || (mapa[n.proveedor] = { prov: n.proveedor, notas: 0, fact: 0, rec: 0, dif: 0, importe: 0 });
      m.notas += 1; m.fact += t.fact; m.rec += t.rec; m.dif += t.dif; m.importe += t.importe;
    });
    return Object.keys(mapa).map(function (k) {
      var m = mapa[k];
      m.fact = r1(m.fact); m.rec = r1(m.rec); m.dif = r1(m.dif);
      m.pct = m.fact ? (m.dif / m.fact) * 100 : 0;
      return m;
    }).sort(function (a, b) { return a.dif - b.dif; });
  }

  function receta(id) {
    for (var i = 0; i < DS.recetas.length; i++) if (DS.recetas[i].id === id) return DS.recetas[i];
    return null;
  }

  function calcDespiece(d) {
    var rc = receta(d.receta);
    var obtenido = r1(d.obtenido.reduce(function (s, x) { return s + x; }, 0));
    var merma = r1(d.entrada - obtenido);
    var mermaPct = (merma / d.entrada) * 100;
    var esperadoTotal = d.entrada * (1 - rc.merma / 100);
    var importe = 0;
    var derivados = rc.derivados.map(function (dv, i) {
      var esperado = d.entrada * dv.pct / 100;
      var real = d.obtenido[i];
      importe += (esperado - real) * prod(dv.clave).costo;
      return { clave: dv.clave, pct: dv.pct, esperado: esperado, real: real, pctReal: (real / d.entrada) * 100 };
    });
    var desviacion = mermaPct - rc.merma;
    return {
      receta: rc, origen: prod(rc.origen), obtenido: obtenido, merma: merma, mermaPct: mermaPct,
      desviacion: desviacion, faltante: r1(esperadoTotal - obtenido), importe: importe,
      derivados: derivados, fuera: desviacion > DS.umbralDesviacion
    };
  }

  function despiece(folio) {
    for (var i = 0; i < DS.despieces.length; i++) if (DS.despieces[i].folio === folio) return DS.despieces[i];
    return null;
  }

  function mermaPorGrupo(filtroReceta) {
    var grupos = {};
    DS.despieces.forEach(function (d) {
      if (filtroReceta && d.receta !== filtroReceta) return;
      var c = calcDespiece(d);
      var k = d.receta + '|' + d.turno + '|' + d.resp;
      var g = grupos[k] || (grupos[k] = { receta: c.receta, turno: d.turno, resp: d.resp, ops: 0, fuera: 0, entrada: 0, obtenido: 0 });
      g.ops += 1; g.entrada += d.entrada; g.obtenido += c.obtenido; if (c.fuera) g.fuera += 1;
    });
    return Object.keys(grupos).map(function (k) {
      var g = grupos[k];
      g.mermaPct = ((g.entrada - g.obtenido) / g.entrada) * 100;
      g.desviacion = g.mermaPct - g.receta.merma;
      return g;
    }).sort(function (a, b) { return b.desviacion - a.desviacion; });
  }

  function mermaReceta(id) {
    var e = 0, o = 0;
    DS.despieces.forEach(function (d) {
      if (d.receta !== id) return;
      e += d.entrada; o += calcDespiece(d).obtenido;
    });
    return { entrada: e, obtenido: o, mermaPct: e ? ((e - o) / e) * 100 : 0, esperada: receta(id).merma };
  }

  function calcCierre() {
    var c = DS.cierre;
    function suma(lista) { return lista.reduce(function (s, x) { return s + x.importe; }, 0); }
    var venta = suma(c.ventas);
    var efectivo = c.ventas[0].importe;
    var gastos = suma(c.gastos);
    var pagos = suma(c.pagosProveedor);
    var retiros = suma(c.retiros);
    var esperado = c.fondo + efectivo - gastos - pagos - retiros;
    return { venta: venta, efectivo: efectivo, gastos: gastos, pagos: pagos, retiros: retiros, esperado: esperado, contado: c.contado, dif: c.contado - esperado };
  }

  // Kardex: el de la pulpa está escrito a mano; el resto se arma con las notas, los despieces
  // y salidas por venta calculadas para que el saldo final coincida con la existencia.
  function kardexDe(p) {
    var movs;
    if (p.clave === 'R-001') {
      movs = DS.kardexPulpa.map(function (m) { return Object.assign({}, m); });
    } else {
      movs = [];
      DS.notas.forEach(function (n) {
        n.renglones.forEach(function (r) {
          if (r.clave === p.clave && r.rec !== null) {
            movs.push({ fecha: n.fecha, tipo: 'Entrada', doc: 'Nota ' + n.folio + (r.rec !== r.fact ? ' (ampara ' + fUno.format(r.fact) + ' kg)' : ''), cant: r.rec, usuario: n.recibio });
          }
        });
      });
      DS.despieces.forEach(function (d) {
        var rc = receta(d.receta);
        if (rc.origen === p.clave) movs.push({ fecha: d.fecha, tipo: 'Despiece', doc: d.folio, cant: -d.entrada, usuario: d.resp });
        rc.derivados.forEach(function (dv, i) {
          if (dv.clave === p.clave) movs.push({ fecha: d.fecha, tipo: 'Despiece', doc: d.folio + ' (sale de ' + prod(rc.origen).nombre + ')', cant: d.obtenido[i], usuario: d.resp });
        });
      });
      // Ventas al cierre de cada día y una de hoy, posterior al último movimiento del día.
      var ultimoHoy = movs.filter(function (m) { return mismoDia(m.fecha, DS.hoy); })
        .reduce(function (t, m) { return Math.max(t, m.fecha.getTime()); }, 0);
      var horaHoy = Math.min(Date.now() - 5 * 60000, DS.dia(0, 14, 0).getTime());
      if (ultimoHoy && horaHoy < ultimoHoy + 15 * 60000) horaHoy = ultimoHoy + 15 * 60000;
      var espacios = [6, 5, 4, 3, 2, 1].map(function (n) { return { fecha: DS.dia(n, 20, 0), doc: 'Salida por venta del día' }; })
        .concat([{ fecha: new Date(horaHoy), doc: 'Salida por venta de hoy, hasta ahora' }]);
      var suma = movs.reduce(function (s, m) { return s + m.cant; }, 0);
      var saldo = Math.max(p.kg * 0.5, p.kg - suma + p.kg * 0.3);

      var armar = function () {
        var lista = movs.concat(espacios.map(function (e) { return { fecha: e.fecha, tipo: 'Venta', doc: e.doc, cant: 0, usuario: 'Sistema', espacio: true }; }));
        lista.push({ fecha: DS.dia(8, 21, 0), tipo: 'Saldo', doc: 'Saldo anterior', cant: saldo, usuario: 'Sistema' });
        lista.sort(function (a, b) { return a.fecha - b.fecha; });
        var porVender = saldo + suma - p.kg;
        var restantes = espacios.length;
        var bal = 0, minimo = 0;
        lista.forEach(function (m) {
          if (m.espacio) {
            var monto = restantes === 1 ? porVender : Math.min(porVender / restantes, Math.max(0, bal * 0.8));
            if (restantes > 1 && monto < 1) monto = 0;
            m.cant = -monto;
            porVender -= monto;
            restantes -= 1;
          }
          bal += m.cant;
          if (bal < minimo) minimo = bal;
        });
        return { lista: lista.filter(function (m) { return !m.espacio || m.cant !== 0; }), minimo: minimo };
      };

      var intento = armar();
      for (var i = 0; i < 12 && intento.minimo < -0.001; i++) {
        saldo += -intento.minimo + 1;
        intento = armar();
      }
      movs = intento.lista;
    }
    movs.sort(function (a, b) { return a.fecha - b.fecha; });
    var acumulado = 0;
    movs.forEach(function (m) { m.cant = r1(m.cant); acumulado = r1(acumulado + m.cant); m.saldo = acumulado; });
    // Ajuste fino de redondeo contra la existencia publicada.
    var ultimo = movs[movs.length - 1];
    if (Math.abs(ultimo.saldo - p.kg) > 0.001) {
      var dif = r1(p.kg - ultimo.saldo);
      for (var j = movs.length - 1; j >= 0; j--) {
        if (movs[j].tipo === 'Venta') { movs[j].cant = r1(movs[j].cant + dif); break; }
      }
      acumulado = 0;
      movs.forEach(function (m) { acumulado = r1(acumulado + m.cant); m.saldo = acumulado; });
    }
    return movs;
  }

  function nombreUsuario(id) {
    var u = DS.usuarios[id];
    return u ? u.nombre : id;
  }

  function perfilUsuario(id) {
    var u = DS.usuarios[id];
    return u ? u.perfil : '';
  }

  /* ───────────── Estado del prototipo ───────────── */

  var CLAVE_SESION = 'ds-prototipo-sesion';
  var sesionMemoria = false;
  var estado = {
    ajustes: {},
    filtroEx: { cat: 'Todos', bajo: false, q: '' },
    filtroBit: 'Todos',
    conteoCerrado: false,
    conteoValores: {},
    conteoAjuste: false
  };

  function sesionActiva() {
    try { if (sessionStorage.getItem(CLAVE_SESION) === '1') return true; } catch (e) { /* sin almacenamiento */ }
    return sesionMemoria;
  }

  function iniciarSesion() {
    sesionMemoria = true;
    try { sessionStorage.setItem(CLAVE_SESION, '1'); } catch (e) { /* sin almacenamiento */ }
  }

  function cerrarSesion() {
    sesionMemoria = false;
    try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) { /* sin almacenamiento */ }
  }

  // Diferencias del conteo de hoy. Si un renglón se dejó vacío, se usa el valor de ejemplo.
  function lineasConteo() {
    return DS.conteo.claves.map(function (x) {
      var p = prod(x.clave);
      var cap = parseFloat(String(estado.conteoValores[p.clave] || '').replace(',', '.'));
      var contado = isNaN(cap) ? x.contado : cap;
      return { p: p, contado: contado, dif: r1(contado - p.kg) };
    });
  }

  // Ajustes de los datos más el que se genera al cerrar el conteo de hoy.
  function listaAjustes() {
    var lista = DS.ajustes.map(function (a) {
      var p = prod(a.clave);
      return Object.assign({ titulo: p.nombre + ' · ' + kgSigno(a.kg), monto: a.kg * p.costo }, a);
    });
    if (estado.conteoAjuste) {
      var difs = lineasConteo().filter(function (l) { return l.dif !== 0; });
      lista.push({
        folio: 'AJ-0044',
        titulo: 'Conteo del grupo A · ' + difs.map(function (l) { return l.p.nombre + ' ' + kgSigno(l.dif); }).join(', '),
        monto: difs.reduce(function (s, l) { return s + l.dif * l.p.costo; }, 0),
        motivo: 'Diferencia en conteo cíclico',
        comentario: 'Generado al cerrar el conteo de hoy.',
        solicito: 'ana',
        fecha: new Date()
      });
    }
    return lista;
  }

  function ajustesPendientes() {
    return listaAjustes().filter(function (a) { return !estado.ajustes[a.folio]; }).length;
  }

  /* ───────────── Aviso flotante ───────────── */

  var toastTimer = null;
  function toast(msg) {
    toastEl.innerHTML = ic('info') + '<span>' + msg + '</span>';
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('visible'); }, 3200);
  }

  var AVISO_PROTOTIPO = 'Prototipo visual: esta acción todavía no guarda nada.';

  /* ───────────── Inicio de sesión ───────────── */

  function renderLogin() {
    document.title = 'Iniciar sesión · Don Salvador';
    root.innerHTML =
      '<main class="login">' +
        '<section class="login-brand">' +
          '<div class="marca"><div class="marca-logo">DS</div><div><div class="marca-nombre">Don Salvador</div><div class="marca-sub">Control de inventario y merma</div></div></div>' +
          '<div class="login-lema">' +
            '<h1>Saber qué tiene. Saber qué se pierde.</h1>' +
            '<p>Cada kilo que entra, cada corte que sale y cada peso del cierre del día, en un solo lugar y a su nombre.</p>' +
            '<ul class="login-puntos">' +
              '<li>' + ic('camion') + 'Entradas por nota: kilos facturados contra kilos recibidos</li>' +
              '<li>' + ic('tijeras') + 'Despiece con rendimiento esperado: la merma se vuelve un número</li>' +
              '<li>' + ic('billete') + 'Cierre del día sin hoja de cálculo</li>' +
            '</ul>' +
          '</div>' +
          '<div class="login-pie">Funciona desde el navegador. No hay nada que instalar.</div>' +
        '</section>' +
        '<section class="login-form-wrap">' +
          // Sin <form> ni campo de contraseña real: así el navegador no ofrece guardar la clave a mitad de la demostración.
          '<div class="login-card" id="form-login">' +
            '<h2>Iniciar sesión</h2>' +
            '<p>Entre con su usuario de Don Salvador.</p>' +
            '<div class="campo"><label for="usuario">Usuario</label><input class="input" id="usuario" value="mario" readonly autocomplete="off" spellcheck="false" data-1p-ignore data-lpignore="true" data-bwignore></div>' +
            '<div class="campo"><label for="clave">Contraseña</label><input class="input" id="clave" value="••••••••••" readonly autocomplete="off" data-1p-ignore data-lpignore="true" data-bwignore></div>' +
            '<div class="perfil-fijo">' + ic('escudo') + '<span>Perfil <b>Dueño</b>: ve todo y autoriza los ajustes</span></div>' +
            '<button class="btn-entrar" type="button" id="btn-entrar">Iniciar sesión ' + ic('flecha') + '</button>' +
            '<p class="login-nota">Prototipo visual · datos ilustrativos</p>' +
          '</div>' +
        '</section>' +
      '</main>';

    var entrar = function () {
      var btn = document.getElementById('btn-entrar');
      if (btn.disabled) return;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Entrando…';
      setTimeout(function () {
        iniciarSesion();
        if (location.hash !== '#/tablero') location.hash = '#/tablero';
        else render();
      }, 650);
    };

    document.getElementById('btn-entrar').addEventListener('click', entrar);
    document.getElementById('form-login').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') entrar();
    });
  }

  /* ───────────── Estructura ───────────── */

  var SECCIONES = [
    { id: 'tablero', icono: 'tablero', texto: 'Tablero', grupo: 'General' },
    { id: 'entradas', icono: 'camion', texto: 'Entradas de proveedor', grupo: 'Inventario' },
    { id: 'existencias', icono: 'caja', texto: 'Existencias', grupo: 'Inventario' },
    { id: 'despiece', icono: 'tijeras', texto: 'Despiece y merma', grupo: 'Inventario' },
    { id: 'conteo', icono: 'lista', texto: 'Conteo cíclico', grupo: 'Inventario' },
    { id: 'cierre', icono: 'billete', texto: 'Cierre del día', grupo: 'Dinero y control' },
    { id: 'bitacora', icono: 'escudo', texto: 'Bitácora y ajustes', grupo: 'Dinero y control' }
  ];

  function navHtml() {
    var html = '', grupo = '';
    SECCIONES.forEach(function (s) {
      if (s.grupo !== grupo) { grupo = s.grupo; html += '<div class="nav-titulo">' + grupo + '</div>'; }
      var extra = '';
      if (s.id === 'bitacora') {
        var n = ajustesPendientes();
        if (n) extra = '<span class="contador">' + n + '</span>';
      }
      html += '<a href="#/' + s.id + '" data-seccion="' + s.id + '">' + ic(s.icono) + '<span>' + s.texto + '</span>' + extra + '</a>';
    });
    return html;
  }

  function renderShell() {
    root.innerHTML =
      '<div class="app" id="app">' +
        '<aside class="sidebar" id="sidebar">' +
          '<div class="marca"><div class="marca-logo">DS</div><div><div class="marca-nombre">Don Salvador</div><div class="marca-sub">Inventario y merma</div></div></div>' +
          '<nav class="nav" id="nav">' + navHtml() + '</nav>' +
          '<div class="sidebar-pie">' +
            '<div class="usuario"><div class="avatar">M</div><div><div class="usuario-nombre">Mario</div><div class="usuario-rol">Dueño · Sucursal Matriz</div></div></div>' +
            '<button class="btn-salir" data-accion="salir">' + ic('salir') + 'Cerrar sesión</button>' +
          '</div>' +
        '</aside>' +
        '<div class="velo" id="velo-nav" data-accion="cerrar-nav"></div>' +
        '<div class="main">' +
          '<header class="topbar">' +
            '<button class="btn-icono btn-menu" data-accion="abrir-nav" aria-label="Abrir menú">' + ic('menu') + '</button>' +
            '<label class="buscador">' + ic('buscar') + '<input id="buscar-global" placeholder="Buscar un producto…" autocomplete="off"></label>' +
            '<div class="topbar-der">' +
              '<span class="etiqueta-prototipo" title="Las cifras, proveedores y nombres son de ejemplo">Prototipo</span>' +
              '<span class="sucursal">Sucursal Matriz</span>' +
              '<a class="btn-icono" href="#/tablero" aria-label="Avisos">' + ic('campana') + '<span class="punto"></span></a>' +
            '</div>' +
          '</header>' +
          '<main class="contenido" id="contenido"></main>' +
        '</div>' +
      '</div>' +
      '<div class="velo" id="velo-panel" data-accion="cerrar-panel"></div>' +
      '<aside class="panel" id="panel" aria-hidden="true"></aside>';

    document.getElementById('buscar-global').addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      var q = ev.target.value.trim();
      estado.filtroEx = { cat: 'Todos', bajo: false, q: q };
      ev.target.value = '';
      if (location.hash.indexOf('#/existencias') === 0) render();
      else location.hash = '#/existencias';
    });
  }

  function refrescarNav(seccion) {
    var nav = document.getElementById('nav');
    nav.innerHTML = navHtml();
    var a = nav.querySelector('[data-seccion="' + seccion + '"]');
    if (a) a.classList.add('activo');
  }

  function abrirNav() {
    document.getElementById('app').classList.add('nav-abierta');
    document.getElementById('velo-nav').classList.add('visible');
  }

  function cerrarNav() {
    var app = document.getElementById('app');
    if (!app) return;
    app.classList.remove('nav-abierta');
    document.getElementById('velo-nav').classList.remove('visible');
  }

  var PIE = '<p class="pie-prototipo">Prototipo visual de la Fase 1 para Don Salvador · Las cifras, los proveedores y los nombres son ilustrativos · Code Vector</p>';

  function encabezado(titulo, subtitulo, acciones) {
    return '<div class="encabezado"><div><h1>' + titulo + '</h1>' + (subtitulo ? '<p>' + subtitulo + '</p>' : '') + '</div>' +
      (acciones ? '<div class="acciones">' + acciones + '</div>' : '') + '</div>';
  }

  /* ───────────── Tablero del dueño ───────────── */

  function vTablero() {
    var hora = DS.hoy.getHours();
    var saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
    var valor = valorInventario();
    var bajos = DS.productos.filter(function (p) { return estadoStock(p) === 'bajo'; });
    var rec = recepcionPorProveedor();
    var difKg = r1(rec.reduce(function (s, m) { return s + m.dif; }, 0));
    var difImp = rec.reduce(function (s, m) { return s + m.importe; }, 0);
    var pulpa = mermaReceta('RC-01');
    var grupos = mermaPorGrupo('RC-01');
    var fueraTurno = grupos[0];
    var cad = DS.caducidades.filter(function (c) { return c.dias <= 3; });
    var c = calcCierre();
    var n4471 = totalesNota(nota('4471'));
    var d318 = calcDespiece(despiece('D-0318'));
    var pagoSinNota = DS.cierre.pagosProveedor.filter(function (p) { return !p.nota; })[0];
    var pend = ajustesPendientes();

    var kpis =
      '<div class="rejilla rejilla-3">' +
        kpi('#/existencias', 'caja', '', 'Valor del inventario', dinero(valor), '<b>' + fEntero.format(Math.round(kgInventario())) + ' kg</b> en cámara · ' + DS.productos.length + ' productos') +
        kpi('#/existencias?bajo=1', 'alerta', 'bad', 'Debajo de su mínimo', bajos.length + ' <small>productos</small>', 'Hay que pedir: <b>' + bajos.map(function (p) { return p.nombre; }).join(', ') + '</b>', 'bad') +
        kpi('#/entradas', 'bascula', 'bad', 'Faltante en recepción', kgSigno(difKg), 'Llegó menos de lo facturado · <b>≈ ' + dinero(Math.abs(difImp)) + '</b> en el mes', 'bad') +
        kpi('#/despiece', 'tijeras', 'warn', 'Merma en despiece de pulpa', pct(pulpa.mermaPct), 'Debería ser <b>' + pct(pulpa.esperada) + '</b> según la receta · esta semana') +
        kpi('#/existencias', 'reloj', 'warn', 'Por caducar', cad.length + ' <small>lotes en 3 días</small>', cad.map(function (x) { return prod(x.clave).nombre; }).join(' · ')) +
        kpi('#/cierre', 'billete', 'bad', 'Cierre de ayer', dineroSigno(c.dif), 'Venta <b>' + dinero(c.venta) + '</b> · faltó efectivo en caja', 'bad') +
      '</div>';

    var alertas = [
      {
        tipo: 'bad', icono: 'bascula', ir: '#/entradas/4471',
        titulo: 'Nota 4471 · ' + DS.proveedores.dcn + ': llegaron ' + kg(n4471.rec) + ' de ' + kg(n4471.fact),
        det: 'Faltan ' + kg(Math.abs(n4471.dif)) + ', unos ' + dinero2(Math.abs(n4471.importe)) + '. La existencia subió solo por lo que se pesó.'
      },
      {
        tipo: 'bad', icono: 'billete', ir: '#/cierre',
        titulo: 'Pago de ' + dinero(pagoSinNota.importe) + ' a ' + DS.proveedores[pagoSinNota.proveedor] + ' sin nota de entrada',
        det: 'Se registró en el cierre de ayer y no hay mercancía recibida de ese proveedor en el mes.'
      },
      {
        tipo: 'warn', icono: 'tijeras', ir: '#/despiece/D-0318',
        titulo: 'Despiece D-0318 · Pulpa blanca: merma de ' + pct(d318.mermaPct) + ' contra ' + pct(d318.receta.merma) + ' esperado',
        det: 'Turno ' + fueraTurno.turno.toLowerCase() + ': ' + fueraTurno.fuera + ' de ' + fueraTurno.ops + ' despieces arriba del rango esta semana. Faltaron ' + kg(d318.faltante) + ' de cortes.'
      },
      {
        tipo: 'warn', icono: 'caja', ir: '#/existencias?bajo=1',
        titulo: bajos.length + ' productos debajo de su mínimo',
        det: bajos.map(function (p) { return p.nombre + ' (' + unidades(existenciaInv(p), p.unidad) + ', mínimo ' + unidades(p.min, p.unidad) + ')'; }).join(' · ')
      },
      {
        tipo: 'warn', icono: 'reloj', ir: '#/existencias',
        titulo: prod(cad[0].clave).nombre + ', lote ' + cad[0].lote + ': ' + kg(cad[0].kg) + ' caducan en ' + cad[0].dias + ' días',
        det: estadoStock(prod(cad[0].clave)) === 'sobre' ? 'Además está sobre su máximo. Conviene sacarlo primero.' : 'Conviene sacarlo primero.'
      }
    ];
    if (pend) {
      alertas.push({
        tipo: 'info', icono: 'escudo', ir: '#/bitacora',
        titulo: pend === 1 ? 'Un ajuste de inventario espera su autorización' : pend + ' ajustes de inventario esperan su autorización',
        det: 'Mientras no los autorice, no cambian la existencia.'
      });
    }

    var maxDif = Math.max.apply(null, rec.map(function (m) { return Math.abs(m.dif); }).concat([1]));
    var barrasRec = rec.map(function (m) {
      return barra(DS.proveedores[m.prov], kgSigno(m.dif) + ' · ' + dinero(Math.abs(m.importe)), Math.abs(m.dif) / maxDif * 100, Math.abs(m.dif) > 5 ? '' : 'gris');
    }).join('');

    var escala = 15;
    var barrasTurno = grupos.map(function (g) {
      return barra('Turno ' + g.turno.toLowerCase() + ' · ' + nombreUsuario(g.resp), pct(g.mermaPct), g.mermaPct / escala * 100, g.desviacion > DS.umbralDesviacion ? 'warn' : 'ok', pulpa.esperada / escala * 100);
    }).join('');

    return '<div class="entrar">' +
      encabezado(saludo + ', Mario', capital(fFechaLarga.format(DS.hoy)) + ' · Esto es lo que necesita ver hoy.',
        '<button class="btn" data-toast="El periodo del tablero se puede cambiar a semana, mes o un rango de fechas.">' + ic('calendario') + 'Este mes</button>') +
      kpis +
      '<div class="rejilla rejilla-tablero mt">' +
        '<section class="tarjeta">' +
          '<div class="tarjeta-cab"><div><h2>Lo que requiere su atención</h2><p>Cada aviso lleva a su detalle</p></div><span class="badge marca">' + alertas.length + ' avisos</span></div>' +
          '<div class="alertas">' + alertas.map(function (a) {
            return '<a class="alerta" href="' + a.ir + '"><div class="alerta-icono ' + a.tipo + '">' + ic(a.icono) + '</div>' +
              '<div class="alerta-texto"><div class="alerta-titulo">' + a.titulo + '</div><div class="alerta-det">' + a.det + '</div></div>' +
              '<span class="flecha">' + ic('derecha') + '</span></a>';
          }).join('') + '</div>' +
        '</section>' +
        '<div class="rejilla">' +
          '<section class="tarjeta">' +
            '<div class="tarjeta-cab"><div><h2>Faltante en recepción por proveedor</h2><p>Kilos facturados que no llegaron, este mes</p></div></div>' +
            '<div class="tarjeta-cuerpo"><div class="barras">' + barrasRec + '</div></div>' +
          '</section>' +
          '<section class="tarjeta">' +
            '<div class="tarjeta-cab"><div><h2>Merma de pulpa blanca por turno</h2><p>Lo que no salió como corte, esta semana</p></div></div>' +
            '<div class="tarjeta-cuerpo"><div class="barras">' + barrasTurno + '</div>' +
              '<div class="leyenda"><span><i class="linea"></i>Merma esperada por receta: ' + pct(pulpa.esperada) + '</span></div></div>' +
          '</section>' +
        '</div>' +
      '</div>' +
      PIE + '</div>';
  }

  function kpi(href, icono, tono, titulo, valor, det, tonoValor) {
    return '<a class="tarjeta kpi" href="' + href + '">' +
      '<div class="kpi-cab"><span class="kpi-icono ' + tono + '">' + ic(icono, 'icon-sm') + '</span>' + titulo + '</div>' +
      '<div class="kpi-valor ' + (tonoValor || '') + '">' + valor + '</div>' +
      '<div class="kpi-det">' + det + '</div></a>';
  }

  function barra(rotulo, valor, ancho, clase, meta) {
    return '<div class="barra-fila"><div class="barra-rotulo"><span>' + rotulo + '</span><span>' + valor + '</span></div>' +
      '<div class="barra"><i class="' + (clase || '') + '" style="width:' + Math.max(2, Math.min(100, ancho)).toFixed(1) + '%"></i>' +
      (meta !== undefined ? '<span class="meta" style="left:' + meta.toFixed(1) + '%"></span>' : '') + '</div></div>';
  }

  /* ───────────── Entradas de proveedor ───────────── */

  function vEntradas(r) {
    if (r.id) return vNota(r.id);

    var confirmadas = DS.notas.filter(function (n) { return totalesNota(n).pesada; });
    var fact = 0, rec = 0, imp = 0;
    confirmadas.forEach(function (n) { var t = totalesNota(n); fact += t.fact; rec += t.rec; imp += t.importe; });
    var dif = r1(rec - fact);

    var filas = DS.notas.slice().sort(function (a, b) { return b.fecha - a.fecha; }).map(function (n) {
      var t = totalesNota(n);
      var difCel = t.pesada ? (t.dif < 0 ? '<span class="neg">' + kgSigno(t.dif) + '</span>' : '<span class="pos">Completa</span>') : '<span class="tenue">—</span>';
      var est = n.estado === 'Por pesar' ? '<span class="badge warn">' + ic('bascula', 'icon-sm') + 'Por pesar</span>' : '<span class="badge ok">Confirmada</span>';
      return '<tr class="clic' + (n.folio === '4471' ? ' resaltada' : '') + '" data-ir="#/entradas/' + n.folio + '">' +
        '<td><span class="prod">Nota ' + n.folio + '</span><span class="sub">' + n.renglones.length + ' renglones</span></td>' +
        '<td>' + DS.proveedores[n.proveedor] + '</td>' +
        '<td>' + cuando(n.fecha) + '</td>' +
        '<td class="der">' + kg(t.fact) + '</td>' +
        '<td class="der">' + (t.pesada ? kg(t.rec) : '<span class="tenue">Por pesar</span>') + '</td>' +
        '<td class="der">' + difCel + '</td>' +
        '<td>' + est + '</td>' +
        '<td>' + nombreUsuario(n.recibio) + '<span class="sub">' + perfilUsuario(n.recibio) + '</span></td>' +
        '</tr>';
    }).join('');

    var porProv = recepcionPorProveedor().map(function (m) {
      return '<tr><td class="prod">' + DS.proveedores[m.prov] + '</td><td class="der">' + m.notas + '</td><td class="der">' + kg(m.fact) + '</td><td class="der">' + kg(m.rec) + '</td>' +
        '<td class="der ' + (m.dif < 0 ? 'neg' : '') + '">' + kgSigno(m.dif) + '</td><td class="der">' + pct(Math.abs(m.pct)) + '</td><td class="der">' + dinero2(Math.abs(m.importe)) + '</td></tr>';
    }).join('');

    return '<div class="entrar">' +
      encabezado('Entradas de proveedor', 'Cada nota se registra con lo que dice el papel y con lo que marcó la báscula.',
        '<button class="btn" data-toast="Se descargaría el reporte de recepción en Excel.">' + ic('descargar') + 'Exportar</button>' +
        '<button class="btn btn-primario" data-toast="' + AVISO_PROTOTIPO + '">' + ic('mas') + 'Nueva entrada</button>') +
      '<div class="rejilla rejilla-4">' +
        kpi('#/entradas', 'lista', '', 'Notas este mes', String(DS.notas.length), confirmadas.length + ' confirmadas · ' + (DS.notas.length - confirmadas.length) + ' por pesar') +
        kpi('#/entradas', 'camion', '', 'Kilos facturados', kg(r1(fact)), 'Lo que dicen las notas confirmadas') +
        kpi('#/entradas', 'bascula', 'ok', 'Kilos recibidos', kg(r1(rec)), 'Lo que marcó la báscula al recibir') +
        kpi('#/entradas', 'alerta', 'bad', 'No llegaron', kgSigno(dif), '≈ <b>' + dinero2(Math.abs(imp)) + '</b> a costo de compra', 'bad') +
      '</div>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Notas de entrada</h2><p>Toque una nota para ver el detalle por producto</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Nota</th><th>Proveedor</th><th>Recibida</th><th class="der">Facturado</th><th class="der">Recibido</th><th class="der">Diferencia</th><th>Estado</th><th>Recibió</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
      '</section>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Diferencias de recepción por proveedor</h2><p>De mayor a menor faltante, este mes</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Proveedor</th><th class="der">Notas</th><th class="der">Facturado</th><th class="der">Recibido</th><th class="der">Diferencia</th><th class="der">% del total</th><th class="der">Importe</th></tr></thead><tbody>' + porProv + '</tbody></table></div>' +
      '</section>' +
      PIE + '</div>';
  }

  function vNota(folio) {
    var n = nota(folio);
    if (!n) return vEntradas({});
    var t = totalesNota(n);

    var filas = n.renglones.map(function (r) {
      var p = prod(r.clave);
      var dif = r.rec === null ? null : r1(r.rec - r.fact);
      return '<tr class="clic' + (dif < 0 ? ' resaltada' : '') + '" data-producto="' + p.clave + '">' +
        '<td><span class="prod">' + p.nombre + '</span><span class="sub">' + p.clave + '</span></td>' +
        '<td class="der">' + unidades(r.cant, p.unidad) + '</td>' +
        '<td class="der">' + kg(r.fact) + '</td>' +
        '<td class="der">' + (r.rec === null ? '<span class="tenue">Por pesar</span>' : kg(r.rec)) + '</td>' +
        '<td class="der">' + (dif === null ? '<span class="tenue">—</span>' : dif < 0 ? '<span class="neg">' + kgSigno(dif) + '</span>' : '<span class="pos">Completo</span>') + '</td>' +
        '<td class="der">' + dinero2(p.costo) + '</td>' +
        '<td class="der">' + (dif ? '<span class="neg">' + dinero2(dif * p.costo) + '</span>' : '<span class="tenue">—</span>') + '</td>' +
        '<td>' + (r.lote ? r.lote + '<span class="sub">Caduca en ' + r.cad + ' días</span>' : '<span class="tenue">Al pesar</span>') + '</td>' +
        '</tr>';
    }).join('');

    var destacado = t.pesada
      ? '<div class="destacado">' +
          '<div><div class="rot">Dice la nota</div><div class="val">' + fUno.format(t.fact) + ' <small>kg</small></div><div class="det">Lo que el proveedor facturó</div></div>' +
          '<div><div class="rot">Marcó la báscula</div><div class="val">' + fUno.format(t.rec) + ' <small>kg</small></div><div class="det">Lo que entró a la existencia</div></div>' +
          '<div><div class="rot">' + (t.dif < 0 ? 'No llegaron' : 'Diferencia') + '</div><div class="val">' + kgSigno(t.dif).replace(' kg', ' <small>kg</small>') + '</div><div class="det">' + (t.dif < 0 ? '≈ ' + dinero2(Math.abs(t.importe)) + ' a reclamar al proveedor' : 'La nota llegó completa') + '</div></div>' +
        '</div>'
      : '<div class="destacado">' +
          '<div><div class="rot">Dice la nota</div><div class="val">' + fUno.format(t.fact) + ' <small>kg</small></div><div class="det">Lo que el proveedor facturó</div></div>' +
          '<div><div class="rot">Marcó la báscula</div><div class="val">— <small>kg</small></div><div class="det">Falta pesar</div></div>' +
          '<div><div class="rot">Existencia</div><div class="val" style="font-size:22px">Sin mover</div><div class="det">Hasta que se capture lo recibido</div></div>' +
        '</div>';

    var avisos = t.pesada
      ? '<div class="aviso info mt">' + ic('info') + '<div>La existencia subió por los <b>' + kg(t.rec) + '</b> que se pesaron, no por los ' + kg(t.fact) + ' de la nota. La diferencia queda a nombre de <b>' + DS.proveedores[n.proveedor] + '</b> y se suma a su reporte de recepción.</div></div>' +
        '<div class="aviso warn mt">' + ic('candado') + '<div>Una nota confirmada ya no se edita. Si hay un error, se cancela con motivo y se captura de nuevo; las dos quedan en la bitácora.</div></div>'
      : '<div class="aviso warn mt">' + ic('bascula') + '<div>Esta nota todavía no mueve el inventario. Se confirma hasta que control interno captura los kilos que marcó la báscula.</div></div>';

    var acciones = t.pesada
      ? '<button class="btn" data-toast="Se imprimiría el comprobante de recepción con la diferencia para reclamar al proveedor.">' + ic('imprimir') + 'Imprimir</button>' +
        '<button class="btn" data-toast="Para cancelar se pide un motivo y queda registrado quién lo hizo.">' + ic('cerrar') + 'Cancelar nota</button>'
      : '<button class="btn btn-primario" data-toast="Aquí control interno captura lo que marcó la báscula por cada renglón.">' + ic('bascula') + 'Capturar kilos recibidos</button>';

    return '<div class="entrar">' +
      '<a class="volver" href="#/entradas">' + ic('izquierda', 'icon-sm') + 'Entradas de proveedor</a>' +
      encabezado('Nota ' + n.folio + ' · ' + DS.proveedores[n.proveedor],
        '<span class="meta-lista"><span>Recibida <b>' + cuando(n.fecha) + '</b></span><span>Recibió <b>' + nombreUsuario(n.recibio) + '</b> · ' + perfilUsuario(n.recibio) + '</span><span>Pago <b>' + n.pago + '</b></span></span>',
        acciones) +
      destacado +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Detalle por producto</h2><p>Se compra por caja o pieza y se registra en kilos. Toque un producto para ver su historial.</p></div>' + (n.estado === 'Por pesar' ? '<span class="badge warn">Por pesar</span>' : '<span class="badge ok">Confirmada</span>') + '</div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Producto</th><th class="der">Cantidad</th><th class="der">Facturado</th><th class="der">Recibido</th><th class="der">Diferencia</th><th class="der">Costo / kg</th><th class="der">Importe</th><th>Lote</th></tr></thead><tbody>' + filas + '</tbody>' +
        '<tfoot><tr><td>Total de la nota</td><td></td><td class="der">' + kg(t.fact) + '</td><td class="der">' + (t.pesada ? kg(t.rec) : '—') + '</td><td class="der ' + (t.dif < 0 ? 'neg' : '') + '">' + (t.pesada ? kgSigno(t.dif) : '—') + '</td><td></td><td class="der ' + (t.importe < 0 ? 'neg' : '') + '">' + (t.pesada && t.importe ? dinero2(t.importe) : '—') + '</td><td></td></tr></tfoot>' +
        '</table></div></section>' +
      avisos +
      PIE + '</div>';
  }

  /* ───────────── Existencias ───────────── */

  var CATEGORIAS = ['Todos', 'Res', 'Cerdo', 'Aves', 'Misceláneos'];

  function filasExistencias() {
    var f = estado.filtroEx;
    var q = f.q.toLowerCase();
    var lista = DS.productos.filter(function (p) {
      if (f.cat !== 'Todos' && p.categoria !== f.cat) return false;
      if (f.bajo && estadoStock(p) !== 'bajo') return false;
      if (q && (p.nombre + ' ' + p.clave).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (!lista.length) return '<tr><td colspan="7" class="centro tenue" style="padding:28px">No hay productos con ese filtro.</td></tr>';
    return lista.map(function (p) {
      var e = existenciaInv(p);
      var est = estadoStock(p);
      var tope = p.max * 1.35;
      var mov = kardexDe(p);
      var ultimo = mov[mov.length - 1];
      return '<tr class="clic' + (est === 'bajo' ? ' resaltada' : '') + '" data-producto="' + p.clave + '">' +
        '<td><span class="prod">' + p.nombre + '</span><span class="sub">' + p.clave + ' · ' + p.categoria + '</span></td>' +
        '<td class="der">' + (p.unidad === 'kg' ? '<span class="tenue">Por kilo</span>' : unidades(p.piezas, p.unidad)) + '</td>' +
        '<td class="der"><b>' + kg(p.kg) + '</b></td>' +
        '<td><div class="rango" title="Mínimo ' + p.min + ' · Máximo ' + p.max + '">' +
          '<span class="zona" style="left:' + (p.min / tope * 100).toFixed(1) + '%;width:' + ((p.max - p.min) / tope * 100).toFixed(1) + '%"></span>' +
          '<span class="marca-ex ' + (est === 'bajo' ? 'bad' : est === 'sobre' ? 'warn' : '') + '" style="left:' + Math.min(100, e / tope * 100).toFixed(1) + '%"></span></div>' +
          '<span class="sub">Mín. ' + unidades(p.min, p.unidad) + ' · Máx. ' + unidades(p.max, p.unidad) + '</span></td>' +
        '<td>' + badgeStock(p) + '</td>' +
        '<td class="der">' + dinero(p.kg * p.costo) + '</td>' +
        '<td>' + cuando(ultimo.fecha) + '<span class="sub">' + ultimo.tipo + '</span></td>' +
        '</tr>';
    }).join('');
  }

  function chipsExistencias() {
    var f = estado.filtroEx;
    return CATEGORIAS.map(function (c) {
      return '<button class="chip' + (f.cat === c ? ' activo' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('') + '<button class="chip' + (f.bajo ? ' activo' : '') + '" data-bajo="1">' + ic('alerta', 'icon-sm') + ' Solo debajo del mínimo</button>';
  }

  function vExistencias(r) {
    if (r.params.get('bajo') === '1') estado.filtroEx = { cat: 'Todos', bajo: true, q: '' };
    var bajos = DS.productos.filter(function (p) { return estadoStock(p) === 'bajo'; }).length;

    var cad = DS.caducidades.map(function (c) {
      var p = prod(c.clave);
      var tono = c.dias <= 2 ? 'bad' : c.dias <= 3 ? 'warn' : 'info';
      return '<tr class="clic" data-producto="' + p.clave + '"><td><span class="prod">' + p.nombre + '</span><span class="sub">' + p.ubicacion + '</span></td><td>' + c.lote + '</td><td class="der">' + kg(c.kg) + '</td>' +
        '<td><span class="badge ' + tono + '">En ' + c.dias + ' días</span></td><td class="tenue">Sale primero</td></tr>';
    }).join('');

    return '<div class="entrar">' +
      encabezado('Existencias', 'Cada producto con sus dos medidas: la caja o pieza que se compra y el kilo que se vende.',
        '<button class="btn" data-toast="Se descargaría el reporte de existencias valuadas en Excel.">' + ic('descargar') + 'Existencias valuadas</button>' +
        '<button class="btn btn-primario" data-toast="Dar de alta productos y mover precios solo lo puede hacer oficina.">' + ic('mas') + 'Nuevo producto</button>') +
      '<div class="rejilla rejilla-4">' +
        kpi('#/existencias', 'caja', '', 'Valor del inventario', dinero(valorInventario()), 'A costo de compra') +
        kpi('#/existencias', 'bascula', '', 'Kilos en cámara', kg(r1(kgInventario())), 'Suma de todos los productos') +
        kpi('#/existencias?bajo=1', 'alerta', 'bad', 'Debajo de su mínimo', String(bajos), 'Toque para ver solo esos', 'bad') +
        kpi('#/existencias', 'reloj', 'warn', 'Por caducar en 7 días', String(DS.caducidades.length) + ' <small>lotes</small>', 'Se sugiere sacar primero lo más antiguo') +
      '</div>' +
      '<section class="tarjeta mt">' +
        '<div class="filtros" id="filtros-ex">' + chipsExistencias() +
          '<label class="buscador">' + ic('buscar') + '<input id="buscar-ex" placeholder="Buscar por nombre o clave" value="' + esc(estado.filtroEx.q) + '" autocomplete="off"></label></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Producto</th><th class="der">Cajas o piezas</th><th class="der">Kilos</th><th>Mínimo y máximo</th><th>Estado</th><th class="der">Valor</th><th>Último movimiento</th></tr></thead>' +
        '<tbody id="tbody-ex">' + filasExistencias() + '</tbody></table></div>' +
      '</section>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Próximos a caducar</h2><p>Por lote de proveedor. Lo más antiguo sale primero.</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Producto</th><th>Lote</th><th class="der">Kilos</th><th>Caduca</th><th></th></tr></thead><tbody>' + cad + '</tbody></table></div>' +
      '</section>' +
      PIE + '</div>';
  }

  function despuesExistencias(r) {
    var input = document.getElementById('buscar-ex');
    input.addEventListener('input', function () {
      estado.filtroEx.q = input.value;
      document.getElementById('tbody-ex').innerHTML = filasExistencias();
    });
    if (r.id && prod(r.id)) abrirKardex(r.id);
  }

  function refrescarExistencias() {
    document.getElementById('filtros-ex').querySelectorAll('.chip').forEach(function (b) { b.remove(); });
    document.getElementById('filtros-ex').insertAdjacentHTML('afterbegin', chipsExistencias());
    document.getElementById('tbody-ex').innerHTML = filasExistencias();
  }

  /* ───────────── Panel del kardex ───────────── */

  function abrirKardex(clave) {
    var p = prod(clave);
    if (!p) return;
    var movs = kardexDe(p);
    var origen = null;
    DS.recetas.forEach(function (rc) { rc.derivados.forEach(function (d) { if (d.clave === clave) origen = prod(rc.origen); }); });

    var COLORES = { Entrada: 'var(--ok)', Despiece: 'var(--brand)', Venta: 'var(--info)', Saldo: 'var(--ink-3)', Ajuste: 'var(--warn)' };
    var filas = movs.slice().reverse().map(function (m) {
      return '<tr><td>' + cuando(m.fecha) + '</td>' +
        '<td><span class="tipo-mov"><i style="background:' + COLORES[m.tipo] + '"></i>' + m.tipo + '</span><span class="sub">' + m.doc + '</span></td>' +
        '<td class="der ' + (m.tipo === 'Saldo' ? '' : m.cant < 0 ? 'neg' : 'pos') + '">' + (m.tipo === 'Saldo' ? kg(m.cant) : kgSigno(m.cant)) + '</td>' +
        '<td class="der"><b>' + kg(m.saldo) + '</b></td>' +
        '<td>' + nombreUsuario(m.usuario) + '</td></tr>';
    }).join('');

    var caja1 = p.unidad === 'kg'
      ? '<div><div class="rot">Sale del despiece de</div><div class="val" style="font-size:18px;margin-top:6px">' + (origen ? origen.nombre : 'Compra directa') + '</div></div>'
      : '<div><div class="rot">Se compra por ' + p.unidad + '</div><div class="val">' + unidades(p.piezas, p.unidad) + '</div></div>';

    var panel = document.getElementById('panel');
    panel.innerHTML =
      '<div class="panel-cab"><div><span class="badge">' + p.clave + ' · ' + p.categoria + ' · ' + p.ubicacion + '</span><h2 style="margin-top:10px">' + p.nombre + '</h2>' +
        '<p>Clave SAT ' + p.sat + ' · Unidad SAT KGM · Listo para facturar</p></div>' +
        '<button class="btn-icono" data-accion="cerrar-panel" aria-label="Cerrar">' + ic('cerrar') + '</button></div>' +
      '<div class="panel-cuerpo">' +
        '<div class="doble-unidad">' + caja1 +
          '<div><div class="rot">Se vende por kilo</div><div class="val">' + kg(p.kg) + '</div></div></div>' +
        '<div class="meta-lista mt"><span>Mínimo <b>' + unidades(p.min, p.unidad) + '</b></span><span>Máximo <b>' + unidades(p.max, p.unidad) + '</b></span><span>Costo <b>' + dinero2(p.costo) + ' / kg</b></span><span>Valor <b>' + dinero(p.kg * p.costo) + '</b></span>' + badgeStock(p) + '</div>' +
        '<h3 style="font-size:15px;margin-top:22px">Historial de movimientos</h3>' +
        '<div class="tabla-wrap" style="margin-top:10px;border:1px solid var(--line);border-radius:12px"><table class="datos"><thead><tr><th>Cuándo</th><th>Movimiento</th><th class="der">Cantidad</th><th class="der">Existencia</th><th>Quién</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
      '</div>' +
      '<div class="panel-pie">' + ic('candado', 'icon-sm') + ' La existencia siempre es la suma de estos movimientos. Ninguno se puede borrar.</div>';

    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
    document.getElementById('velo-panel').classList.add('visible');
  }

  function cerrarPanel() {
    var panel = document.getElementById('panel');
    if (!panel) return;
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
    document.getElementById('velo-panel').classList.remove('visible');
    var r = parseHash();
    if (r.section === 'existencias' && r.id) history.replaceState(null, '', '#/existencias');
  }

  /* ───────────── Despiece y merma ───────────── */

  function vDespiece(r) {
    if (r.id) return vDespieceDetalle(r.id);

    var pulpa = mermaReceta('RC-01');
    var calc = DS.despieces.map(function (d) { return { d: d, c: calcDespiece(d) }; });
    var fuera = calc.filter(function (x) { return x.c.fuera; }).length;
    var faltante = r1(calc.reduce(function (s, x) { return s + x.c.faltante; }, 0));
    var faltImp = calc.reduce(function (s, x) { return s + x.c.importe; }, 0);

    var recetas = DS.recetas.map(function (rc) {
      var o = prod(rc.origen);
      var derivados = rc.derivados.map(function (dv) {
        return '<div class="derivado"><div><div class="nom"><span>' + prod(dv.clave).nombre + '</span></div><div class="barra"><i style="width:' + dv.pct + '%"></i></div></div><span class="pct">' + dv.pct + ' %</span></div>';
      }).join('') +
        '<div class="derivado"><div><div class="nom"><span class="tenue">Merma esperada (hueso, grasa, recorte)</span></div><div class="barra"><i class="gris" style="width:' + rc.merma + '%"></i></div></div><span class="pct tenue">' + rc.merma + ' %</span></div>';
      return '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Receta ' + rc.id + ' · ' + o.nombre + '</h2><p>Versión ' + rc.version + ' · suma 100 %</p></div>' +
        '<button class="btn btn-chico" data-toast="Solo oficina puede cambiar una receta. Los despieces anteriores conservan la versión con la que se hicieron.">Editar</button></div>' +
        '<div class="tarjeta-cuerpo"><div class="receta-flujo"><div class="receta-origen">' + o.nombre + '<small>100 kg entran</small></div><div class="receta-derivados">' + derivados + '</div></div></div></section>';
    }).join('');

    var filas = calc.map(function (x) {
      var d = x.d, c = x.c;
      return '<tr class="clic' + (c.fuera ? ' resaltada' : '') + '" data-ir="#/despiece/' + d.folio + '">' +
        '<td><span class="prod">' + d.folio + '</span><span class="sub">' + c.origen.nombre + '</span></td>' +
        '<td>' + cuando(d.fecha) + '<span class="sub">Turno ' + d.turno.toLowerCase() + '</span></td>' +
        '<td>' + nombreUsuario(d.resp) + '</td>' +
        '<td class="der">' + kg(d.entrada) + '</td>' +
        '<td class="der">' + kg(c.obtenido) + '</td>' +
        '<td class="der"><b>' + pct(c.mermaPct) + '</b><span class="sub">esperada ' + pct(c.receta.merma) + '</span></td>' +
        '<td>' + (c.fuera ? '<span class="badge bad">' + pts(c.desviacion) + '</span>' : '<span class="badge ok">' + pts(c.desviacion) + '</span>') + '</td>' +
        '</tr>';
    }).join('');

    var grupos = mermaPorGrupo().map(function (g) {
      var malo = g.desviacion > DS.umbralDesviacion;
      return '<tr' + (malo ? ' class="resaltada"' : '') + '><td class="prod">' + prod(g.receta.origen).nombre + '</td><td>' + g.turno + '</td><td>' + nombreUsuario(g.resp) + '</td>' +
        '<td class="der">' + g.ops + '</td><td class="der">' + kg(g.entrada) + '</td><td class="der"><b>' + pct(g.mermaPct) + '</b></td><td class="der">' + pct(g.receta.merma) + '</td>' +
        '<td>' + (malo ? '<span class="badge bad">' + pts(g.desviacion) + ' · ' + g.fuera + ' de ' + g.ops + ' fuera</span>' : '<span class="badge ok">' + pts(g.desviacion) + '</span>') + '</td></tr>';
    }).join('');

    return '<div class="entrar">' +
      encabezado('Despiece y merma', 'Lo que entra al área de proceso contra lo que sale como cortes. La diferencia es la merma, con fecha, turno y nombre.',
        '<button class="btn btn-primario" data-toast="Aquí el área de proceso registra los kilos que entraron y los que salieron de cada corte.">' + ic('mas') + 'Registrar despiece</button>') +
      '<div class="rejilla rejilla-4">' +
        kpi('#/despiece', 'tijeras', 'warn', 'Merma de pulpa, semana', pct(pulpa.mermaPct), 'La receta dice <b>' + pct(pulpa.esperada) + '</b>') +
        kpi('#/despiece', 'alerta', 'bad', 'Despieces fuera de rango', fuera + ' <small>de ' + calc.length + '</small>', 'Más de ' + DS.umbralDesviacion + ' puntos arriba de lo esperado', 'bad') +
        kpi('#/despiece', 'bascula', 'bad', 'Cortes que no salieron', kg(faltante), '≈ <b>' + dinero(faltImp) + '</b> a costo, esta semana', 'bad') +
        kpi('#/despiece', 'lista', '', 'Recetas activas', String(DS.recetas.length), 'Cada producto origen con sus cortes') +
      '</div>' +
      '<div class="rejilla rejilla-2 mt">' + recetas + '</div>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Despieces recientes</h2><p>Toque uno para ver corte por corte</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Despiece</th><th>Cuándo</th><th>Responsable</th><th class="der">Entraron</th><th class="der">Salieron</th><th class="der">Merma</th><th>Desviación</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
      '</section>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Por turno y responsable</h2><p>Donde una desviación se repite deja de ser casualidad</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Producto origen</th><th>Turno</th><th>Responsable</th><th class="der">Despieces</th><th class="der">Kilos</th><th class="der">Merma real</th><th class="der">Esperada</th><th>Desviación</th></tr></thead><tbody>' + grupos + '</tbody></table></div>' +
      '</section>' +
      '<div class="aviso info mt">' + ic('info') + '<div>El sistema muestra dónde y cuándo se desvía el rendimiento. La causa —hueso de más, un cuchillo sin filo, producto que no llegó a vitrina— la determina usted.</div></div>' +
      PIE + '</div>';
  }

  function vDespieceDetalle(folio) {
    var d = despiece(folio);
    if (!d) return vDespiece({ params: new URLSearchParams() });
    var c = calcDespiece(d);
    var max = Math.max.apply(null, c.derivados.map(function (x) { return Math.max(x.esperado, x.real); }));

    var comp = c.derivados.map(function (x) {
      var p = prod(x.clave);
      var dif = r1(x.real - x.esperado);
      return '<div class="comp-fila"><div class="comp-nom"><span>' + p.nombre + '</span><span class="' + (dif < -0.05 ? 'neg' : 'pos') + '">' + kgSigno(dif) + '</span></div>' +
        '<div class="comp-barras">' +
          '<div class="comp-barra"><span>Esperado</span><div class="barra"><i class="gris" style="width:' + (x.esperado / max * 100).toFixed(1) + '%"></i></div><span class="v">' + kg(r1(x.esperado)) + '</span></div>' +
          '<div class="comp-barra"><span>Obtenido</span><div class="barra"><i class="' + (dif < -0.05 ? '' : 'ok') + '" style="width:' + (x.real / max * 100).toFixed(1) + '%"></i></div><span class="v">' + kg(x.real) + '</span></div>' +
        '</div></div>';
    }).join('');

    var movimiento = '<tr><td class="prod">' + c.origen.nombre + '</td><td>Sale del inventario</td><td class="der neg">' + kgSigno(-d.entrada) + '</td></tr>' +
      c.derivados.map(function (x) { return '<tr><td class="prod">' + prod(x.clave).nombre + '</td><td>Entra al inventario</td><td class="der pos">' + kgSigno(x.real) + '</td></tr>'; }).join('') +
      '<tr><td class="prod tenue">Merma</td><td class="tenue">Hueso, grasa, recorte y lo que falta</td><td class="der">' + kg(c.merma) + '</td></tr>';

    var mismos = DS.despieces.filter(function (x) { return x.receta === d.receta && x.turno === d.turno && x.resp === d.resp; });
    var repetidos = mismos.filter(function (x) { return calcDespiece(x).fuera; }).length;

    return '<div class="entrar">' +
      '<a class="volver" href="#/despiece">' + ic('izquierda', 'icon-sm') + 'Despiece y merma</a>' +
      encabezado('Despiece ' + d.folio + ' · ' + c.origen.nombre,
        '<span class="meta-lista"><span><b>' + cuando(d.fecha) + '</b></span><span>Turno <b>' + d.turno.toLowerCase() + '</b></span><span>Responsable <b>' + nombreUsuario(d.resp) + '</b> · Área de proceso</span><span>Receta <b>' + c.receta.id + ' v' + c.receta.version + '</b></span></span>',
        '<button class="btn" data-toast="Se imprimirían las etiquetas de los cortes con su peso y lote.">' + ic('imprimir') + 'Etiquetas</button>') +
      '<div class="destacado">' +
        '<div><div class="rot">Entraron</div><div class="val">' + fUno.format(d.entrada) + ' <small>kg</small></div><div class="det">' + c.origen.nombre + '</div></div>' +
        '<div><div class="rot">Salieron como cortes</div><div class="val">' + fUno.format(c.obtenido) + ' <small>kg</small></div><div class="det">Debían salir ' + kg(r1(d.entrada * (1 - c.receta.merma / 100))) + '</div></div>' +
        '<div><div class="rot">Merma</div><div class="val">' + pct(c.mermaPct).replace(' %', ' <small>%</small>') + '</div><div class="det">La receta espera ' + pct(c.receta.merma) + ' · ' + pts(c.desviacion) + '</div></div>' +
      '</div>' +
      '<div class="rejilla rejilla-tablero mt">' +
        '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Rendimiento esperado contra obtenido</h2><p>Corte por corte, en kilos</p></div></div>' +
          '<div class="tarjeta-cuerpo"><div class="comparacion">' + comp + '</div>' +
          '<div class="leyenda"><span><i style="background:#C9BFB8"></i>Esperado por receta</span><span><i></i>Obtenido abajo de lo esperado</span><span><i class="ok"></i>Obtenido completo</span></div></div></section>' +
        '<div class="rejilla">' +
          (c.fuera
            ? '<div class="aviso bad">' + ic('alerta') + '<div>Faltaron <b>' + kg(c.faltante) + '</b> de cortes respecto a la receta, unos <b>' + dinero2(c.importe) + '</b> a costo. Van <b>' + repetidos + ' de ' + mismos.length + '</b> despieces del turno ' + d.turno.toLowerCase() + ' arriba del rango esta semana.</div></div>'
            : '<div class="aviso ok">' + ic('ok') + '<div>Este despiece quedó dentro del rango esperado por la receta.</div></div>') +
          '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Movimiento de inventario</h2><p>Un solo registro: baja el origen y suben los cortes</p></div></div>' +
            '<div class="tabla-wrap"><table class="datos"><tbody>' + movimiento + '</tbody></table></div></section>' +
          '<div class="aviso info">' + ic('candado') + '<div>Si los kilos del origen no alcanzan, el sistema no deja registrar el despiece. Ya no hay existencias en negativo.</div></div>' +
        '</div>' +
      '</div>' +
      PIE + '</div>';
  }

  /* ───────────── Conteo cíclico ───────────── */

  function vConteo() {
    var lineas = lineasConteo();
    var filas, acciones, aviso;

    if (!estado.conteoCerrado) {
      filas = lineas.map(function (l) {
        var v = estado.conteoValores[l.p.clave];
        return '<tr><td><span class="prod">' + l.p.nombre + '</span><span class="sub">' + l.p.clave + '</span></td><td>' + l.p.ubicacion + '</td>' +
          '<td><span class="oculto-sistema">' + ic('ojo', 'icon-sm') + 'Oculta hasta cerrar</span></td>' +
          '<td class="der"><input class="input-conteo" inputmode="decimal" data-conteo="' + l.p.clave + '" placeholder="kg" value="' + (v !== undefined ? esc(v) : '') + '"></td></tr>';
      }).join('');
      acciones = '<button class="btn btn-primario" data-accion="cerrar-conteo">' + ic('ok') + 'Cerrar conteo</button>';
      aviso = '<div class="aviso info mt">' + ic('ojo') + '<div>Quien cuenta no ve lo que dice el sistema hasta cerrar el conteo, para no inducir el resultado. Si deja un renglón vacío, el prototipo usa un valor de ejemplo.</div></div>';
    } else {
      var hayDif = false;
      filas = lineas.map(function (l) {
        var contado = l.contado;
        var dif = l.dif;
        if (dif !== 0) hayDif = true;
        return '<tr' + (dif < 0 ? ' class="resaltada"' : '') + '><td><span class="prod">' + l.p.nombre + '</span><span class="sub">' + l.p.clave + '</span></td><td>' + l.p.ubicacion + '</td>' +
          '<td class="der">' + kg(l.p.kg) + '</td><td class="der"><b>' + kg(contado) + '</b></td>' +
          '<td class="der">' + (dif === 0 ? '<span class="badge ok">Cuadra</span>' : '<span class="badge ' + (dif < 0 ? 'bad' : 'warn') + '">' + kgSigno(dif) + ' · ' + dinero(Math.abs(dif * l.p.costo)) + '</span>') + '</td></tr>';
      }).join('');
      acciones = hayDif && !estado.conteoAjuste
        ? '<button class="btn btn-primario" data-accion="generar-ajuste">' + ic('escudo') + 'Generar ajuste</button>'
        : '';
      aviso = estado.conteoAjuste
        ? '<div class="aviso ok mt">' + ic('ok') + '<div>Se generó el ajuste AJ-0044 por las diferencias. Queda pendiente hasta que usted lo autorice en <a href="#/bitacora" style="text-decoration:underline">Bitácora y ajustes</a>.</div></div>'
        : '<div class="aviso warn mt">' + ic('candado') + '<div>El conteo ya está cerrado y no se puede modificar. Las diferencias se corrigen con un ajuste que pasa a su autorización.</div></div>';
    }

    var cabeza = estado.conteoCerrado
      ? '<tr><th>Producto</th><th>Ubicación</th><th class="der">Sistema</th><th class="der">Contado</th><th class="der">Diferencia</th></tr>'
      : '<tr><th>Producto</th><th>Ubicación</th><th>Existencia del sistema</th><th class="der">Contado</th></tr>';

    return '<div class="entrar">' +
      encabezado('Conteo cíclico', 'Se cuenta un pedazo del almacén cada día. Sin cerrar la cortina y sin vaciar congeladores de madrugada.', '') +
      '<div class="rejilla rejilla-tablero">' +
        '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Hoja de conteo de hoy · Grupo A</h2><p>' + capital(fFechaLarga.format(DS.hoy)) + ' · ' + lineas.length + ' productos · cuenta Ana R.</p></div>' +
          (estado.conteoCerrado ? '<span class="badge ok">Cerrado</span>' : '<span class="badge warn">Abierto</span>') + '</div>' +
          '<div class="tabla-wrap"><table class="datos"><thead>' + cabeza + '</thead><tbody>' + filas + '</tbody></table></div>' +
          '<div class="tarjeta-cuerpo" style="display:flex;justify-content:flex-end;gap:8px;border-top:1px solid var(--line-2)">' + acciones + '</div>' +
        '</section>' +
        '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Grupos y frecuencia</h2><p>Lo que más vale se cuenta más seguido</p></div></div>' +
          '<div class="tarjeta-cuerpo"><div class="grupos">' +
            '<div class="grupo"><span class="grupo-letra">A</span><div><div class="t">Alto valor o alta rotación</div><div class="d">Cada semana · 38 productos</div></div><span class="badge marca">Hoy</span></div>' +
            '<div class="grupo b"><span class="grupo-letra">B</span><div><div class="t">Rotación media</div><div class="d">Cada 15 días · 96 productos</div></div><span class="badge">En 4 días</span></div>' +
            '<div class="grupo c"><span class="grupo-letra">C</span><div><div class="t">Baja rotación</div><div class="d">Cada mes · 170 productos</div></div><span class="badge">En 11 días</span></div>' +
          '</div>' +
          '<p class="tenue" style="font-size:13px;margin-top:14px">El inventario general queda como verificación una vez al año, no como el único momento en que se sabe qué hay.</p></div>' +
        '</section>' +
      '</div>' +
      aviso +
      PIE + '</div>';
  }

  /* ───────────── Cierre del día ───────────── */

  function vCierre() {
    var c = calcCierre();
    var cd = DS.cierre;

    var formas = cd.ventas.map(function (v) {
      return '<div class="forma"><span>' + v.forma + '</span><b>' + dinero(v.importe) + '</b><div class="barra"><i style="width:' + (v.importe / c.venta * 100).toFixed(1) + '%"></i></div></div>';
    }).join('');

    var pagos = cd.pagosProveedor.map(function (p) {
      var ok = !!p.nota;
      return '<tr' + (ok ? '' : ' class="resaltada"') + '><td class="prod">' + DS.proveedores[p.proveedor] + '</td><td class="der">' + dinero(p.importe) + '</td>' +
        '<td>' + (ok ? '<a href="#/entradas/' + p.nota + '" style="text-decoration:underline">Nota ' + p.nota + '</a>' : '<span class="tenue">Ninguna</span>') + '</td>' +
        '<td>' + (ok ? '<span class="badge ok">' + ic('ok', 'icon-sm') + 'Respaldado por la nota</span>' : '<span class="badge bad">' + ic('alerta', 'icon-sm') + 'Sin mercancía recibida</span>') + '</td></tr>';
    }).join('') +
      '<tr><td class="prod">' + DS.proveedores.dcn + '</td><td class="der tenue">—</td><td><a href="#/entradas/4471" style="text-decoration:underline">Nota 4471</a></td><td><span class="badge info">Recibida, a crédito · vence en 6 días</span></td></tr>';

    var sumaVenta = 0, sumaDif = 0;
    var conc = DS.concentrado.map(function (d) {
      sumaVenta += d.venta; sumaDif += d.dif;
      return '<tr><td>' + fechaCorta(d.fecha) + '</td><td class="der">' + dinero(d.venta) + '</td><td class="der">' +
        (d.dif === 0 ? '<span class="pos">Cuadró</span>' : '<span class="' + (d.dif < 0 ? 'neg' : '') + '">' + dineroSigno(d.dif) + '</span>') + '</td></tr>';
    }).join('');

    return '<div class="entrar">' +
      encabezado('Cierre del día', capital(fFechaLarga.format(cd.fecha)) + ' · Lo capturó ' + nombreUsuario(cd.capturo) + ' (' + perfilUsuario(cd.capturo) + ') a las ' + fHora.format(cd.fecha),
        '<span class="candado">' + ic('candado', 'icon-sm') + 'La venta del día solo la ven usted y oficina</span>' +
        '<button class="btn" data-toast="Un cierre confirmado no se edita: se corrige con un ajuste que deja constancia de quién y por qué.">' + ic('escudo') + 'Corregir</button>') +
      '<div class="rejilla rejilla-2">' +
        '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Venta por forma de pago</h2><p>Con la cuenta bancaria a la que entró cada transferencia</p></div></div>' +
          '<div class="tarjeta-cuerpo"><div class="formas-pago">' + formas + '</div>' +
          '<div class="arqueo-fila total" style="margin-top:14px"><span>Venta total del día</span><span>' + dinero(c.venta) + '</span></div></div></section>' +
        '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Arqueo de efectivo</h2><p>Lo que debería haber en caja contra lo que se contó</p></div></div>' +
          '<div class="tarjeta-cuerpo"><div class="arqueo">' +
            '<div class="arqueo-fila"><span>Fondo de caja</span><span>' + dinero(cd.fondo) + '</span></div>' +
            '<div class="arqueo-fila"><span>+ Venta en efectivo</span><span>' + dinero(c.efectivo) + '</span></div>' +
            '<div class="arqueo-fila"><span>− Gastos <span class="tenue">(' + cd.gastos.map(function (g) { return g.concepto.toLowerCase(); }).join(', ') + ')</span></span><span>' + dinero(c.gastos) + '</span></div>' +
            '<div class="arqueo-fila"><span>− Pagos a proveedor</span><span>' + dinero(c.pagos) + '</span></div>' +
            '<div class="arqueo-fila"><span>− Retiros <span class="tenue">(' + cd.retiros[0].concepto.toLowerCase() + ')</span></span><span>' + dinero(c.retiros) + '</span></div>' +
            '<div class="arqueo-fila total"><span>Debería haber</span><span>' + dinero(c.esperado) + '</span></div>' +
            '<div class="arqueo-fila"><span>Se contó</span><span>' + dinero(c.contado) + '</span></div>' +
            '<div class="arqueo-fila dif"><span>' + (c.dif < 0 ? 'Faltó en caja' : 'Diferencia') + '</span><span>' + dineroSigno(c.dif) + '</span></div>' +
          '</div></div></section>' +
      '</div>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Pagos a proveedor contra notas de entrada</h2><p>Cada pago debe corresponder a mercancía que sí entró</p></div></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Proveedor</th><th class="der">Pagado</th><th>Nota de entrada</th><th>Cruce</th></tr></thead><tbody>' + pagos + '</tbody></table></div>' +
      '</section>' +
      '<div class="aviso bad mt">' + ic('alerta') + '<div>Se pagaron <b>' + dinero(cd.pagosProveedor[1].importe) + '</b> a ' + DS.proveedores[cd.pagosProveedor[1].proveedor] + ' y no hay ninguna nota de entrada de ese proveedor en el mes. Aquí es donde se ve si se pagó mercancía que nunca entró.</div></div>' +
      '<section class="tarjeta mt"><div class="tarjeta-cab"><div><h2>Concentrado del mes</h2><p>Un renglón por día. Sustituye a la hoja de cálculo.</p></div>' +
        '<button class="btn btn-chico" data-toast="Se descargaría el concentrado del mes en Excel.">' + ic('descargar', 'icon-sm') + 'Exportar</button></div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Día</th><th class="der">Venta</th><th class="der">Diferencia de efectivo</th></tr></thead><tbody>' + conc + '</tbody>' +
        '<tfoot><tr><td>Últimos ' + DS.concentrado.length + ' días</td><td class="der">' + dinero(sumaVenta) + '</td><td class="der neg">' + dineroSigno(sumaDif) + '</td></tr></tfoot></table></div>' +
      '</section>' +
      PIE + '</div>';
  }

  /* ───────────── Bitácora y ajustes ───────────── */

  var TIPOS_BIT = ['Todos', 'Entrada', 'Despiece', 'Precio', 'Catálogo', 'Cierre', 'Ajuste', 'Acceso'];

  function filasBitacora() {
    return DS.bitacora.filter(function (b) { return estado.filtroBit === 'Todos' || b.tipo === estado.filtroBit; }).map(function (b) {
      var tono = b.rechazado ? 'bad' : b.tipo === 'Precio' ? 'warn' : b.tipo === 'Ajuste' ? 'info' : '';
      return '<tr' + (b.rechazado ? ' class="resaltada"' : '') + '><td>' + cuando(b.fecha) + '</td>' +
        '<td><span class="prod">' + nombreUsuario(b.usuario) + '</span><span class="sub">' + perfilUsuario(b.usuario) + '</span></td>' +
        '<td><span class="badge ' + tono + '">' + (b.rechazado ? 'Rechazado' : b.tipo) + '</span></td>' +
        '<td>' + b.evento + '</td>' +
        '<td>' + (b.antes ? '<span class="tenue">' + b.antes + '</span> → ' : '') + '<b>' + b.despues + '</b></td></tr>';
    }).join('') || '<tr><td colspan="5" class="centro tenue" style="padding:28px">Sin registros de ese tipo.</td></tr>';
  }

  function vBitacora() {
    var ajustes = listaAjustes().map(function (a) {
      var monto = a.monto;
      var res = estado.ajustes[a.folio];
      var acciones = res
        ? '<span class="badge ' + (res === 'autorizado' ? 'ok' : 'bad') + '">' + (res === 'autorizado' ? ic('ok', 'icon-sm') + 'Autorizado por Mario' : ic('cerrar', 'icon-sm') + 'Rechazado por Mario') + '</span>'
        : '<button class="btn btn-chico" data-accion="rechazar" data-folio="' + a.folio + '">Rechazar</button><button class="btn btn-chico btn-ok" data-accion="autorizar" data-folio="' + a.folio + '">Autorizar</button>';
      return '<div class="ajuste"><div class="ajuste-info"><div class="t">' + a.folio + ' · ' + a.titulo + '</div>' +
        '<div class="d">' + a.motivo + ' · Solicitó ' + nombreUsuario(a.solicito) + ' (' + perfilUsuario(a.solicito) + '), ' + cuando(a.fecha).toLowerCase() + '</div>' +
        '<div class="d tenue">“' + a.comentario + '”</div></div>' +
        '<div class="ajuste-monto neg">' + dinero2(monto) + '</div><div class="acciones">' + acciones + '</div></div>';
    }).join('');

    var chips = TIPOS_BIT.map(function (t) {
      return '<button class="chip' + (estado.filtroBit === t ? ' activo' : '') + '" data-bit="' + t + '">' + t + '</button>';
    }).join('');

    return '<div class="entrar">' +
      encabezado('Bitácora y ajustes', 'Quién hizo qué y cuándo. Nadie puede editar ni borrar estos registros, tampoco el dueño.', '') +
      '<section class="tarjeta"><div class="tarjeta-cab"><div><h2>Ajustes que esperan su autorización</h2><p>Los ajustes de más de ' + dinero(DS.umbralAutorizacion) + ' no tocan la existencia hasta que usted los autoriza</p></div>' +
        (ajustesPendientes() ? '<span class="badge warn">' + ajustesPendientes() + ' pendientes</span>' : '<span class="badge ok">Al corriente</span>') + '</div>' +
        ajustes + '</section>' +
      '<section class="tarjeta mt"><div class="filtros" id="filtros-bit">' + chips + '</div>' +
        '<div class="tabla-wrap"><table class="datos"><thead><tr><th>Cuándo</th><th>Usuario</th><th>Tipo</th><th>Qué pasó</th><th>Antes → después</th></tr></thead><tbody id="tbody-bit">' + filasBitacora() + '</tbody></table></div>' +
      '</section>' +
      '<div class="aviso info mt">' + ic('escudo') + '<div>Cada perfil hace solo lo suyo: <b>oficina</b> da de alta productos y mueve precios; <b>control interno</b> recibe mercancía y cuenta; el <b>área de proceso</b> registra despieces; <b>mostrador</b> no ve la venta del día ni puede cambiar precios. Si alguien lo intenta, el sistema lo rechaza y queda aquí.</div></div>' +
      PIE + '</div>';
  }

  /* ───────────── Enrutador ───────────── */

  var VISTAS = {
    tablero: { titulo: 'Tablero', render: vTablero },
    entradas: { titulo: 'Entradas de proveedor', render: vEntradas },
    existencias: { titulo: 'Existencias', render: vExistencias, despues: despuesExistencias },
    despiece: { titulo: 'Despiece y merma', render: vDespiece },
    conteo: { titulo: 'Conteo cíclico', render: vConteo },
    cierre: { titulo: 'Cierre del día', render: vCierre },
    bitacora: { titulo: 'Bitácora y ajustes', render: vBitacora }
  };

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var partes = h.split('?');
    var ruta = partes[0].split('/').filter(Boolean);
    return {
      section: VISTAS[ruta[0]] ? ruta[0] : 'tablero',
      id: ruta[1] ? decodeURIComponent(ruta[1]) : null,
      params: new URLSearchParams(partes[1] || '')
    };
  }

  var ultimaRuta = '';

  function render() {
    if (!sesionActiva()) {
      ultimaRuta = '';
      renderLogin();
      return;
    }
    if (!document.getElementById('app')) renderShell();
    var r = parseHash();
    var vista = VISTAS[r.section];
    cerrarPanel();
    cerrarNav();
    document.getElementById('contenido').innerHTML = vista.render(r);
    refrescarNav(r.section);
    document.title = vista.titulo + ' · Don Salvador';
    if (vista.despues) vista.despues(r);
    var ruta = r.section + '/' + (r.id || '');
    if (ruta !== ultimaRuta) window.scrollTo(0, 0);
    ultimaRuta = ruta;
  }

  /* ───────────── Eventos ───────────── */

  document.addEventListener('click', function (ev) {
    var el;

    if ((el = ev.target.closest('[data-toast]'))) {
      ev.preventDefault();
      toast(el.getAttribute('data-toast'));
      return;
    }

    if ((el = ev.target.closest('[data-accion]'))) {
      var accion = el.getAttribute('data-accion');
      if (accion === 'salir') {
        cerrarSesion();
        history.replaceState(null, '', location.pathname + location.search);
        render();
      } else if (accion === 'abrir-nav') {
        abrirNav();
      } else if (accion === 'cerrar-nav') {
        cerrarNav();
      } else if (accion === 'cerrar-panel') {
        cerrarPanel();
      } else if (accion === 'autorizar' || accion === 'rechazar') {
        var folio = el.getAttribute('data-folio');
        estado.ajustes[folio] = accion === 'autorizar' ? 'autorizado' : 'rechazado';
        toast(accion === 'autorizar' ? 'Ajuste ' + folio + ' autorizado. La existencia se corrige y queda en la bitácora.' : 'Ajuste ' + folio + ' rechazado. La existencia no cambia.');
        render();
      } else if (accion === 'cerrar-conteo') {
        document.querySelectorAll('[data-conteo]').forEach(function (i) { estado.conteoValores[i.getAttribute('data-conteo')] = i.value; });
        estado.conteoCerrado = true;
        render();
      } else if (accion === 'generar-ajuste') {
        estado.conteoAjuste = true;
        toast('Ajuste AJ-0044 generado. Espera su autorización.');
        render();
      }
      return;
    }

    if ((el = ev.target.closest('[data-cat]'))) {
      estado.filtroEx.cat = el.getAttribute('data-cat');
      refrescarExistencias();
      return;
    }

    if ((el = ev.target.closest('[data-bajo]'))) {
      estado.filtroEx.bajo = !estado.filtroEx.bajo;
      refrescarExistencias();
      return;
    }

    if ((el = ev.target.closest('[data-bit]'))) {
      estado.filtroBit = el.getAttribute('data-bit');
      document.querySelectorAll('[data-bit]').forEach(function (b) { b.classList.toggle('activo', b.getAttribute('data-bit') === estado.filtroBit); });
      document.getElementById('tbody-bit').innerHTML = filasBitacora();
      return;
    }

    if ((el = ev.target.closest('[data-producto]'))) {
      if (ev.target.closest('a')) return;
      abrirKardex(el.getAttribute('data-producto'));
      return;
    }

    if ((el = ev.target.closest('[data-ir]'))) {
      if (ev.target.closest('a')) return;
      location.hash = el.getAttribute('data-ir');
    }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { cerrarPanel(); cerrarNav(); }
  });

  window.addEventListener('hashchange', render);
  render();
})();

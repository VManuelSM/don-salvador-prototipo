# Don Salvador — prototipo visual

Prototipo navegable de la **Fase 1** del sistema de control de inventario y merma para Don Salvador, carnicería de mayoreo y menudeo. Lo preparó Code Vector para mostrar cómo se vería la solución antes de construirla.

**No es funcional.** No hay servidor ni base de datos, y ninguna acción guarda información. Las cifras, los proveedores y los nombres de las personas son **ilustrativos**: ninguno viene de la operación real del negocio.

## Cómo se usa

1. Abrir la página publicada (GitHub Pages) o `index.html` directamente en el navegador.
2. Dar clic en **Iniciar sesión**. Los campos ya vienen llenos.
3. El tablero del dueño muestra lo que requiere atención; cada aviso lleva a su detalle.

## Qué muestra

| Pantalla | Qué responde |
| :-- | :-- |
| Tablero | Qué tengo, qué se desvió y cómo cerró el día, en una sola pantalla |
| Entradas de proveedor | Kilos facturados contra kilos recibidos por nota y por proveedor (la nota 4471: 842 kg contra 837 kg) |
| Existencias | Doble unidad de medida (caja o pieza contra kilo), mínimos y máximos, caducidades e historial por producto |
| Despiece y merma | Rendimiento esperado contra obtenido por corte, turno y responsable |
| Conteo cíclico | Conteo por grupos sin mostrar la existencia del sistema hasta cerrar |
| Cierre del día | Venta por forma de pago, arqueo de efectivo y cruce de pagos a proveedor contra notas de entrada |
| Bitácora y ajustes | Ajustes que esperan autorización del dueño y registro inalterable de cambios |

## Técnica

HTML, CSS y JavaScript sin dependencias ni paso de compilación. Las rutas viven en el hash (`#/tablero`, `#/entradas/4471`…) y las fechas se calculan contra el día en que se abre, para que el tablero siempre se vea vigente.

```bash
python3 -m http.server 8765   # y abrir http://127.0.0.1:8765
```

---

Code Vector · Víctor Manuel Santos Martínez

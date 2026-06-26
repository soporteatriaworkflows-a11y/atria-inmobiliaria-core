# Product Language & Visuals — Lenguaje de producto y apoyo visual

Fecha: 2026-06-26
Rol: Senior Product Designer + UI Copywriter
Rama: `feature/uix-product-language-visuals` (derivada de `feature/atria-brand-recolor`)
Alcance: copy visible + enriquecimiento visual. Se conserva la identidad dark
tech ATRIA (violeta/lavanda). No se cambian rutas técnicas ni datos.

## Objetivo

Que ATRIA Inmobiliaria se sienta como un producto digital premium y vendible,
no como una base de datos: lenguaje profesional + indicadores visuales (KPIs,
barras, donut, timeline, estados) sin perder el recolor de marca.

## Mapa de términos (antes → después)

| Antes | Después | Justificación | Dónde se aplicó |
| --- | --- | --- | --- |
| Inicio | Dashboard | Lenguaje de producto, no de sitio web | Sidebar, título home |
| Herederos / Participantes | Propietarios | Más profesional y menos legal | Sidebar, título y copy de `/herederos`, accesos |
| Recaudos | Ingresos | Término financiero claro | Sidebar, título `/recaudos`, dashboards, KPIs |
| Liquidación | Cierre mensual | Describe el proceso, no el tecnicismo | Sidebar, título `/liquidacion`, dashboards |
| Auditoría | Historial | Cercano para el usuario final | Sidebar, título `/auditoria`, accesos |
| Solicitudes | Solicitudes de ajuste | Precisa la intención | Sidebar, título `/solicitudes` |
| Modo live | Producción activa | Menos técnico | Header (StatusPill) |
| Supabase conectado | Sistema conectado | No expone el proveedor | Estado del sistema |
| Datos sanitizados / demo | Datos de prueba | Lenguaje humano | Header, copy general |
| Append-only | Solo se agrega | Comprensible | Historial |
| RLS / DB / schema / CRUD | (no aparecen) | No deben verse en UI final | Todo el UI |

Nota: las rutas técnicas (`/herederos`, `/recaudos`, `/liquidacion`,
`/auditoria`) NO se cambiaron para no romper navegación. Solo cambió el texto
visible (navegación, títulos, headers, cards, accesos).

## Decisiones de lenguaje

- Hablar de "propietarios" y "participación", no de "herederos" ni "participantes".
- Nombrar el dinero como "ingresos", "gastos", "saldo a distribuir".
- El cierre es un proceso con estado ("en proceso", "borrador", "en revisión").
- Evitar jerga de sistema en el UI; reservarla para documentación/código.
- Acciones en imperativo claro: "Revisar distribución", "Preparar cierre",
  "Ver resumen", "Pedir una revisión".

## Recursos visuales agregados

Nuevo componente `src/components/viz.tsx` (SVG/CSS puro, sin dependencias):

- `ProgressBar`: barra de progreso (avance del cierre, participación, distribución).
- `LabeledBar`: barra con etiqueta y monto (ingresos vs gastos).
- `Donut`: indicador circular (saldo estimado, participación del propietario).
- `TimelineItem`: ítem de línea de tiempo (actividad reciente).

Aplicación por ruta:

- `/` (Dashboard): KPIs (ingresos, gastos, propiedades, solicitudes), panel
  "Cierre mensual en curso" con progreso y barras ingresos/gastos + CTA, donut
  de "Saldo estimado", accesos rápidos y timeline de actividad reciente.
- `/liquidacion` (Cierre mensual): KPIs (ingresos, gastos, saldo, estado),
  distribución por propietario con barras y monto, CTA "Revisar distribución" /
  "Preparar cierre".
- `/recaudos` (Ingresos): KPIs (total cobrado, propiedades al día, pendientes) y
  estado de pago por propiedad con badges.
- `/gastos` (Gastos): KPIs (total, por propiedad, globales), tabla por categoría
  con estado de revisión ("Por revisar", "Registrado").
- `/herederos` (Propietarios): cards con avatar, participación (%) y barra,
  estado "Activo", valor del periodo, última actualización y "Ver resumen".
- `/propiedades`: KPIs y cards con ingreso del periodo por propiedad.
- `/auditoria` (Historial): timeline con responsable, acción, tipo y estado.
- `/dashboard/propietario`: donut "Mi participación" + métricas.
- `/dashboard/admin` y `/dashboard/contador`: KPIs con estados y pasos.

## Componentes modificados

- `src/lib/navigation.ts`: nombres visibles de navegación (sin tocar rutas).
- `src/components/viz.tsx`: NUEVO (primitivas visuales).
- Páginas: `/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
  `/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`,
  `/gastos`, `/liquidacion`, `/solicitudes`, `/auditoria`.

(Los componentes base `ui.tsx`, `app-shell.tsx`, `sidebar-nav.tsx` no se
modificaron en esta fase; ya tenían la identidad dark tech del recolor.)

## Rutas revisadas

`/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
`/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`,
`/liquidacion`, `/solicitudes`, `/auditoria`.

## Estilo mantenido

Dark tech ATRIA (carbon/grafito/indigo), violeta/lavanda como acento, verde solo
para success discreto, cards compactas, fondos premium, tipografía contenida,
layout moderno. No SaaS blanco, no inmobiliaria verde, no ICONIC OPS.

## Verificaciones

| Verificación | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas) |
| Smoke local Playwright (desktop+móvil) | PASS (24 vistas) |

Smoke: HTTP 200 en las 12 rutas, 0 overflow horizontal, navegación visible,
estado activo presente, 0 errores de consola, en desktop (1280px) y móvil
(375px). Sin datos reales ni secretos. Capturas en
`artifacts/uix-product-language-visuals/` (ignorado por Git).

## Qué NO se tocó

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`,
`src/lib/supabase/`, Auth real, Vercel, `.env*`, `.vercel`, tokens/claves, datos
reales, OCR, n8n, estructura de base de datos, rutas técnicas. Sin force-push,
sin borrado de ramas, sin merge a `main`, sin deploy.

## Riesgos pendientes

- Los datos de KPIs/timeline/estados son de ejemplo (demo). Al conectar datos
  reales habrá que alimentarlos desde el backend (fuera de alcance).
- "Propietarios" es el nombre visible; la ruta sigue siendo `/herederos`.
  Renombrar la ruta queda para una fase posterior con redirecciones seguras.
- Identidad de marca aún provisional (faltan logo/favicon oficiales).
- Conviene una pasada formal de accesibilidad AA sobre texto `mist` en oscuro.

## Recomendación antes de merge

**Aprobar visualmente y pasar a QA Codex.** El lenguaje y el apoyo visual elevan
el producto sin perder la identidad ATRIA. Integrar primero hacia una rama de
revisión/integración (sobre `feature/atria-brand-recolor`), **no directo a
`main`** ni desplegar sin autorización.

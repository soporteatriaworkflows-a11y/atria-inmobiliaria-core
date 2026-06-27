# Palette & Status Visual Refine — Identidad coherente

Fecha: 2026-06-26
Rol: Senior UIX / Visual Identity Refine
Rama: `feature/palette-status-visual-refine` (derivada de `feature/light-dark-theme-toggle`)
Alcance: refinamiento de paleta, iconografía y sistema de estados. Se conserva la
estructura, el sistema dual claro/oscuro y el toggle funcional.

## Problema detectado

- La paleta se sentía mezclada: verde y ámbar competían con la identidad ATRIA.
- Cada KPI tenía un icono de color distinto (rainbow): "Ingresos" verde,
  "Gastos" ámbar, "Propiedades" violeta, etc.
- Las etiquetas de estado ("Modo demostración", "Datos de prueba") se veían como
  chips genéricos tipo "badge AI", poco integrados con el header.
- Resultado: menos premium y menos coherente de lo deseado.

## Nueva lógica de paleta

- **Identidad (protagonista):** violeta ATRIA (#7C3AED) + lavanda (acento) +
  neutros (blanco / gris claro / grafito / carbón).
- **Semánticos (solo cuando hace falta):** success = verde discreto,
  warning = ámbar discreto, danger = rose discreto. NUNCA como identidad de
  cards, iconos o barras.
- Regla aplicada: un mismo lenguaje de color para toda la métrica; nada de un
  color por KPI ni iconos multicolor.

## Qué quedó como identidad

- Iconos de métrica: **violeta monocromo** (violeta/lavanda sobre fondo
  `violet/12`), idéntico para todas las cards (`iconAccent` en `ui.tsx`).
- Barras y donuts: violeta como principal, lavanda como secundario. Las barras
  de "Ingresos vs Gastos" pasaron de verde/ámbar a violeta/lavanda.
- Sidebar, activos, acentos de panel, foco: violeta/lavanda.
- Logo, headers de módulo, accesos rápidos: violeta.

## Qué quedó solo como semántico

- `success` (verde), `warning` (ámbar), `danger` (rose) viven exclusivamente en
  badges/pills de estado real: "Listo", "Revisar", "Por conciliar", "Pendiente",
  "Activo", "Pagado", "Registrado", "Borrador", "Aprobada", etc.
- En la línea de tiempo del historial los puntos usan color por tipo de evento
  (semántico), de forma sutil.
- Estos chips se rediseñaron sobrios (ver abajo), no como identidad.

## Cómo cambió la iconografía

- Antes: el color del icono dependía del `tone` de la card (rainbow).
- Ahora: el icono de toda `MetricCard` usa un único acento violeta
  (`bg-atria-violet/12 text-atria-lavender ring-atria-violet/20`),
  independiente del estado. El `tone` solo afecta a un badge opcional cuando lo
  hay. Resultado: sistema de métricas unificado y monocromo.

## Cómo cambió el sistema de estados/etiquetas

- `StatusPill` y `Badge` se hicieron sobrios: se quitó el `uppercase`/tracking
  ruidoso, peso `font-medium`, `neutral` pasó a chip outline transparente. Menos
  "badge AI", más producto.
- El bloque de estado del header dejó de ser varios pills sueltos y ahora es un
  **chip de estado integrado**: un contenedor outline con un punto violeta (con
  pulso si está en producción) + el modo + separador + "Datos de prueba".
- Lenguaje más producto: "Modo demostración" -> "Vista de demostración";
  se mantiene "Producción activa" y "Datos de prueba" de forma integrada.

## Modo claro (más limpio y premium)

- Fondo más blanco (#FDFCFF/#FBFAFF) con glow violeta muy sutil en esquinas;
  menos sensación "lila lavada".
- Sidebar casi blanca (#FBFAFF), bordes fríos suaves (#E8E3F4), superficies
  elevadas más neutras (#F6F3FC). Mejor balance blanco/violeta, legible y
  elegante.

## Modo oscuro (más sobrio)

- Se redujo la saturación del glow índigo del fondo; estética dark premium
  conservada, violeta/lavanda como identidad fuerte, menos elementos coloridos.

## Lenguaje de producto (mantenido)

Propietarios, Ingresos, Cierre mensual, Solicitudes de ajuste, Historial. Sin
jerga técnica interna en la UI.

## Componentes modificados

- `src/components/ui.tsx`: iconos de métrica monocromos (`iconAccent`),
  `StatusPill`/`Badge` sobrios, `toneClasses` afinados.
- `src/components/app-shell.tsx`: bloque de estado integrado en el header.
- `src/app/globals.css`: modo claro más blanco, modo oscuro más sobrio.
- `src/app/page.tsx`: barras de ingresos/gastos a violeta/lavanda.

## Rutas verificadas (claro y oscuro)

`/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
`/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`,
`/liquidacion`, `/solicitudes`, `/auditoria`.

## Validaciones

| Verificación                              | Resultado        |
| ----------------------------------------- | ---------------- |
| `pnpm format`                             | PASS (global)    |
| `pnpm lint`                               | PASS             |
| `pnpm typecheck`                          | PASS             |
| `pnpm test`                               | PASS (6/6)       |
| `pnpm build`                              | PASS (12 rutas)  |
| Smoke local (claro+oscuro, desktop+móvil) | PASS (48 vistas) |
| Toggle + persistencia                     | PASS             |

Smoke: HTTP 200, 0 overflow, navegación visible, estado activo, 0 errores de
consola, tema correcto por contexto, sin pérdida del toggle. Sin datos reales ni
secretos. Capturas en `artifacts/palette-refine/` (ignorado por Git).

## Qué NO se tocó

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`,
`src/lib/supabase/`, Auth, Vercel, `.env*`, `.vercel`, tokens/claves, datos
reales, OCR, n8n, estructura de base de datos. Sin force-push, sin borrado de
ramas, sin merge a `main`, sin deploy.

## Riesgos pendientes

- Los badges de estado conservan color semántico (success/warning/danger); es
  intencional, pero conviene una revisión de consistencia de etiquetas con
  cliente (qué estados existen realmente).
- Verificación AA puntual del texto `mist` sobre superficies claras `elevated`.
- Falta logo/favicon oficiales.

## Recomendación

**Pasar a QA Codex.** El refinamiento entrega una identidad más coherente y
premium (violeta/lavanda protagonista, semánticos contenidos, iconos
unificados, estados sobrios) sin perder estructura, temas ni toggle. Integrar
primero hacia una rama de revisión/integración, no directo a `main` ni desplegar
sin autorización.

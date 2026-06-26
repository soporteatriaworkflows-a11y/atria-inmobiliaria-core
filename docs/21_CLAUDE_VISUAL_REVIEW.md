# Claude Visual Review — Segunda capa UIX

Fecha: 2026-06-25
Rama: `feature/uix-visual-polish-claude` (derivada de `feature/uix-visual-polish`)
Base estable: `main` con tag `production-live-baseline-v1`
Rol: Claude Visual Review / UIX Designer
Alcance: exclusivamente frontend/UI. Sin backend, Supabase, RLS, migraciones, Auth real, calculos, Vercel ni datos reales.

## Resumen

La rama `feature/uix-visual-polish` (trabajada por Codex) ya tenia una base
solida: paleta ATRIA calida, tipografia grande (18px), botones amplios, sidebar
persistente y copy mas humano. Esta segunda capa NO rehace ese trabajo; agrega
mejoras puntuales de alto impacto en orientacion, calidez de marca y reduccion de
lenguaje tecnico, manteniendo estructura, navegacion, build y seguridad.

Principio aplicado: lo que ya estaba bien no se cambio por cambiar.

## Evaluacion visual por criterio

| Criterio | Estado previo | Accion |
| --- | --- | --- |
| Jerarquia visual | Buena, titulos algo planos | Tipografia serif de marca en titulos + icono de modulo |
| Legibilidad | Buena (18px base) | Sin cambios de tamano; se conserva |
| Espaciado | Adecuado | Ajustes menores en sidebar y header |
| Contraste | Suficiente | Conservado; acentos de color por tono |
| Personas mayores | Controles grandes | + Estado activo de navegacion e iconos de reconocimiento |
| Consistencia de botones | Consistente | Conservada |
| Consistencia de cards | Consistente | MetricCard mas limpia y menos tecnica |
| Estados vacios | Correctos | EmptyState con glifo suave |
| Textos de ayuda | Algo tecnicos | Microcopy humanizado (ver abajo) |
| Navegacion | Lista plana de 12 enlaces | Agrupada (Paneles/Operacion/Control) con estado activo e iconos |
| Sensacion de marca | Sobria, sin identidad fuerte | Wordmark + serif de marca + iconografia propia |

## Mejoras aplicadas

### 1. Orientacion (clave para personas mayores)
- Navegacion del sidebar ahora marca la ruta activa con `aria-current="page"`,
  color de marca y sombra. El usuario siempre sabe donde esta.
- Navegacion reorganizada en grupos con sentido: **Paneles**, **Operacion**,
  **Control**. Reduce la carga de escanear 12 enlaces planos.

### 2. Calidez de marca (menos SaaS generico, mas humano)
- Tipografia serif **Fraunces** (`next/font`, con fallback serif del sistema)
  aplicada solo a wordmark y titulos. Aporta tono familiar/inmobiliario sin
  perder profesionalismo.
- Set de iconos inline propio (`src/components/icons.tsx`), trazo suave y
  redondeado, sin dependencias externas. Cada modulo tiene su glifo en el
  sidebar y en el header.
- Wordmark ATRIA Inmobiliaria mas presente en el sidebar.

### 3. Menos lenguaje tecnico (textos para no expertos)
- "Append-only" -> "Solo se agrega" / "Queda en el historial".
- "Sin borrado fisico" -> "No se borra".
- "Publicado demo" -> "Registrado".
- "Datos sanitizados" / "Demo seguro" -> "Datos de ejemplo" / "Modo demostracion".
- "Montos en COP enteros" -> "Montos en pesos colombianos".
- MetricCard ya no muestra el pill automatico "OK"/"Demo" (ruido tecnico); ahora
  usa un acento de color sobrio por tono y un badge opcional con texto humano
  ("Por revisar", "Al dia", "Estimado", "Protegido").

### 4. Componentes reutilizables (mantenidos o mejorados)
- `Badge`, `StatusPill`, `SectionPanel`: conservados.
- `ModuleHeader`: soporta icono opcional + titulo en serif de marca.
- `MetricCard`: acento de color por tono, badge de texto opcional, sin pill tecnico.
- `EmptyState`: glifo suave centrado para sentirse menos vacio.
- `QuickAction`: afordancia de flecha que reacciona al hover.
- `ActionList`: el circulo "OK" (confuso en listas de pendientes) se reemplazo por
  un check calido; nueva variante `step` con numeros para secuencias guiadas.

### 5. Login
- Icono de candado, campo de contrasena deshabilitado (no simula Auth real) y
  panel de confianza con checklist humano. Mas completo y tranquilizador sin
  habilitar sesiones productivas.

## Archivos modificados

Nuevos:
- `src/components/icons.tsx`
- `src/components/sidebar-nav.tsx` (client component, estado activo)
- `docs/21_CLAUDE_VISUAL_REVIEW.md`

Modificados:
- `src/app/layout.tsx` (fuente serif de marca)
- `src/app/globals.css` (utilidad `.font-display`)
- `src/lib/navigation.ts` (grupos + iconos, conserva `mainNavigation`)
- `src/components/app-shell.tsx` (sidebar agrupado, icono de modulo, footer)
- `src/components/ui.tsx` (MetricCard, ModuleHeader, EmptyState, QuickAction)
- `src/components/action-list.tsx` (check + variante step)
- `src/app/page.tsx`, `login`, `dashboard/admin`, `dashboard/contador`,
  `dashboard/propietario`, `propiedades`, `herederos`, `recaudos`, `gastos`,
  `liquidacion`, `solicitudes`, `auditoria` (iconos + microcopy).

## Que NO se toco

- Supabase, migraciones, RLS, `supabase/tests`.
- Logica financiera y calculos (`src/lib/finance/*`, `src/lib/money.ts`).
- Auth real, RBAC (`src/lib/security/*`).
- `.env`, `.env.local`, `.vercel`, tokens, claves.
- Configuracion de Vercel y deploy de produccion.
- Datos reales, OCR, n8n.
- `main` (no merge, no force-push, no borrado de ramas).

## Verificaciones

| Verificacion | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas, fuente descargada) |
| Smoke runtime (HTTP) | PASS (200 en las 12 rutas) |
| Estado activo de nav | Verificado (`aria-current="page"` en HTML) |

## Riesgos pendientes

- Identidad visual sigue provisional: faltan logo y favicon oficiales y manual de
  marca. La serif Fraunces es una eleccion de diseno, no marca corporativa validada.
- Falta validacion con usuarios mayores reales (test de usabilidad presencial).
- Auth real, CRUD por rol, adjuntos seguros y auditoria poblada siguen fuera de fase.
- `SummaryCard` quedo como componente sin uso (no se importa); candidato a limpieza
  o reutilizacion futura.

## Recomendacion

**Aprobar y mergear a `feature/uix-visual-polish`** esta segunda capa, y mantener
el conjunto en preview. NO mergear a `main` todavia: antes conviene validar marca
(logo/favicon/paleta) y hacer una prueba de usabilidad con personas mayores. La
fase de Auth real y CRUD por rol debe ir en una rama separada.

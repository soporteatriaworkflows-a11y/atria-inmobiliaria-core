# UIX Modern Refine — Tercera iteracion visual

Fecha: 2026-06-25
Rol: Senior UIX / Product Designer
Rama: `feature/uix-modern-refine` (derivada del estado UIX actual en `main`)
Base de respaldo: tags `production-live-baseline-v1`, `uix-visual-polish-v1`
Alcance: exclusivamente UI/UX visual. Sin backend, Supabase, RLS, Auth real,
calculos, Vercel, variables ni datos reales.

## Concepto visual aplicado

Pasar de una interfaz correcta pero sobredimensionada (sensacion "zoom 125%",
estetica orientada a accesibilidad maxima) a un **dashboard de producto moderno,
compacto y premium**, manteniendo claridad para usuarios no tecnicos.

Direccion: panel operativo sofisticado, densidad util sin apretar, jerarquia
clara, superficies bien definidas, profundidad sutil y acentos puntuales. La
accesibilidad se sostiene por contraste, estructura y foco visible, no por
agrandar todo.

## Que se cambio

### Sistema global
- Escala tipografica controlada: base 15px (antes 18px), titulos de modulo
  20-24px, hero <= ~24px, labels 11-13px, secundario 12-14px.
- Fondo neutro sofisticado (no blanco puro): degradado `haze`/`surface` con
  profundidad muy sutil, en vez del fondo claro anterior.
- Sombras finas en capas (`soft`/`card`/`panel`/`sidebar`) en vez de sombras
  grandes; sin exageraciones.
- Foco visible mas fino (outline 2px) manteniendo accesibilidad.

### Layout / App shell
- Sidebar **semi-dark elegante**: degradado `night -> slate -> night` (derivado
  de ink/forest), mas estrecha (15.5rem), scrollbar discreto, marca compacta.
- Estado activo de navegacion refinado: barra de acento mint + fondo sutil +
  icono mint, en vez de bloque mint grande.
- Topbar tipo producto: icono de modulo + titulo + descripcion a la izquierda,
  pills de estado a la derecha, con leve `backdrop-blur`.
- Footer compacto.

### Dashboards y modulos
- Home recompuesto: barra de estado fina, 3 metricas con icono, panel de accesos
  rapidos (2 col) y panel "Proximo paso" con degradado mint sutil.
- Admin como centro de control: metricas con estado + checklist de pasos + accesos.
- Contador operativo: 4 metricas con estados (Listo / Revisar / Por conciliar /
  Pendiente), pasos y accesos.
- Propietario: solo lectura, simple, con panel de tranquilidad y accesos claros.
- Propiedades y participantes: cards compactas con icono/avatar e iniciales.
- Recaudos y gastos: tablas/listados compactos con cabecera, en vez de cards
  infladas.
- Liquidacion: tabla compacta con cabecera de columnas y totales con icono.
- Solicitudes: lista con estado por solicitud (En revision / Recibida / Aprobada).
- Auditoria: linea de tiempo compacta con puntos, en vez de tarjetas grandes.

### Componentes refinados
- `Badge`, `StatusPill`: mas pequenos, con punto de color (StatusPill), uppercase fino.
- `SectionPanel`: radio `xl`, padding reducido, borde/sombra refinados.
- `ModuleHeader`: compacto, icono 10px, titulo controlado.
- `MetricCard`: compacta, con icono opcional tintado por tono, valor 24px,
  label uppercase, badge opcional pequeno. (Se mantiene la API previa.)
- `EmptyState`: compacto con glifo pequeno.
- `QuickAction`: compacto, con icono opcional y flecha sutil.
- `ActionList`: filas finas, marca check/numero pequena.
- `SidebarNav`: items compactos, agrupados, estado activo elegante.
- `SupabaseLiveStatus`: barra fina con punto de estado (incluye pulso cuando
  esta conectado) y copy menos tecnico. **Solo se cambio la presentacion; la
  logica de conexion y la consulta no se modificaron.**

## Que se compacto

Tamanos de fuente, alturas de control (botones ~36-44px), paddings de paneles y
cards, gaps entre secciones (de 5/8 a 3/4), radios (de 2xl/3xl a xl/lg), iconos
y sombras. La densidad util subio sin volverse apretada.

## Que se mantuvo

- Estructura de rutas y navegacion (12 rutas, mismos destinos).
- Estado activo de navegacion y agrupacion por intencion.
- Iconografia propia ATRIA y tipografia serif de marca (uso mas controlado).
- Logica de datos de ejemplo y de estado de conexion (sin tocar).
- Accesibilidad: contraste, foco visible y targets razonables.

## Rutas mejoradas

`/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
`/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`,
`/liquidacion`, `/solicitudes`, `/auditoria`.

## Decisiones de paleta

Se mantiene la paleta ATRIA: `ink`, `forest`, `leaf`, `mint`, `sand`, `cream`,
`pearl`, `line`, `muted`, `amber`, `rose`. **No** se usa navy/azul como identidad.

Extensiones visuales PROVISIONALES (derivadas de ink/forest, documentadas como
temporales hasta validar marca):

| Token | Valor | Uso |
| --- | --- | --- |
| `atria.night` | `#101b18` | base profunda de la sidebar |
| `atria.slate` | `#1b2c27` | capa intermedia de la sidebar |
| `atria.haze` | `#eef1ea` | fondo neutro general |
| `atria.surface` | `#f6f4ee` | superficie de paneles suaves |

## Decisiones de tipografia

- Inter para UI (base 15px, escala controlada).
- Fraunces (serif) reservada para wordmark de marca y acentos puntuales; se
  redujo su uso en titulos de modulo para un tono mas "producto" y menos
  editorial.

## Microcopy

Se redujeron tecnicismos: fuera "append-only", "sanitizado", "RLS", "COP enteros",
"demo" como etiqueta. Se usa lenguaje humano: "Datos de prueba", "Informacion
protegida", "Queda en el historial", "Solo se agrega", "Sistema conectado",
"Por conciliar", "Listo para revisar".

## Que NO se toco

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`, Auth real,
la logica de `src/lib/supabase/` (solo presentacion del componente de estado),
Vercel, `.env*`, `.vercel`, tokens/claves, datos reales, OCR, n8n. Sin
force-push, sin borrado de ramas, sin merge a `main`, sin deploy.

## Verificaciones

| Verificacion | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas) |
| Smoke local Playwright (desktop + movil) | PASS (24 vistas) |

Smoke: HTTP 200 en las 12 rutas, 0 overflow horizontal, navegacion visible (12
enlaces), estado activo presente, 0 errores de consola, en desktop (1280px) y
movil (375px). Capturas locales en `artifacts/uix-modern-refine-local/`
(carpeta ignorada por Git).

## Autoevaluacion de sensacion visual

- Producto moderno: si. Premium: si. Compacto (no "zoom"): si.
- Menos blanco: si (fondo neutro + sidebar oscura + paneles definidos).
- Generico: no (identidad ATRIA, sin navy). Se siente ATRIA: si.
- Claro para admin/contador/propietario: si.
- Presentable a cliente: si.

## Riesgos pendientes

- Identidad de marca aun provisional: faltan logo, favicon y paleta corporativa
  oficiales. Los tokens `night/slate/haze/surface` son derivados temporales.
- En movil la navegacion completa se apila arriba sin menu colapsable; funciona
  y no desborda, pero un menu plegable mejoraria la experiencia (fase futura).
- Falta validacion de usabilidad con usuarios reales.
- Auth real, RBAC, CRUD, adjuntos y datos reales siguen fuera de alcance.

## Recomendacion final

**Revisar visualmente y aprobar** esta iteracion en preview. El resultado es
notablemente mas moderno, compacto y presentable, manteniendo claridad e
identidad ATRIA. Sugerencia de integracion: primero hacia la rama visual o una
rama de integracion, **no directo a `main`** y sin desplegar, hasta confirmar la
direccion visual con el cliente e incorporar marca oficial (logo/favicon/paleta).

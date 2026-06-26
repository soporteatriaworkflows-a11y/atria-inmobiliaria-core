# ATRIA Brand Recolor — Identidad dark tech

Fecha: 2026-06-26
Rol: ATRIA Brand Recolor / Visual Identity Refine
Rama: `feature/atria-brand-recolor` (derivada de `main`)
Base: tag `uix-modern-refine-v1`
Alcance: exclusivamente recolor de identidad visual. Se conserva el layout
moderno y compacto; se cambia la paleta dominante a la marca ATRIA real.

## Concepto

La capa moderna habia quedado demasiado verde/forest/mint (estetica
inmobiliaria/ecologica), que no corresponde a ATRIA. Se mantiene toda la
estructura, escala y densidad ya lograda, pero la identidad pasa a **dark tech,
premium, tecnologica**: fondos oscuros sofisticados, acento violeta electrico y
glow lavanda. El verde queda solo para el estado de exito (discreto).

## Paleta aplicada (marca ATRIA)

| Token | Hex | Uso |
| --- | --- | --- |
| `atria.carbon` | `#0A0A0F` | fondo base de la app |
| `atria.graphite` | `#13131B` | superficies / cards / paneles |
| `atria.indigo` | `#1B1240` | capa profunda (sidebar, headers de modulo) |
| `atria.violet` | `#7C3AED` | acento primario (activo, botones, foco, iconos) |
| `atria.lavender` | `#B68CFF` | glow / highlights / acentos de texto e iconos |
| `atria.fog` | `#F2F2F7` | texto claro principal |

Derivados provisionales (para profundidad y jerarquia, documentados como
temporales hasta validar marca):

| Token | Hex | Uso |
| --- | --- | --- |
| `atria.elevated` | `#181826` | superficie elevada / inputs |
| `atria.mist` | `#9D9BB8` | texto secundario sobre oscuro |
| `atria.edge` | `#2A2740` | bordes sutiles indigo |

Estados (no identidad):

| Estado | Token/clase | Color |
| --- | --- | --- |
| success | `atria.emerald` `#34D39A` | verde discreto |
| warning | `atria.amber` `#F5B54A` | ambar |
| danger | `atria.rose` `#F0788F` | rojo/rosa |
| info / primary | `atria.violet` / `atria.lavender` | violeta/lavanda |
| neutral | grafito + `atria.mist` | gris-lavanda |

## Que verde se elimino como identidad

- Sidebar: dejo de ser verde (`night/slate`) y ahora es un degradado
  carbon -> indigo con acento violeta.
- Logo/wordmark: cuadro pasa de mint/forest a degradado violeta -> lavanda.
- Estado activo de navegacion: de mint a violeta (fondo + barra + icono).
- Iconos de metricas, accesos rapidos, headers de modulo, empty states y
  action-list: de mint/forest a violeta/lavanda.
- Botones principales (login): de `atria-forest` a `atria-violet`.
- Fondo general: de claro/haze a carbon oscuro con glows violeta/indigo.
- Gradientes de panel: de mint a violeta.
- Foco visible y seleccion de texto: de forest a violeta.

## Que verde quedo (solo success)

- `StatusPill` / `Badge` con `tone="success"`: verde esmeralda discreto
  (ej. "Produccion activa", "Registrado", "Activa", "Aprobada", "Listo",
  "Al dia", "Sistema conectado").
- Punto/indicador de exito en el estado del sistema.

No se usa verde para branding, botones primarios, navegacion ni acentos
generales.

## Rutas revisadas

`/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
`/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`,
`/liquidacion`, `/solicitudes`, `/auditoria`.

## Componentes modificados

- `tailwind.config.ts`: paleta de marca + derivados + sombras dark + glow violeta.
- `src/app/globals.css`: fondo carbon con glows, foco/seleccion violeta, scrollbar.
- `src/components/app-shell.tsx`: sidebar carbon->indigo, header grafito, acentos.
- `src/components/sidebar-nav.tsx`: estado activo violeta (fondo + ring + barra).
- `src/components/ui.tsx`: sistema de tonos dark, tono `primary` violeta, cards
  grafito con hover glow, iconos tintados violeta, success verde discreto.
- `src/components/action-list.tsx`: filas grafito, marca violeta.
- `src/components/supabase-live-status.tsx`: recolor dark (solo presentacion;
  la logica de conexion no se toco).
- Las 12 paginas: recolor de superficies, textos, bordes y acentos a la paleta
  ATRIA (carbon/grafito/violeta/lavanda/fog), conservando estructura y escala.

## Que se mantuvo

Layout moderno, escala compacta (base 15px), cards refinadas, sidebar elegante,
tablas/listas compactas, tipografia controlada, jerarquia visual, navegacion
agrupada con estado activo, iconografia propia y microcopy humano.

## Que NO se toco

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`,
`src/lib/supabase/` (logica), Auth real, Vercel, `.env*`, `.vercel`,
tokens/claves, datos reales, OCR, n8n. Sin force-push, sin borrado de ramas, sin
merge a `main`, sin deploy.

## Verificaciones

| Verificacion | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas) |
| Smoke local Playwright (desktop+movil) | PASS (24 vistas) |

Smoke: HTTP 200 en las 12 rutas, 0 overflow horizontal, navegacion visible,
estado activo presente, 0 errores de consola, en desktop (1280px) y movil
(375px). Nueva paleta ATRIA visible. Sin datos reales ni secretos.
Capturas en `artifacts/atria-brand-recolor-local/` (ignorado por Git).

## Autoevaluacion

Premium: si. Tecnologica: si. Moderna: si. ATRIA (dark tech violeta): si.
No ICONIC OPS (no navy): si. No inmobiliaria verde: si. No SaaS blanco: si.
No dashboard IA generico: si (identidad violeta propia).

## Riesgos pendientes

- Identidad aplicada segun paleta ATRIA indicada; los derivados
  `elevated/mist/edge` son provisionales hasta validar manual de marca.
- Falta logo/favicon oficiales (el wordmark usa la inicial "A").
- Contraste revisado en capturas; conviene una pasada formal de accesibilidad
  (AA) sobre textos `mist` en superficies oscuras.
- En movil la navegacion se apila arriba sin menu colapsable (mejora futura).
- Auth real, RBAC, CRUD, adjuntos y datos reales siguen fuera de alcance.

## Recomendacion final

**Revisar visualmente y aprobar, luego pasar a QA Codex** antes de integrar. El
recolor cumple la identidad dark tech ATRIA manteniendo el layout moderno. No
mergear a `main` ni desplegar sin autorizacion; integrar primero hacia una rama
de revision/integracion.

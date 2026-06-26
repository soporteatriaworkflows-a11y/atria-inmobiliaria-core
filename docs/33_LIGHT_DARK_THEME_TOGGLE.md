# Light / Dark Theme Toggle — Sistema de tema dual

Fecha: 2026-06-26
Rol: Senior UIX / Design Systems
Rama: `feature/light-dark-theme-toggle` (derivada de `main`)
Alcance: sistema de tema claro/oscuro con toggle. Se conserva la identidad dark
tech ATRIA (violeta/lavanda) y se agrega un modo claro como default.

## Decisión: tema claro por default

El modo **claro** es el default (recomendado para uso diario y usuarios mayores).
Si no hay preferencia guardada, no se agrega la clase `dark` y se sirve el tema
claro. El modo oscuro se conserva intacto en estética, disponible vía toggle.

## Arquitectura (sin dependencias nuevas)

- Se evitó `next-themes` u otras dependencias: el sistema se resuelve con CSS
  variables + una clase `dark` en `<html>`, React y Tailwind ya presentes.
- Tokens `atria-*` theme-aware definidos como `rgb(var(--c-*) / <alpha-value>)`
  en `tailwind.config.ts`, con tripletes RGB por tema en `globals.css`
  (`:root` = claro, `html.dark` = oscuro). Esto permite cambiar todo el tema sin
  duplicar clases ni `dark:` por componente, y conserva los modificadores de
  opacidad (`/10`, `/30`...).
- El acento de marca `atria-violet` (#7C3AED) es constante en ambos temas.
- Anti-FOUC: un script inline en `<head>` (`layout.tsx`) lee
  `localStorage['atria-theme']` y aplica `dark` antes de pintar. `<html>` usa
  `suppressHydrationWarning` para no romper la hidratación.

## Paleta — modo claro

| Rol                              | Color                                        |
| -------------------------------- | -------------------------------------------- |
| Background                       | #F8F6FF (blanco cálido con glow lavanda)     |
| Surface (cards)                  | #FFFFFF                                      |
| Surface elevada / tracks         | #F4F0FF                                      |
| Border                           | #E5DDF8                                      |
| Texto principal                  | #15121F                                      |
| Texto secundario                 | #6E6682                                      |
| Acento / iconos / activos        | #7C3AED (violet)                             |
| Acento de texto (lavender token) | #7C3AED (violeta, por contraste)             |
| Sidebar                          | gradiente lavanda muy pálido, activo violeta |
| Success / Warning / Danger       | #047857 / #B45309 / #BE123C (discretos)      |

## Paleta — modo oscuro (conservada y refinada)

| Rol                        | Color                       |
| -------------------------- | --------------------------- |
| Carbon (base)              | #0A0A0F                     |
| Graphite (surface)         | #13131B                     |
| Indigo (acento profundo)   | #1B1240                     |
| Violet                     | #7C3AED                     |
| Lavender                   | #B68CFF                     |
| Fog (texto)                | #F2F2F7                     |
| Mist (texto sec.)          | #9D9BB8                     |
| Edge (bordes)              | #2A2740                     |
| Success / Warning / Danger | #34D39A / #F5B54A / #F0788F |

Refinamiento: los bordes pasaron de `white/10` translúcido a un token sólido
`edge` (#2A2740), más estable y menos "ruidoso". El verde queda solo en badges
de success; el ámbar solo en warning; violeta/lavanda dominan la identidad.

## Toggle

- Ubicación: parte inferior de la sidebar, encima del bloque "Información
  protegida".
- Componente: `src/components/theme-toggle.tsx` (cliente).
- Muestra icono sol/luna + etiqueta "Modo claro" / "Modo oscuro" y un switch.
- Accesibilidad: `aria-label` descriptivo ("Cambiar a modo claro/oscuro"),
  foco visible (`focus-ring`), `type="button"`, estado entendible por texto +
  icono + switch (no solo color). Evita mismatch de hidratación con un flag
  `mounted` (antes de montar muestra "Tema").
- Persistencia: `localStorage['atria-theme']` = `light` | `dark`.

## Componentes impactados

- `tailwind.config.ts`: tokens theme-aware (CSS vars) + sombras por tema.
- `src/app/globals.css`: variables `:root` (claro) / `html.dark` (oscuro),
  fondos por tema, vars de gráficos `--viz-*`, foco, scrollbar.
- `src/app/layout.tsx`: script anti-FOUC + `suppressHydrationWarning`.
- `src/components/theme-toggle.tsx`: NUEVO.
- `src/components/app-shell.tsx`: integra el toggle; superficies/bordes/headers
  ahora theme-aware.
- `src/components/sidebar-nav.tsx`, `ui.tsx`, `action-list.tsx`,
  `supabase-live-status.tsx`: bordes/superficies/estados theme-aware.
- `src/components/viz.tsx` (ProgressBar, LabeledBar, Donut, TimelineItem): track
  y trazos usan tokens/vars theme-aware.
- 12 páginas: idiomas de modo oscuro (`white/opacity`) reemplazados por tokens
  `atria-edge` / `atria-elevated`; hex inline (auditoría) -> vars `--viz-*`.

## Rutas verificadas (claro y oscuro)

`/`, `/login`, `/dashboard/admin`, `/dashboard/contador`,
`/dashboard/propietario`, `/propiedades`, `/herederos`, `/recaudos`, `/gastos`,
`/liquidacion`, `/solicitudes`, `/auditoria`.

## Validaciones

| Verificación                                         | Resultado                                            |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `pnpm format`                                        | PASS (global)                                        |
| `pnpm lint`                                          | PASS                                                 |
| `pnpm typecheck`                                     | PASS                                                 |
| `pnpm test`                                          | PASS (6/6)                                           |
| `pnpm build`                                         | PASS (12 rutas)                                      |
| Smoke local Playwright (claro+oscuro, desktop+móvil) | PASS (48 vistas)                                     |
| Toggle + persistencia                                | PASS (default claro; cambia y persiste tras recarga) |

Smoke: HTTP 200 en las 12 rutas, 0 overflow horizontal, navegación visible,
estado activo, 0 errores de consola, tema correcto por contexto (claro default /
oscuro con preferencia). Sin datos reales ni secretos. Capturas en
`artifacts/light-dark-theme/` (ignorado por Git).

## Accesibilidad

- Contraste: modo claro usa texto #15121F sobre superficies claras y estados en
  tonos -700; modo oscuro mantiene fog sobre carbon. Acentos violeta legibles en
  ambos.
- Foco visible (outline violeta) en ambos temas.
- Estados no dependen solo del color (badges con texto, dots con label/contexto).
- Toggle accesible (aria-label, foco, texto).
- `aria-current` en navegación; barras con `aria-label`/`role=progressbar`.

## Qué NO se tocó

`supabase/`, migraciones, RLS, `supabase/tests`, `src/lib/finance/`,
`src/lib/supabase/`, Auth real, Vercel, `.env*`, `.vercel`, tokens/claves, datos
reales, OCR, n8n, estructura de base de datos. Sin force-push, sin borrado de
ramas, sin merge a `main`, sin deploy.

## Riesgos pendientes

- Los gráficos Donut/Timeline usan inline `style` con CSS vars; correcto, pero
  conviene una verificación AA puntual del texto `mist` en claro sobre
  superficies `elevated`.
- Falta logo/favicon oficiales (independiente del tema).
- La preferencia es por dispositivo (localStorage); no se sincroniza por usuario
  hasta que exista Auth real.
- No se añadió opción "seguir el sistema" (prefers-color-scheme); el default es
  claro fijo salvo preferencia explícita. Puede agregarse en una iteración.

## Recomendación

**Aprobar visualmente y pasar a QA Codex.** El sistema dual cumple: claro default
usable y premium, oscuro conservado y refinado, toggle accesible y persistente.
Integrar primero hacia una rama de revisión/integración, **no directo a `main`**
ni desplegar sin autorización.

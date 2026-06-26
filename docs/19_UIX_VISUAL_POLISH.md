# UIX Visual Polish

Fecha: 2026-06-25
Rama: `feature/uix-visual-polish`
Base estable: `production-live-baseline-v1`

## Objetivo

Mejorar la experiencia visual de ATRIA Inmobiliaria para que la produccion live se sienta mas clara, humana, confiable y facil de revisar por personas mayores, sin tocar backend, Supabase, RLS, migraciones, Auth real, calculos financieros, Vercel ni datos reales.

## Concepto visual aplicado

Se avanzo hacia una interfaz de producto real con:

- sidebar persistente con identidad ATRIA;
- fondo general calido, no blanco puro;
- superficies redondeadas y suaves;
- jerarquia clara por modulo;
- botones y accesos grandes;
- estados visibles pero menos tecnicos;
- copy mas humano para usuarios no tecnicos;
- dashboard con resumen, pendientes y accesos rapidos.

La interfaz mantiene una sensacion profesional y sobria, con tonos verdes y arena ya existentes en el proyecto.

## Branding ATRIA

Colores detectados en el repo antes de esta fase:

| Token | Valor | Fuente |
| --- | --- | --- |
| `atria.ink` | `#16231f` | `tailwind.config.ts` |
| `atria.forest` | `#245448` | `tailwind.config.ts` |
| `atria.mint` | `#dff2e8` | `tailwind.config.ts` |
| `atria.sand` | `#f7f3eb` | `tailwind.config.ts` y `globals.css` |
| `atria.line` | `#d8ded8` | `tailwind.config.ts` |

No se detectaron logo, favicon, manual de marca, paleta formal externa ni assets graficos definitivos dentro del repo.

Colores temporales agregados como derivados de la paleta existente:

| Token | Valor | Uso provisional |
| --- | --- | --- |
| `atria.leaf` | `#3f7a68` | acento verde secundario |
| `atria.cream` | `#fffaf1` | superficies calidas |
| `atria.pearl` | `#fbf8f1` | fondos suaves de panel/input |
| `atria.muted` | `#65756e` | texto secundario legible |
| `atria.amber` | `#b56b1d` | advertencias calidas |
| `atria.rose` | `#b94a48` | riesgos/errores sobrios |

Que falta confirmar:

- logo oficial de ATRIA;
- favicon oficial;
- paleta corporativa validada;
- tipografia de marca;
- tono visual final para materiales comerciales.

Que se evito usar:

- la paleta navy/azul propuesta como placeholder;
- una apariencia tipo ICONIC OPS;
- un SaaS azul generico;
- gradientes decorativos sin relacion con ATRIA;
- saturacion de cards sin jerarquia.

Conclusion de branding: se aplico la paleta detectada del proyecto como fuente de verdad provisional. Los nuevos colores son derivados temporales y deben validarse con branding real antes de considerarse definitivos.

## Rutas modificadas

- `/`
- `/login`
- `/dashboard/admin`
- `/dashboard/contador`
- `/dashboard/propietario`
- `/propiedades`
- `/herederos`
- `/recaudos`
- `/gastos`
- `/liquidacion`
- `/solicitudes`
- `/auditoria`

## Componentes creados o mejorados

Creado:

- `src/components/ui.tsx`
  - `Badge`
  - `StatusPill`
  - `SectionPanel`
  - `ModuleHeader`
  - `MetricCard`
  - `EmptyState`
  - `QuickAction`

Mejorados:

- `AppShell`: sidebar, header, estado de seguridad y layout principal.
- `SupabaseLiveStatus`: copy mas humano y presentacion menos tecnica.
- `SummaryCard`: cards mas suaves y legibles.
- `ActionList`: items mas claros y faciles de escanear.

## Mejoras de accesibilidad y UX

- Navegacion principal mas consistente y visible.
- Botones y links grandes.
- Contraste suficiente con texto fuerte y texto secundario.
- Copy menos tecnico para personas no expertas.
- Estado de propietario/heredero marcado como solo lectura.
- Acciones rapidas con descripcion clara.
- Estados de seguridad visibles sin exponer claves ni detalles internos.

## Que no se toco

- Supabase migrations.
- RLS.
- `supabase/tests`.
- Logica financiera.
- Calculos.
- Auth real.
- Variables de entorno.
- `.env`, `.env.local`, `.vercel`.
- Configuracion de Vercel.
- Deploy de Production.
- Datos reales.
- OCR o n8n.

## Riesgos pendientes

- La identidad visual sigue siendo provisional porque no hay logo ni manual de marca en el repo.
- Falta validar visualmente con cliente/ATRIA antes de consolidar tokens definitivos.
- Favicon sigue pendiente.
- Auth real y CRUD por rol siguen fuera de esta fase.
- Antes de datos reales faltan auditoria visible, adjuntos seguros, backups/rollback y validacion financiera/legal.

## Siguiente fase recomendada

Pasar a una segunda capa visual con Claude o revision humana de marca:

1. Incorporar logo y favicon oficiales.
2. Confirmar paleta corporativa ATRIA.
3. Revisar espaciado, densidad y tono visual con usuarios mayores.
4. Mantener backend y seguridad intactos.
5. Preparar despues una fase separada de Auth real y CRUD por rol.

## Segunda capa Claude (2026-06-25)

La segunda capa visual se ejecuto en la rama derivada
`feature/uix-visual-polish-claude` y esta documentada en
`docs/21_CLAUDE_VISUAL_REVIEW.md`. Resumen de lo agregado sobre esta base:

- estado activo en la navegacion (`aria-current`) y agrupacion por intencion
  (Paneles / Operacion / Control) con iconografia propia;
- tipografia serif de marca (Fraunces) en wordmark y titulos;
- microcopy mas humano (se retiraron terminos como "append-only" o
  "sin borrado fisico");
- `MetricCard` sin el pill tecnico automatico "OK/Demo", con acento de color y
  badge opcional;
- `ActionList` con check calido y variante de pasos numerados;
- login con icono, campo de contrasena deshabilitado y panel de confianza.

No se toco backend, Supabase, RLS, calculos, Auth real, Vercel ni datos reales.
Verificaciones lint/typecheck/test/build en PASS.

## Revision visual local

Se levanto un servidor local temporal en `http://127.0.0.1:3100` y luego se apago al terminar la revision.

Rutas revisadas con Playwright:

- `/`
- `/login`
- `/dashboard/admin`
- `/dashboard/contador`
- `/dashboard/propietario`
- `/liquidacion`

Resultado:

- HTTP 200 en todas las rutas revisadas.
- Navegacion principal presente con 12 enlaces.
- Altura minima de controles interactivos: 48px.
- Sin errores de consola detectados.
- `Modo demo seguro` no aparece en la revision local.

Capturas locales de referencia:

- `artifacts/uix-visual-polish-2026-06-25/home.png`
- `artifacts/uix-visual-polish-2026-06-25/login.png`
- `artifacts/uix-visual-polish-2026-06-25/admin.png`
- `artifacts/uix-visual-polish-2026-06-25/contador.png`
- `artifacts/uix-visual-polish-2026-06-25/propietario.png`
- `artifacts/uix-visual-polish-2026-06-25/liquidacion.png`

Nota: `artifacts/` esta ignorado por Git y se conserva solo como evidencia local de QA.

# Production UIX Final Check

Fecha: 2026-06-25
Rol: Production Visual Final Check
URL final: https://atria-inmobiliaria-core.vercel.app
Rama: `main`
Release verificado: tag `uix-visual-polish-v1`

## Objetivo

Validacion final visual en produccion y preparacion de evidencia minima para
revision con cliente. Sin tocar backend, Supabase, Auth, CRUD, Vercel, variables
ni datos reales. Solo documentacion y capturas.

## Estado de produccion (Vercel)

- HTTP 200 en la home y en las 12 rutas principales.
- Vercel sirviendo correctamente (respuesta `200 OK`, cabecera `X-Vercel-Id`).
- Despliegue activo correspondiente al merge UIX (`uix-visual-polish-v1`).

## Estado de modo y datos

- Modo **live** visible: "Produccion conectada".
- El estado "Modo demostracion" NO aparece como estado principal.
- Aviso de minimizacion de datos: pill "Datos de ejemplo".
- Sin datos reales (montos y participantes son de ejemplo sanitizado).
- Sin secretos expuestos en el HTML (sin `service_role`, `secret key`, claves
  privadas, `postgres://`, `password=`, `sb_secret`, JWT largos).

## Estado de Supabase visible

- En `/` el componente de estado resolvio en navegador real a
  **"Supabase conectado"**, confirmando la conexion live desde el frontend.
- El mensaje es claro y no expone claves ni detalles internos.
- Las demas rutas no incluyen ese componente (solo vive en la home), por diseno.

## Rutas revisadas (12)

Todas con HTTP 200, sin overflow horizontal, navegacion visible (12 enlaces),
estado activo (`aria-current`) y 0 errores de consola, en desktop (1280px) y
movil (375px):

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

## Capturas generadas

Carpeta (ignorada por Git, evidencia local): `artifacts/production-uix-final-check/`

- 12 capturas desktop: `desktop-<ruta>.png`
- 12 capturas movil: `mobile-<ruta>.png`
- Resumen de chequeos automaticos: `_summary.json`

Nota: las capturas no se versionan (carpeta `artifacts/` en `.gitignore`). Para
la revision con cliente, compartir las imagenes de esa carpeta de forma manual.

## Verificaciones de codigo

| Verificacion | Resultado |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (6/6) |
| `pnpm build` | PASS (12 rutas + not-found) |

## Que SE PUEDE mostrar al cliente

- La experiencia visual ATRIA completa: identidad calida, sidebar con navegacion
  agrupada (Paneles / Operacion / Control) y estado activo, iconografia propia,
  tipografia serif de marca.
- Paneles por rol (administrador, contador, propietario) con resumen claro.
- Modulos de operacion (propiedades, participantes, recaudos, gastos,
  liquidacion) con datos de ejemplo.
- Liquidacion mensual de ejemplo con resultado por participante y supuestos.
- Solicitudes y auditoria como flujos preparados.
- Login con apariencia confiable y mensajes de cuidado.
- Comportamiento responsive (desktop y movil) sin desbordes.

## Que NO debe prometerse todavia

- NO hay inicio de sesion real (Auth pendiente; el login es vista de ejemplo).
- NO hay control de acceso por rol aplicado a datos (RBAC real pendiente).
- NO hay creacion/edicion/borrado real (CRUD pendiente).
- NO hay datos reales, ni financieros ni personales.
- NO hay carga de documentos/adjuntos ni OCR.
- NO hay automatizaciones (n8n) ni notificaciones.
- Los montos y participantes son de ejemplo; no usar para pagos.
- La identidad visual es provisional: faltan logo, favicon y manual de marca
  oficiales (la tipografia Fraunces es decision de diseno, no marca validada).

## Checklist antes de cargar datos reales

- [ ] Auth real (Supabase Auth) con sesiones por organizacion.
- [ ] RBAC aplicado y verificado (administrador / contador / propietario).
- [ ] RLS revisada y probada en cada tabla de negocio expuesta.
- [ ] CRUD base con validacion y registro en auditoria.
- [ ] Auditoria poblada y consultable (append-only verificado).
- [ ] Adjuntos en Storage privado con URLs firmadas.
- [ ] Validacion financiera/legal de las reglas de liquidacion.
- [ ] Respaldo y procedimiento de rollback de datos.
- [ ] Logo, favicon y paleta corporativa oficiales.
- [ ] Prueba de usabilidad con personas mayores.
- [ ] Politica de privacidad y consentimiento para datos personales.

## Observaciones menores (no bloqueantes, sin cambios en esta fase)

- En movil, la navegacion completa se apila arriba sin menu colapsable; funciona
  y no desborda, pero un menu plegable mejoraria la experiencia. Candidato a
  fase futura (no se toca aqui por la regla de no cambios de diseno profundos).

## Siguiente fase recomendada

Auth real + roles + CRUD base, en rama separada y sin tocar la UI consolidada:

1. Habilitar Supabase Auth y sesiones por organizacion.
2. Aplicar RBAC real a las vistas y acciones.
3. CRUD base de propiedades, participantes, recaudos y gastos con validacion,
   auditoria y RLS probada.
4. Mantener datos reales fuera hasta cumplir el checklist anterior.

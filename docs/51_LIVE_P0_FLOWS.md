# P0 live: Propiedades, Ingresos, Gastos y Solicitudes

Rama: `feature/mvp-recovery-live-flows`. Alcance: listar y crear con el cliente
Supabase autenticado, utilizando el schema y las políticas existentes.

## Auditoría inicial

| Módulo      | Demo visible antes                           | Lectura / creación que ya persistía           | Validación previa                                      | RLS existente                                                                       | Mínimo faltante                                                   |
| ----------- | -------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Propiedades | Métricas, propiedades e ingresos del fixture | SELECT e INSERT en properties                 | Nombre y código no vacíos                              | Staff consulta; admins de organización escriben; propietarios según grants          | Separar live, vacíos/errores/carga, confirmación y refresco       |
| Ingresos    | Totales y filas de recaudos demo             | SELECT e INSERT draft en rent_collections     | Entero positivo, conversión Number permisiva           | Staff escribe; lectura staff o acceso a propiedad                                   | Selección explícita, COP estricto, periodo actual, estados reales |
| Gastos      | Totales y filas demo                         | SELECT e INSERT draft global en expenses      | Entero positivo; descripción solo controlada por botón | Staff escribe; lectura staff o propiedad autorizada                                 | Global/propiedad, descripción en submit, estados reales           |
| Solicitudes | Tres solicitudes y estados ficticios         | SELECT e INSERT adjustment en change_requests | Detalle no vacío, requested_by de sesión               | Staff consulta; miembro inserta para sí mismo; propietario consulta sus solicitudes | Lista real, estado pending_review, vacíos/errores y confirmación  |

El hook anterior consultaba cinco tablas aunque la página solo necesitaba una.
Capturaba el fallo de escritura pero no informaba al formulario: este borraba
los campos incluso si el INSERT fallaba. Los errores PostgREST no siempre son
instancias de Error. Había copy de demostración y placeholders demo junto a
operaciones que sí escribían. No faltan tablas o columnas para estos flujos.

## Implementación y operaciones

| Ruta         | Tablas                       | Operaciones nuevas en live                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------ |
| /propiedades | properties                   | Listar por organización y crear propiedad active             |
| /recaudos    | rent_collections, properties | Listar y crear ingreso draft/manual con propiedad            |
| /gastos      | expenses, properties         | Listar y crear gasto draft global o por propiedad            |
| /solicitudes | change_requests              | Listar y crear adjustment/pending_review con autor de sesión |

La sesión sigue usando memberships mediante el AuthProvider existente.
No se añadieron UPDATE, DELETE, posting, reversals ni aprobación de solicitudes.
El código demo anterior permanece únicamente en la rama no-live de estas páginas.
Los demás módulos no se convirtieron en esta fase.

- Cada listado consulta solo sus tablas, con organization_id y orden estable.
- Páginas de 25 registros con anterior/siguiente; se solicita un registro extra
  para detectar la página siguiente. No se muestran totales parciales como globales.
- Los selectores de propiedades recorren páginas, en vez de truncarse al límite
  predeterminado de PostgREST.
- El periodo se selecciona como mes y se guarda como su primer día; por defecto
  se propone el mes del calendario del navegador, sin fecha fija de fixture.
- COP se valida como texto de 1 a 14 dígitos, entero positivo dentro de
  NUMERIC(14,0), sin decimales, exponentes ni separadores. No se calcula con floats.
- Gastos usan las categorías existentes: global con property_id null, property
  con propiedad obligatoria. No se incorpora un catálogo nuevo.
- Se comprueba la propiedad y su organización antes de insertar un ingreso o
  gasto asociado; se vuelve a consultar para detectar selecciones obsoletas.
- Solo un INSERT que devuelve id confirma éxito. Los fallos conservan campos,
  impiden doble envío simultáneo y permiten reintentar la lectura.
- Si INSERT confirma y el refresco falla, se muestra éxito del guardado y error
  del listado por separado. Ante respuesta de escritura ambigua se pide actualizar
  antes de repetir; no hay reintento automático de escritura propio de la UI.
- Cambiar sesión/organización desmonta el módulo y descarta respuestas tardías.
- AuthGate, canAccessRoute, canRole y RLS permanecen; no se ampliaron permisos.

## Permisos del flujo de interfaz

| Rol            | Propiedades        | Ingresos           | Gastos             | Solicitudes                    |
| -------------- | ------------------ | ------------------ | ------------------ | ------------------------------ |
| platform_admin | Leer / crear       | Leer / crear draft | Leer / crear draft | Leer permitidas / crear propia |
| estate_admin   | Leer / crear       | Leer / crear draft | Leer / crear draft | Leer permitidas / crear propia |
| accountant     | Leer               | Leer / crear draft | Leer / crear draft | Leer                           |
| owner_readonly | Ruta no autorizada | Ruta no autorizada | Ruta no autorizada | Leer propias / crear propia    |

Los permisos de lectura de dominio del propietario siguen existiendo para sus
áreas autorizadas; esta tabla describe las cuatro rutas, no un cambio en RLS.

## Verificación

- Propiedades: format, lint, typecheck y test PASS; 53 tests tras ese módulo.
- Ingresos: format, lint, typecheck y test PASS; 86 tests.
- Gastos: format, lint, typecheck y test PASS; 86 tests.
- Solicitudes: format, lint, typecheck y test PASS; 98 tests.
- 57 tests nuevos de servicio con HTTP Supabase simulado: filtros, paginación,
  validación, INSERT confirmado, permisos, relación de propiedad y errores.
- `node scripts/live-p0-smoke.mjs properties`: 6 escenarios PASS.
- `node scripts/live-p0-smoke.mjs finance`: 5 escenarios PASS.
- `node scripts/live-p0-smoke.mjs requests`: 8 escenarios PASS.
- Browser smoke incluye carga, vacíos, ausencia de fixtures en live, crear,
  recargar, rechazo RLS simulado, conservar datos, doble envío y error de refresco.
- Regresión Auth/RBAC: 57/57 comprobaciones PASS; cero peticiones a Cloud.
- `pnpm build`: PASS. Persiste la advertencia previa de Next sobre detección
  del plugin ESLint; el lint independiente pasa.
- Se detuvo únicamente el Next local de este workspace antes del build para
  evitar conflictos con la caché de desarrollo.

Los smokes interceptan todo tráfico externo y solo utilizan sesiones y datos
sintéticos QA. No prueban las policies ejecutándose en Cloud ni insertan datos allí.
No se cambiaron policies, schema, permisos de cuentas, secrets o configuración.
No se ejecutaron migraciones, db push, reset, merge ni deploy.

## Límites y riesgos existentes

La integración de listar/crear está implementada; falta el smoke real contra
Cloud de estos nuevos formularios. No se declara esa validación realizada.
Las etiquetas DEMO/QA de filas existentes en Cloud siguen visibles como datos
reales almacenados; lo eliminado son los fixtures incrustados en las páginas.

La relación property_id actual usa una FK simple. La comprobación de organización
añadida en la aplicación no reemplaza una restricción compuesta en PostgreSQL:
el endurecimiento frente a llamadas directas a la API con una propiedad ajena
requiere una revisión de schema/policies y autorización de migración aparte.
No se debilitó ninguna política en esta fase.

Los borradores no se editan ni eliminan desde estas pantallas. No hay idempotencia
persistente para un envío cuya respuesta se pierda: revisar el listado antes de
reintentar evita duplicaciones operativas. Los flujos de aprobación, contabilización,
cierre e historial siguen fuera del alcance solicitado.

## Smoke manual Cloud

Usar la sesión real platform_admin. Para los registros nuevos usar exclusivamente
nombres, códigos y descripciones claramente QA, sin datos personales reales.

1. `/propiedades`: comprobar listado real, crear nombre `QA P0 propiedad` y código
   único `QA-P0-<fecha-hora>`. Esperar confirmación, actualizar y recargar F5:
   la fila debe permanecer. Repetir el código debe dar error y conservar los campos.
2. `/recaudos`: seleccionar esa propiedad QA y el mes deseado. Verificar que 0,
   negativos, decimales y notación exponencial no habilitan guardar. Crear 10000 COP;
   debe aparecer Borrador, con propiedad/mes/monto correctos y persistir tras F5.
3. `/gastos`: crear `QA P0 gasto global` de 1000 COP, alcance Global. Crear
   `QA P0 gasto propiedad` de 2000 COP seleccionando la propiedad QA. Ambos deben
   aparecer como Borrador y mantener monto/relación tras F5.
4. `/solicitudes`: enviar `QA P0 verificar solicitud`; verificar Pendiente de
   revisión, Creada por ti y persistencia tras F5. No debe cambiar un registro financiero.
5. En cada ruta, usar Actualizar listado; si hay más de 25 filas, probar
   Siguiente/Anterior. No deben aparecer métricas inventadas.
6. Con DevTools en Offline, actualizar un listado: debe aparecer error y nunca
   presentarse como vacío. Volver Online y Reintentar consulta. No enviar una
   operación financiera cuya respuesta se desconozca sin revisar antes el listado.
7. Si ya existen sesiones autorizadas de contador/propietario: contador puede
   crear ingresos/gastos pero no propiedades/solicitudes; propietario solo accede
   a sus solicitudes entre estas cuatro rutas. No crear usuarios ni cambiar
   memberships para esta prueba.
8. Cerrar sesión en `/login`, abrir una de las cuatro rutas y confirmar que exige
   login; entrar nuevamente y comprobar que los registros QA permanecen.

No borrar los datos QA al finalizar ni avanzar a cierre mensual/historial.

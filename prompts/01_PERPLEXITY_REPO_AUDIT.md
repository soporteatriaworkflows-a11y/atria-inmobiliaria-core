# Prompt para Perplexity — Auditoría profunda de repositorios y fuentes oficiales

Actúa como investigador técnico senior y auditor de reutilización open source.

Estamos construyendo `atria-inmobiliaria-core`, una plataforma web segura para administración de propiedades heredadas, liquidaciones mensuales, acceso por roles, reportes y futura expansión SaaS multi-cliente.

Stack objetivo:
- Next.js App Router + TypeScript
- Supabase Postgres, Auth, Storage y RLS
- Supabase CLI local con Docker
- Vercel Preview
- GitHub privado
- Futuro n8n y OCR con validación humana

Necesito una investigación basada prioritariamente en:
1. Documentación oficial actualizada.
2. Repositorios GitHub verificables.
3. Licencias reales de cada repositorio.
4. Actividad reciente del proyecto.
5. Issues de seguridad, mantenimiento o complejidad.

Analiza estos repositorios y agrega otros únicamente si son realmente relevantes:
- microrealestate/microrealestate
- open-condo-software/condo
- nextjs/saas-starter
- saidMounaim/prop-pulse
- movin-in
- alternativas open source actuales para property management

Entrega:

A. Matriz por repositorio:
- URL
- licencia
- fecha del último commit
- stack
- nivel de complejidad
- módulos reutilizables como referencia
- riesgos
- decisión: usar como inspiración, extraer patrón, evitar, o evaluar clon parcial

B. Recomendación:
- qué repo usar como base real, si alguno;
- o si conviene iniciar scaffold limpio;
- justificación técnica y de seguridad.

C. Validación oficial de Supabase:
- publishable key vs secret key;
- RLS;
- Auth;
- Storage privado;
- signed URLs;
- local development con Docker y Supabase CLI;
- separación DEV/PROD.

D. Validación oficial de Codex:
- AGENTS.md;
- skills;
- subagentes;
- worktrees;
- ejecución autónoma segura.

E. Validación oficial de Vercel:
- previews por rama;
- producción desde main;
- variables por environment.

F. Riesgos del modelo financiero:
- redondeo;
- cierres inmutables;
- ajustes/reversos;
- auditoría append-only;
- separación entre saldos, recaudos, consignaciones y liquidaciones.

No inventes cifras de precisión OCR, retención legal ni cumplimiento normativo. Cuando no exista fuente oficial, indícalo como hipótesis o recomendación técnica. Cita cada afirmación importante con enlaces directos.

# Prompt 00 — Bootstrap orchestrator

Actúa como ORQUESTADOR JEFE de este repositorio.

Lee primero:
- AGENTS.md
- CLAUDE.md
- docs/00_PRODUCT_SCOPE.md
- docs/01_DECISIONS_AND_UNKNOWNS.md
- docs/02_SECURITY_BASELINE.md
- docs/03_LIQUIDATION_GOLDEN_TEST.md
- docs/04_AGENT_ORCHESTRATION.md

Objetivo de esta ejecución:
Construir únicamente la FASE 0 y la base técnica inicial del MVP, con autonomía dentro del repositorio local y sin pedir aprobaciones innecesarias.

Reglas:
- No trabajes sobre main.
- Usa la rama actual `setup/foundation`.
- No hagas deploy de producción.
- No conectes dominios.
- No uses secretos reales.
- No cargues datos personales.
- No modifiques bases de datos remotas.
- Trabaja con fixtures sanitizados.
- Puedes crear subagentes y worktrees cuando ayude, pero evita que dos agentes editen los mismos archivos.
- Ejecuta tus propias verificaciones.
- Si falta una herramienta local, documenta el bloqueo exacto y el comando de instalación, pero continúa con todo lo demás que puedas hacer de forma segura.

Tareas:
1. Audita el starter pack y detecta contradicciones o faltantes.
2. Crea un plan de implementación por fases con criterios de done.
3. Inicializa el proyecto web con Next.js App Router, TypeScript y pnpm.
4. Configura lint, typecheck, tests y build.
5. Inicializa Supabase local en carpeta `supabase/` y prepara migraciones vacías o base segura; no conectes cloud todavía.
6. Crea `.env.example` solo con placeholders y verifica `.gitignore`.
7. Crea la estructura modular del repo.
8. Genera ADRs para:
   - separación de organización/estate;
   - separación perfiles vs herederos;
   - ledger append-only;
   - cierres mensuales;
   - RLS y entorno local/dev/prod;
   - OCR como fase posterior con validación humana.
9. Crea un mapa de agentes y ownership de archivos.
10. Ejecuta lint, typecheck, tests y build.
11. Haz un commit local de la fundación si todo pasa.
12. Entrega un reporte final con:
   - rama y commit;
   - archivos creados;
   - comandos ejecutados;
   - verificaciones PASS/FAIL;
   - bloqueos;
   - riesgos;
   - siguiente prompt recomendado.

No implementes todavía OCR, n8n ni producción.

# START HERE — ATRIA Inmobiliaria Core

## Objetivo inmediato
Crear un repositorio privado separado para el MVP de liquidación de herederos y administración de propiedades. Este repositorio será una base reutilizable para una futura app inmobiliaria de ATRIA.

## Regla de seguridad
No subir a GitHub archivos con nombres reales, direcciones reales, comprobantes, cédulas, cuentas bancarias, PDF del contador ni Excel privados. El fixture incluido está sanitizado.

## Nombre recomendado del repositorio
`atria-inmobiliaria-core`

## Orden de arranque
1. Crear un repositorio privado nuevo en GitHub.
2. Clonarlo en una carpeta local.
3. Copiar este starter pack dentro del repositorio.
4. Crear la rama `setup/foundation`.
5. Abrir la carpeta en Codex App para Windows.
6. Ejecutar el prompt `prompts/00_BOOTSTRAP_ORCHESTRATOR.md`.
7. Trabajar primero con Supabase local mediante Docker y Supabase CLI.
8. Conectar Vercel únicamente cuando el scaffold compile, los tests pasen y exista una primera rama lista para Preview.
9. Crear Supabase Cloud DEV y Vercel Preview como proyectos separados de producción.
10. No crear dominio público ni hacer deploy de producción todavía.

## Comandos base en PowerShell
```powershell
mkdir atria-inmobiliaria-core
cd atria-inmobiliaria-core
git init
git checkout -b setup/foundation
```

Después de copiar este paquete dentro de la carpeta:

```powershell
git add .
git commit -m "chore: add project foundation docs and sanitized fixture"
```

## Cuentas
- GitHub: repositorio privado separado. Preferiblemente dentro de una organización ATRIA.
- Supabase: proyecto DEV separado para esta app. Producción se crea después.
- Vercel: proyecto separado para esta app. Al inicio solo Preview.
- Correo operativo ATRIA: `soporte@atriaworkflows.com`.
- Nunca compartir contraseñas o secret keys por chat.

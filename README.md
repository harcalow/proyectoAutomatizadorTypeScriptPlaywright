# Automatización OrangeHRM — Playwright + TypeScript

Marco de trabajo basado en Page Object Model para
https://opensource-demo.orangehrmlive.com

## Instalación

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Ejecución

| Comando               | Descripción                        |
|-----------------------|------------------------------------|
| `npm test`            | Ejecuta todas las pruebas          |
| `npm run test:headed` | Ejecuta con el navegador visible   |
| `npm run test:ui`     | Modo UI de Playwright              |
| `npm run test:debug`  | Modo depuración                    |
| `npm run report`      | Abre el último reporte HTML        |
| `npm run typecheck`   | Verifica tipos con TypeScript      |

## Estructura

```
src/
  pages/      Page Objects (BasePage, LoginPage, DashboardPage)
  fixtures/   Fixtures que inyectan los Page Objects en las pruebas
  data/       Datos de prueba (usuarios)
  utils/      Utilidades (variables de entorno)
tests/        Especificaciones de prueba
```

## Agregar una página nueva

1. Crea `src/pages/MiPagina.ts` extendiendo `BasePage` y define `path` y sus locators.
2. Regístrala en `src/fixtures/pages.fixture.ts`.
3. Úsala en las pruebas importando `test` y `expect` desde el fixture.

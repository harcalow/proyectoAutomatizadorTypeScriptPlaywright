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
historias-usuario/  Historias de usuario en Markdown (punto de partida de todo)
src/
  pages/            Page Objects (BasePage, LoginPage, DashboardPage)
  fixtures/         Fixtures que inyectan los Page Objects en las pruebas
  data/             Datos de prueba (usuarios)
  utils/            Utilidades (entorno, evidencias, lector de historias)
tests/              Un archivo .spec.ts por historia de usuario
```

## Flujo de trabajo: todo parte de una historia de usuario

1. Copia `historias-usuario/_PLANTILLA.md` como `historias-usuario/HU-002-nombre-corto.md`.
2. Completa las tres secciones: **Título**, **Descripción** y **Criterios de aceptación**.
   Cada criterio va en una línea con el formato `- CA-01: Dado ..., cuando ..., entonces ...`.
3. Crea `tests/HU-002-nombre-corto.spec.ts` y carga la historia:

   ```ts
   const hu = loadUserStory('HU-002');

   test.describe(`${hu.id} - ${hu.title}`, () => {
     test(hu.criterion('CA-01'), async ({ page }, testInfo) => {
       await test.step('1. ...', async () => { /* ... */ });
     });
   });
   ```

   Hay un test por cada criterio de aceptación. Si un criterio no existe en la
   historia, la prueba falla al cargar, así el código y la historia se mantienen sincronizados.
4. Si la historia usa una página nueva, crea su Page Object en `src/pages/`
   (extendiendo `BasePage`) y regístralo en `src/fixtures/pages.fixture.ts`.

En el reporte HTML cada prueba aparece agrupada por historia, con el criterio
como título, la historia y su descripción como anotaciones, y las capturas de cada paso.

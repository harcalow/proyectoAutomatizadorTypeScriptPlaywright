import { test, expect } from '../src/fixtures/pages.fixture';
import { users } from '../src/data/users';
import { captureEvidence } from '../src/utils/evidence';

test('Escenario 1: inicio de sesión exitoso con usuario Admin', async ({ page, loginPage, dashboardPage }, testInfo) => {
  await test.step('1. Abrir la página de login de OrangeHRM', async () => {
    await loginPage.goto();
    await expect(loginPage.loginButton).toBeVisible();
    await captureEvidence(page, testInfo, '01 - Página de login');
  });

  await test.step(`2. Ingresar el usuario "${users.admin.username}"`, async () => {
    await loginPage.usernameInput.fill(users.admin.username);
    await captureEvidence(page, testInfo, '02 - Usuario ingresado');
  });

  await test.step('3. Ingresar la contraseña', async () => {
    await loginPage.passwordInput.fill(users.admin.password);
    await captureEvidence(page, testInfo, '03 - Contraseña ingresada');
  });

  await test.step('4. Hacer clic en el botón Login', async () => {
    await loginPage.loginButton.click();
  });

  await test.step('5. Verificar que se muestra el Dashboard', async () => {
    await dashboardPage.waitUntilLoaded();
    await expect(page).toHaveURL(/dashboard/);
    await captureEvidence(page, testInfo, '04 - Dashboard tras iniciar sesión');
  });
});

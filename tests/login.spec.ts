import { test, expect } from '../src/fixtures/pages.fixture';
import { users } from '../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('inicia sesión con credenciales válidas', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(users.admin.username, users.admin.password);
    await expect(dashboardPage.header).toBeVisible();
  });

  test('muestra error con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
  });
});

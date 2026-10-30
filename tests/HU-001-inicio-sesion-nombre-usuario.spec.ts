import { test, expect } from '../src/fixtures/pages.fixture';
import { users } from '../src/data/users';
import { captureEvidence } from '../src/utils/evidence';
import { loadUserStory } from '../src/utils/userStory';

const hu = loadUserStory('HU-001');
const INVALID_CREDENTIALS = 'Invalid credentials';
const REQUIRED = 'Required';

test.describe(`${hu.id} - ${hu.title}`, () => {
  test.beforeEach(async ({ loginPage }) => {
    test.info().annotations.push(
      { type: 'Historia de usuario', description: `${hu.id} - ${hu.title}` },
      { type: 'Descripción', description: hu.description },
    );
    await loginPage.goto();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test.describe(hu.criterion('CA-01'), () => {
    test('TC-01: Login con credenciales válidas', async ({ page, loginPage, dashboardPage }, testInfo) => {
      await test.step(`1. Ingresar usuario "${users.admin.username}" y contraseña`, async () => {
        await loginPage.fillCredentials(users.admin.username, users.admin.password);
        await captureEvidence(page, testInfo, '01 - Credenciales ingresadas');
      });

      await test.step('2. Pulsar "Login"', async () => {
        await loginPage.loginButton.click();
      });

      await test.step('3. Verificar la redirección al dashboard', async () => {
        await dashboardPage.waitUntilLoaded();
        await expect(page).toHaveURL(/dashboard/);
        await captureEvidence(page, testInfo, '02 - Dashboard');
      });
    });
  });

  test.describe(hu.criterion('CA-02'), () => {
    const cases = [
      { id: 'TC-02', name: 'Contraseña incorrecta', data: users.wrongPassword },
      { id: 'TC-03', name: 'Usuario inexistente', data: users.nonexistentUser },
      { id: 'TC-04', name: 'Usuario y contraseña incorrectos', data: users.bothWrong },
    ];

    for (const { id, name, data } of cases) {
      test(`${id}: ${name}`, async ({ page, loginPage }, testInfo) => {
        await test.step(`1. Ingresar usuario "${data.username}" y contraseña "${data.password}"`, async () => {
          await loginPage.fillCredentials(data.username, data.password);
          await captureEvidence(page, testInfo, '01 - Credenciales ingresadas');
        });

        await test.step('2. Pulsar "Login"', async () => {
          await loginPage.loginButton.click();
        });

        await test.step(`3. Verificar el mensaje "${INVALID_CREDENTIALS}" y los campos vacíos`, async () => {
          await expect(loginPage.errorAlert).toHaveText(INVALID_CREDENTIALS);
          await expect(loginPage.usernameInput).toHaveValue('');
          await expect(loginPage.passwordInput).toHaveValue('');
          await captureEvidence(page, testInfo, '02 - Mensaje de error y campos vacíos');
        });
      });
    }

    test('TC-05: El mensaje no revela qué dato falló', async ({ page, loginPage }, testInfo) => {
      let wrongPasswordMessage = '';

      await test.step('1. Intentar con contraseña incorrecta y guardar el mensaje', async () => {
        await loginPage.login(users.wrongPassword.username, users.wrongPassword.password);
        await expect(loginPage.errorAlert).toBeVisible();
        wrongPasswordMessage = (await loginPage.errorAlert.textContent()) ?? '';
        await captureEvidence(page, testInfo, '01 - Mensaje con contraseña incorrecta');
      });

      await test.step('2. Intentar con usuario inexistente y comparar el mensaje', async () => {
        await loginPage.login(users.nonexistentUser.username, users.nonexistentUser.password);
        await expect(loginPage.errorAlert).toHaveText(wrongPasswordMessage);
        await captureEvidence(page, testInfo, '02 - Mensaje con usuario inexistente');
      });
    });
  });

  test.describe(hu.criterion('CA-03'), () => {
    const cases = [
      { id: 'TC-06', name: 'Ambos campos vacíos', username: '', password: '', userRequired: true, passRequired: true },
      { id: 'TC-07', name: 'Usuario vacío', username: '', password: users.admin.password, userRequired: true, passRequired: false },
      { id: 'TC-08', name: 'Contraseña vacía', username: users.admin.username, password: '', userRequired: false, passRequired: true },
      { id: 'TC-09', name: 'Campos con solo espacios', username: '   ', password: '   ', userRequired: true, passRequired: true },
    ];

    for (const { id, name, username, password, userRequired, passRequired } of cases) {
      test(`${id}: ${name}`, async ({ page, loginPage }, testInfo) => {
        await test.step(`1. Ingresar usuario "${username}" y contraseña "${password}"`, async () => {
          await loginPage.fillCredentials(username, password);
        });

        await test.step('2. Pulsar "Login"', async () => {
          await loginPage.loginButton.click();
        });

        await test.step(`3. Verificar "${REQUIRED}" en los campos vacíos y que no se envía`, async () => {
          if (userRequired) await expect(loginPage.usernameError).toHaveText(REQUIRED);
          else await expect(loginPage.usernameError).toHaveCount(0);
          if (passRequired) await expect(loginPage.passwordError).toHaveText(REQUIRED);
          else await expect(loginPage.passwordError).toHaveCount(0);
          await expect(page).toHaveURL(/auth\/login/);
          await expect(loginPage.errorAlert).toHaveCount(0);
          await captureEvidence(page, testInfo, '01 - Mensajes de campo obligatorio');
        });
      });
    }
  });

  test.describe(hu.criterion('CA-04'), () => {
    const allowed = [
      { id: 'TC-10', name: 'Usuario en minúsculas', username: 'admin' },
      { id: 'TC-11', name: 'Usuario en mayúsculas', username: 'ADMIN' },
    ];

    for (const { id, name, username } of allowed) {
      test(`${id}: ${name}`, async ({ page, loginPage, dashboardPage }, testInfo) => {
        await test.step(`1. Ingresar usuario "${username}" y contraseña correcta`, async () => {
          await loginPage.fillCredentials(username, users.admin.password);
          await captureEvidence(page, testInfo, '01 - Credenciales ingresadas');
        });

        await test.step('2. Pulsar "Login"', async () => {
          await loginPage.loginButton.click();
        });

        await test.step('3. Verificar el acceso al dashboard', async () => {
          await dashboardPage.waitUntilLoaded();
          await captureEvidence(page, testInfo, '02 - Dashboard');
        });
      });
    }

    const rejected = [
      { id: 'TC-12', name: 'Contraseña en mayúsculas', username: users.admin.username, password: 'ADMIN123' },
      { id: 'TC-13', name: 'Contraseña con una mayúscula', username: users.admin.username, password: 'Admin123' },
      { id: 'TC-14', name: 'Usuario con espacios al inicio y al final', username: ' Admin ', password: users.admin.password },
      { id: 'TC-15', name: 'Contraseña con un espacio al inicio', username: users.admin.username, password: ' admin123' },
    ];

    for (const { id, name, username, password } of rejected) {
      test(`${id}: ${name}`, async ({ page, loginPage }, testInfo) => {
        await test.step(`1. Ingresar usuario "${username}" y contraseña "${password}"`, async () => {
          await loginPage.fillCredentials(username, password);
          await captureEvidence(page, testInfo, '01 - Credenciales ingresadas');
        });

        await test.step('2. Pulsar "Login"', async () => {
          await loginPage.loginButton.click();
        });

        await test.step(`3. Verificar el mensaje "${INVALID_CREDENTIALS}"`, async () => {
          await expect(loginPage.errorAlert).toHaveText(INVALID_CREDENTIALS);
          await captureEvidence(page, testInfo, '02 - Acceso rechazado');
        });
      });
    }
  });

  test.describe(hu.criterion('CA-05'), () => {
    test('TC-16: La contraseña se muestra oculta', async ({ page, loginPage }, testInfo) => {
      await test.step('1. Escribir la contraseña', async () => {
        await loginPage.passwordInput.fill(users.admin.password);
      });

      await test.step('2. Verificar que los caracteres están ocultos', async () => {
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        await captureEvidence(page, testInfo, '01 - Contraseña enmascarada');
      });
    });
  });

  test.describe(hu.criterion('CA-06'), () => {
    test('TC-17: Login válido después de varios intentos fallidos', async ({ page, loginPage, dashboardPage }, testInfo) => {
      test.slow();
      const attempts = 5;

      for (let i = 1; i <= attempts; i++) {
        await test.step(`${i}. Intento fallido ${i} de ${attempts}`, async () => {
          await loginPage.login(users.wrongPassword.username, users.wrongPassword.password);
          await expect(loginPage.errorAlert).toHaveText(INVALID_CREDENTIALS);
        });
      }
      await captureEvidence(page, testInfo, `01 - Tras ${attempts} intentos fallidos`);

      await test.step(`${attempts + 1}. Iniciar sesión con las credenciales correctas`, async () => {
        await loginPage.login(users.admin.username, users.admin.password);
        await dashboardPage.waitUntilLoaded();
        await captureEvidence(page, testInfo, '02 - Dashboard');
      });
    });
  });
});

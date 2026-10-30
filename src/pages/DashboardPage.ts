import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  protected readonly path = '/web/index.php/dashboard/index';

  readonly header: Locator;
  readonly userDropdown: Locator;
  readonly loadingSpinners: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.loadingSpinners = page.locator('.oxd-loading-spinner');
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.header).toBeVisible();
    await expect(this.loadingSpinners).toHaveCount(0);
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}

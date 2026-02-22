import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  /** Initializes the login page and locators for email, password, and submit button. */
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
  }

  /** Navigates to the login page (/auth/login). */
  async goto() {
    await this.page.goto('/auth/login');
  }

  /** Fills in the email and password fields and clicks the login submit button. */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Asserts that the user is logged in by waiting for the nav menu to show the user's full name. */
  async expectLoggedIn(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`.trim();
    const navMenu = this.page.locator('[data-test="nav-menu"]');
    await navMenu.waitFor({ state: 'visible', timeout: 10000 });
    await expect(navMenu).toContainText(fullName);
  }
}

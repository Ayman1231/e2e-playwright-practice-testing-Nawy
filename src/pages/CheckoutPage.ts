import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cashOnDelivery: Locator;
  readonly confirmOrderButton: Locator;
  readonly orderConfirmation: Locator;
  readonly invoiceIdSpan: Locator;
  readonly proceedToCheckout1Button: Locator;
  readonly proceedToCheckout2Button: Locator;
  readonly proceedToCheckout3Button: Locator;

  /** Initializes the checkout page and locators for cart, payment, and checkout steps. */
  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="nav-cart"]');
    this.cashOnDelivery = page.locator('[data-test="payment-method"]');
    this.confirmOrderButton = page.locator('[data-test="finish"]');
    this.orderConfirmation = page.locator('[data-test="payment-success-message"]');
    this.invoiceIdSpan = page.locator('#order-confirmation span');
    this.proceedToCheckout1Button = page.locator('[data-test="proceed-1"]');
    this.proceedToCheckout2Button = page.locator('[data-test="proceed-2"]');
    this.proceedToCheckout3Button = page.locator('[data-test="proceed-3"]');

  }

  /** Navigate to cart page as the current logged-in user (same session as API cart). */
  async gotoCart() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('networkidle');
  }

  /** Clicks the cart icon in the nav to open the cart / go to checkout. */
  async goToCheckout() {
    await this.checkoutButton.click();
  }

  /** Selects the "cash on delivery" payment method from the payment dropdown. */
  async selectCashOnDelivery() {
    await this.cashOnDelivery.selectOption('cash-on-delivery');
  }

  /** Clicks the confirm/finish button to submit the order. */
  async confirmOrder() {
    await this.confirmOrderButton.click();
  }

  /** Waits for the order confirmation success message to be visible. */
  async expectOrderConfirmed() {
    await this.orderConfirmation.waitFor({ state: 'visible' });
  }

  /** Clicks the first "Proceed to checkout" button (step 1). */
  async proceedToCheckout1() {
    await this.proceedToCheckout1Button.click();
  }

  /** Clicks the second "Proceed to checkout" button (step 2). */
  async proceedToCheckout2() {
    await this.proceedToCheckout2Button.click();
  }

  /** Clicks the third "Proceed to checkout" button (step 3). */
  async proceedToCheckout3() {
    await this.proceedToCheckout3Button.click();
  }
}

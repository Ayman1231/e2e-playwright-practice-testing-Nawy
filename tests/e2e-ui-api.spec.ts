import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import {
  createUserViaApi,
  loginViaApi,
  getProductIdByName,
  createCart,
  addProductToCart,
  createInvoiceViaApi,
} from '../src/api/apiClient';

function randomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@example.com`;
}

function randomPassword(): string {
  return `Aa1!${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
const BILLING = {
  first: 'Ayman',
  last: 'Ibrahim',
  address: 'Street 1',
  city: 'City',
  state: 'State',
  postcode: '1234AA',
  country: 'Egypt',
};

test.describe('E2E: UI & API integrated flow', () => {
  test('Create user via API -> Login UI -> Add Ear Protection via API -> Checkout UI (Cash on delivery) -> Create invoice via API', async ({
    page,
    request,
  }) => {
    const email = randomEmail();
    const password = randomPassword();
    const userPayload = {
      first_name: BILLING.first,
      last_name: BILLING.last,
      email,
      password,
      dob: '1998-07-16',
      address: {
        street: BILLING.address,
        city: BILLING.city,
        state: BILLING.state,
        country: BILLING.country,
        postal_code: BILLING.postcode,
      },
    };

    // 1. Create user via API
    // --- Requirement: Validate response status and returned user data ---
    const registerResult = await createUserViaApi(request, userPayload);

    // Response status validation: API must return 201 Created for successful registration
    expect(registerResult.status).toBe(201);

    // Returned user data validation: response body must contain the user we created
    const user = registerResult.body;
    expect(user.email, 'Response must include user email').toBe(email);
    expect(user.first_name, 'Response must include first_name').toBe(userPayload.first_name);
    expect(user.last_name, 'Response must include last_name').toBe(userPayload.last_name);
  
    

    // 2. Log in via UI
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await loginPage.expectLoggedIn(userPayload.first_name, userPayload.last_name);

    // 3. Add "Ear Protection" to cart via API — authenticated context (cart assigned to the user from step 1)
    // Use page.request (not request) so API responses' cookies (e.g. cart_id) are stored in the browser; then checkout in step 4 sees the same cart.
    const loginResult = await loginViaApi(request, email, password);
    expect(loginResult.status).toBe(200);
    expect(loginResult.body.access_token).toBeTruthy();
    const token = loginResult.body.access_token;

    const productId = await getProductIdByName(request, 'Ear Protection');
    const pageRequest = page.request;
    const { cartId } = await createCart(pageRequest, token);
    const addResult = await addProductToCart(pageRequest, cartId, productId, 1, token);
    expect(addResult.status, 'Add to cart should succeed').toBe(200);
    expect(addResult.body.result, 'Add to cart response result').toBe('item added or updated');

    // App reads cart ID from sessionStorage. Set it so the checkout UI loads this cart.
    await page.evaluate((id: string) => {
      sessionStorage.setItem('cart_id', id);
    }, cartId);

    // 4. Complete payment via UI (same session as step 2)
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.gotoCart();
    await checkoutPage.proceedToCheckout1();
    await checkoutPage.proceedToCheckout2();
    await checkoutPage.proceedToCheckout3();
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmOrder();
    await checkoutPage.expectOrderConfirmed();

    // 5. Create invoice via API with full payload including payment_details (bank-transfer)
    const invoiceResult = await createInvoiceViaApi(
      request,
      {
        billing_street: BILLING.address,
        billing_city: BILLING.city,
        billing_state: BILLING.state,
        billing_country: BILLING.country,
        billing_postal_code: BILLING.postcode,
        payment_method: 'cash-on-delivery',
        payment_details: {},
        cart_id: cartId,
      },
      token
    );
    expect([201], 'Invoice creation should succeed').toContain(invoiceResult.status);
    expect(invoiceResult.body).toBeDefined();
  });
});

import type { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://api.practicesoftwaretesting.com';

/**
 * Registers a new user via the API. Sends the provided payload to the /users/register endpoint
 * and returns the response status and body.
 */
export async function createUserViaApi(
  request: APIRequestContext,
  payload: any
): Promise<{ status: number; body: any }> {
  const res = await request.post(`${API_BASE}/users/register`, {
    data: payload
  });
  const body = (await res.json());
  return { status: res.status(), body };
}

/**
 * Logs in a user via the API using email and password. Sends credentials to /users/login
 * and returns the response status and body (e.g. access token).
 */
export async function loginViaApi(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<{ status: number; body: any }> {
  const res = await request.post(`${API_BASE}/users/login`, {
    data: { email, password }
  });
  const body = (await res.json()) ;
  return { status: res.status(), body };
}

/**
 * Searches for a product by name via the products/search API. Returns the product ID
 * of the first matching product, or throws if no match is found.
 */
export async function getProductIdByName(
  request: APIRequestContext,
  productName: string
): Promise<string> {
  const res = await request.get(`${API_BASE}/products/search`, {
    params: { q: productName },
  });
  const json = (await res.json()) as { data?: { id: string; name: string }[] };
  const product = json.data?.find((p) => p.name.toLowerCase().includes(productName.toLowerCase()));
  if (!product?.id) throw new Error(`Product "${productName}" not found`);
  return product.id;
}

/**
 * Creates a new cart for the authenticated user. Requires a valid Bearer token.
 * Returns the response status and the created cart ID.
 */
export async function createCart(
  request: APIRequestContext,
  token: string
): Promise<{ status: number; cartId: string }> {
  const res = await request.post(`${API_BASE}/carts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    data: {},
  });
  const body = (await res.json());
  return { status: res.status(), cartId: body.id };
}

/**
 * Adds a product to an existing cart with the given quantity. Requires cart ID,
 * product ID, quantity, and a valid Bearer token. Returns the response status and body.
 */
export async function addProductToCart(
  request: APIRequestContext,
  cartId: string,
  product_id: string,
  quantity: number,
  token: string
): Promise<{ status: number; body: any }> {
  const res = await request.post(`${API_BASE}/carts/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    data: { product_id, quantity },
  });
  const body = (await res.json());
  return { status: res.status(), body };
}

/**
 * Creates an invoice via the API with the provided payload. Requires a valid Bearer token.
 * Returns the response status and body.
 */
export async function createInvoiceViaApi(
  request: APIRequestContext,
  payload: any,
  token: string
): Promise<{ status: number; body: unknown }> {
  const res = await request.post(`${API_BASE}/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
    data: payload
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status(), body };
}

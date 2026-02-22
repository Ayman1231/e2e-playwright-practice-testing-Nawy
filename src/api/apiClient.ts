import type { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://api.practicesoftwaretesting.com';


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

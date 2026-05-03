import { expect, test } from '@playwright/test';

test.describe('landing page', () => {
  test('renders the hero, comparison table, and self-host CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('without');

    // Comparison table is the trust-builder
    await expect(page.getByRole('cell', { name: /open source/i })).toBeVisible();
    await expect(page.getByText(/docker compose up/i).first()).toBeVisible();
  });

  test('header links to /new', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /new room/i }).first().click();
    await expect(page).toHaveURL(/\/new$/);
    await expect(page.getByRole('heading', { name: /start a meeting/i })).toBeVisible();
  });

  test('serves a security-conscious response', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    const headers = res?.headers() ?? {};
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
  });
});

test.describe('not-found', () => {
  test('an invalid room code lands on the not-found page', async ({ page }) => {
    await page.goto('/r/zzzz-zzzz-zzzz', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/room not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /new meeting/i })).toBeVisible();
  });
});

test.describe('healthz', () => {
  test('returns ok', async ({ request }) => {
    const r = await request.get('/api/healthz');
    expect(r.status()).toBe(200);
    const body = await r.json();
    expect(body).toMatchObject({ status: 'ok', service: 'liqaa-meet' });
    expect(typeof body.ts).toBe('number');
  });
});

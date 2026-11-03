import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { catalog } from '../../src/domain/catalog';

async function fits(page: Page, context: string) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth, context).toBeLessThanOrEqual(
    dimensions.clientWidth,
  );
}
async function audit(page: Page, context: string) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      targets: v.nodes.map((node) => node.target),
    })),
    context,
  ).toEqual([]);
}
async function beginCheckout(page: Page) {
  await page.goto('products/pleat-01/');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Open bag, 1 pieces' }).click();
  await page
    .getByRole('dialog', { name: /Your bag/ })
    .getByRole('link', { name: 'Continue to demo checkout' })
    .click();
}
async function details(page: Page, maximum = false) {
  await page
    .getByLabel('Full name')
    .fill(maximum ? 'A'.repeat(100) : 'Alex Morgan');
  await page
    .getByLabel('Email address')
    .fill(
      maximum
        ? `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`
        : 'alex@example.com',
    );
  await page
    .getByLabel('Street and number')
    .fill(maximum ? 'S'.repeat(160) : '18 Example Street');
  await page.getByLabel('City').fill(maximum ? 'C'.repeat(100) : 'Milan');
  await page.getByLabel('Postal code').fill(maximum ? '1'.repeat(16) : '20121');
  await page.getByLabel('Country').selectOption('Italy');
}
async function doubleCriticalText(page: Page) {
  const ratios = await page.evaluate(() => {
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        'main h1,main h2,main h3,main p,main label,main input,main select,main button,main a,main dt,main dd,main output',
      ),
    ];
    const sizes = elements.map((element) => ({
      element,
      size: Number(
        element.dataset.criticalBaseSize ??
          Number.parseFloat(getComputedStyle(element).fontSize),
      ),
    }));
    for (const { element, size } of sizes) {
      element.dataset.criticalBaseSize = String(size);
      element.style.fontSize = `${size * 2}px`;
    }
    return sizes.map(
      ({ element, size }) =>
        Number.parseFloat(getComputedStyle(element).fontSize) / size,
    );
  });
  expect(ratios.every((ratio) => Math.abs(ratio - 2) < 0.01)).toBe(true);
}

test('all exported routes load assets, pass Axe and reflow against the actual layout viewport', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const paths = [
    '',
    'collection/',
    'approach/',
    'size-guide/',
    'bag/',
    'wishlist/',
    'checkout/',
    ...catalog.map((product) => `products/${product.id}/`),
    '404.html',
  ];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const path of paths) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await fits(page, `${path || 'home'} at ${width}px`);
      if (width === 390 || width === 1440)
        await audit(page, `${path || 'home'} at ${width}px`);
    }
  }
  expect(errors).toEqual([]);
});

test('dialogs, mobile navigation and checkout states remain keyboard accessible and pass Axe', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await audit(page, 'mobile menu');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await page.goto('products/pleat-01/');
  const opener = page.getByRole('button', { name: 'Enlarge Pleat 01 in Ink' });
  await opener.focus();
  await page.keyboard.press('Enter');
  await audit(page, 'image gallery');
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await beginCheckout(page);
  await audit(page, 'delivery');
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await audit(page, 'invalid details');
  await details(page);
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await audit(page, 'review');
  await page.getByRole('button', { name: 'Confirm demo' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your edit is confirmed.' }),
  ).toBeFocused();
  await audit(page, 'confirmation');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('');
  await page.getByRole('button', { name: 'Open bag, 0 pieces' }).click();
  const durations = await page
    .getByRole('dialog', { name: /Your bag/ })
    .evaluate((element) =>
      element
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .map((animation) => animation.effect?.getComputedTiming().duration),
    );
  expect(
    durations.every(
      (duration) => typeof duration === 'number' && duration <= 1,
    ),
  ).toBe(true);
});

test('long product copy and maximum valid contact fields reflow with doubled critical text', async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('products/pleat-01/');
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('heading', { level: 1 }).evaluate((element) => {
      element.textContent = 'A'.repeat(100);
    });
    await doubleCriticalText(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'A'.repeat(100),
    );
    await fits(page, `long product copy and doubled text at ${width}px`);
    const add = page.getByRole('button', { name: 'Add to bag', exact: true });
    await add.scrollIntoViewIfNeeded();
    await expect(add).toBeInViewport();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await beginCheckout(page);
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await details(page, true);
  await doubleCriticalText(page);
  await fits(page, 'maximum details with doubled text');
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await doubleCriticalText(page);
  await fits(page, 'maximum review with doubled text');
  await page.getByRole('button', { name: 'Confirm demo' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your edit is confirmed.' }),
  ).toBeVisible();
  await doubleCriticalText(page);
  await fits(page, 'maximum confirmation with doubled text');
  const reset = page.getByRole('button', { name: 'Reset demo selections' });
  await reset.scrollIntoViewIfNeeded();
  await expect(reset).toBeInViewport();
  await reset.click();
  await expect(
    page.getByRole('heading', { name: 'Your edit is confirmed.' }),
  ).toBeVisible();
  await fits(page, 'maximum confirmation after reset');
});

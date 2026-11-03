import { test, expect } from '@playwright/test';

test('discover a piece, choose real variants, merge quantities within stock and restore saved selections', async ({
  page,
}) => {
  await page.goto('products/pleat-01/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pleat 01');
  const variants = page.getByRole('group', {
    name: 'Choose colour and material',
  });
  const oxbloodChoice = variants.getByRole('button', { name: /Oxblood/ });
  if (test.info().project.use.hasTouch) await oxbloodChoice.tap();
  else await oxbloodChoice.click();
  await expect(page).toHaveURL(/variant=oxblood-grain/);
  await expect(
    page
      .getByRole('button', { name: 'Enlarge Pleat 01 in Oxblood' })
      .locator('img'),
  ).toHaveAttribute('src', /pleat-oxblood.webp/);
  await page
    .getByRole('button', { name: 'Increase Pleat 01 selected', exact: true })
    .click();
  const addButton = page.getByRole('button', {
    name: 'Add to bag',
    exact: true,
  });
  if (test.info().project.use.hasTouch) await addButton.tap();
  else await addButton.click();
  await expect(
    page.getByRole('status').filter({ hasText: '2 Pleat 01 in Oxblood added' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Open bag, 3 pieces' }).click();
  const bag = page.getByRole('dialog', { name: /Your bag/ });
  await expect(bag.getByRole('article')).toHaveCount(1);
  await expect(
    bag.getByRole('button', { name: 'Increase Pleat 01 Oxblood', exact: true }),
  ).toBeDisabled();
  await bag.getByRole('button', { name: 'Close bag' }).click();
  await variants.getByRole('button', { name: /Ink/ }).click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page
    .getByRole('button', { name: 'Save Pleat 01 in Ink', exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open bag, 4 pieces' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open bag, 4 pieces' }).click();
  await expect(
    page.getByRole('dialog', { name: /Your bag/ }).getByRole('article'),
  ).toHaveCount(2);
  await expect(
    page
      .getByRole('dialog', { name: /Your bag/ })
      .getByText('€2,760', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('dialog', { name: /Your bag/ })
    .getByRole('button', { name: 'Close bag' })
    .click();
  await page
    .getByRole('link', { name: 'Saved pieces (1)', exact: true })
    .click();
  await expect(
    page.getByRole('link', { name: 'Explore Pleat 01 in Ink' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Unsave Pleat 01 in Ink', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('rapid same-turn filters compose current URL selections and survive history and reload', async ({
  page,
}) => {
  await page.goto('collection/');
  await expect(
    page.getByRole('button', { name: 'Save Pleat 01 in Ink', exact: true }),
  ).toBeEnabled();
  await page.evaluate(() => {
    const change = (id: string, value: string) => {
      const select = document.getElementById(id);
      if (!(select instanceof HTMLSelectElement))
        throw new Error('Expected filter');
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };
    change('filter-material', 'grain-leather');
    change('filter-color', 'ink');
    change('filter-price', '700');
  });
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('material') === 'grain-leather' &&
      url.searchParams.get('color') === 'ink' &&
      url.searchParams.get('price') === '700',
  );
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: 'Explore Pleat 01 in Ink' }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('article')).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel('Material', { exact: true })).toHaveValue(
    'grain-leather',
  );
  await expect(page.getByLabel('Colour', { exact: true })).toHaveValue('ink');
  await page.getByLabel('Colour', { exact: true }).selectOption('ivory');
  await expect(
    page.getByRole('heading', { name: 'A different combination, perhaps.' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Return to the full collection' })
    .click();
  await expect(page.getByRole('article')).toHaveCount(8);
});

test('gallery keyboard wraps, Escape restores focus, and late close does not dismiss a reopened bag', async ({
  page,
}) => {
  await page.goto('products/pleat-01/?variant=oxblood-grain');
  const opener = page.getByRole('button', {
    name: 'Enlarge Pleat 01 in Oxblood',
  });
  await opener.focus();
  await page.keyboard.press('Enter');
  const gallery = page.getByRole('dialog', { name: 'Pleat 01 / Oxblood' });
  await expect(gallery).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(gallery.getByText('2 / 2', { exact: true })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(gallery.getByText('1 / 2', { exact: true })).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(
    gallery.getByRole('button', { name: 'Close image gallery' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(gallery).not.toBeVisible();
  await expect(opener).toBeFocused();
  const trigger = page.getByRole('button', { name: 'Open bag, 0 pieces' });
  await trigger.click();
  const bag = page.getByRole('dialog', { name: /Your bag/ });
  await bag.getByRole('button', { name: 'Close bag' }).click();
  await trigger.click();
  await expect(bag).toBeVisible();
  await bag.evaluate((dialog) => dialog.dispatchEvent(new Event('close')));
  await expect(bag).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(bag).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('unavailable material remains inspectable and saveable while purchase is disabled', async ({
  page,
}) => {
  await page.goto('products/meridian-02/?variant=espresso-suede');
  await expect(
    page.getByRole('button', { name: 'Currently unavailable', exact: true }),
  ).toBeDisabled();
  await expect(
    page
      .getByRole('button', { name: 'Enlarge Meridian 02 in Espresso' })
      .locator('img'),
  ).toHaveAttribute('src', /meridian-espresso-suede.webp/);
  await page
    .getByRole('button', { name: 'Save Meridian 02 in Espresso', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Unsave Meridian 02 in Espresso',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('delivery, validated details and local confirmation retain a fixed snapshot after resetting shared selections', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'another-portfolio-demo-sentinel',
      'keep-this-other-demo',
    ),
  );
  await page.goto('products/pleat-01/');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('button', { name: 'Open bag, 1 pieces' }).click();
  await page
    .getByRole('dialog', { name: /Your bag/ })
    .getByRole('link', { name: 'Continue to demo checkout' })
    .click();
  await page.getByRole('radio', { name: /Express delivery/ }).check();
  await expect(page.locator('[data-demo-total]')).toHaveText('€708');
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await expect(page.getByLabel('Full name')).toBeFocused();
  await expect(
    page
      .getByRole('region', { name: 'A few final details.' })
      .getByRole('alert'),
  ).toHaveText('Please check the highlighted details.');
  await page.getByLabel('Full name').fill('Alex Morgan');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('Street and number').fill('18 Example Street');
  await page.getByLabel('City').fill('Milan');
  await page.getByLabel('Postal code').fill('20121');
  await page.getByLabel('Country').selectOption('Italy');
  await page.getByLabel('Email address').fill('alex<smith>@example.com');
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await expect(page.getByLabel('Email address')).toBeFocused();
  await expect(page.getByLabel('Email address')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByRole('button', { name: 'Review your selection' }).click();
  await expect(
    page.getByRole('heading', { name: 'One last look.' }),
  ).toBeFocused();
  const requests: { method: string; url: string; body: string | null }[] = [];
  page.on('request', (request) =>
    requests.push({
      method: request.method(),
      url: request.url(),
      body: request.postData(),
    }),
  );
  await page.getByRole('button', { name: 'Confirm demo' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your edit is confirmed.' }),
  ).toBeFocused();
  await expect(page.locator('[data-demo-total]')).toHaveText('€708');
  await expect(
    page.getByRole('button', { name: 'Open bag, 0 pieces' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo selections' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your edit is confirmed.' }),
  ).toBeVisible();
  await expect(page.locator('[data-demo-total]')).toHaveText('€708');
  expect(
    requests.filter((request) => !['GET', 'HEAD'].includes(request.method)),
  ).toEqual([]);
  for (const request of requests) {
    const transmitted = `${request.url} ${request.body ?? ''}`;
    expect(transmitted).not.toContain('alex@example.com');
    expect(transmitted).not.toContain('alex%40example.com');
    expect(transmitted).not.toMatch(/Alex(?:%20|\+| )Morgan/);
  }
  const stored = await page.evaluate(() => ({
    sentinel: localStorage.getItem('another-portfolio-demo-sentinel'),
    own: localStorage.getItem('erdenvaux-selections-v1'),
  }));
  expect(stored.sentinel).toBe('keep-this-other-demo');
  expect(JSON.parse(stored.own ?? 'null')).toEqual({
    version: 1,
    cart: [],
    wishlist: [],
  });
  expect(stored.own).not.toContain('Alex');
  expect(stored.own).not.toContain('example.com');
});

test('comparison uses actual body bounds at one scale and updates selected silhouettes', async ({
  page,
}) => {
  await page.goto('size-guide/');
  const measured = await page
    .locator('[data-comparison-body]')
    .evaluateAll((groups) =>
      groups.map((group) => {
        if (!(group instanceof SVGGElement))
          throw new Error('Expected SVG body group');
        const body = group;
        const box = body.getBBox();
        const matrix = body.getScreenCTM();
        return {
          id: body.dataset.comparisonBody,
          width: box.width,
          height: box.height,
          widthCm: Number(body.dataset.widthCm),
          heightCm: Number(body.dataset.heightCm),
          scaleX: matrix?.a,
          scaleY: matrix?.d,
        };
      }),
    );
  expect(measured).toHaveLength(2);
  for (const body of measured) {
    expect(body.width).toBeCloseTo(body.widthCm, 5);
    expect(body.height).toBeCloseTo(body.heightCm, 5);
  }
  expect(measured[0]?.scaleX).toBeCloseTo(measured[1]!.scaleX!, 5);
  expect(measured[0]?.scaleY).toBeCloseTo(measured[1]!.scaleY!, 5);
  await page.getByLabel('First silhouette').selectOption('halo-03');
  await page.getByLabel('Second silhouette').selectOption('column-08');
  await expect(page.getByRole('heading', { name: 'Halo 03' })).toBeVisible();
  await expect(
    page.getByText('23 × 24 × 7 cm', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Column 08' })).toBeVisible();
});

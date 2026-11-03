import { test, expect } from '@playwright/test';

test('discover a piece, choose real variants, merge quantities within stock and restore saved selections', async ({
  page,
}) => {
  await page.goto('products/pleat-01/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pleat 01');
  const variants = page.getByRole('group', {
    name: 'Choose colour and material',
  });
  await variants.getByRole('button', { name: /Oxblood/ }).click();
  await expect(page).toHaveURL(/variant=oxblood-grain/);
  await expect(
    page
      .getByRole('button', { name: 'Enlarge Pleat 01 in Oxblood' })
      .locator('img'),
  ).toHaveAttribute('src', /pleat-oxblood.webp/);
  await page
    .getByRole('button', { name: 'Increase Pleat 01 selected', exact: true })
    .click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
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

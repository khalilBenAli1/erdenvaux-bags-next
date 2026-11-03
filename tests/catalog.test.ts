import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { catalog } from '../src/domain/catalog';
import { parseFilters, filterProducts } from '../src/domain/filters';
describe('canonical catalog and filtering', () => {
  it('retains all exact fixture/media identity and body dimensions from the approved brief', () => {
    const brief: unknown = JSON.parse(
      readFileSync('docs/PRODUCT_IMAGE_BRIEF.json', 'utf8'),
    );
    if (!brief || typeof brief !== 'object' || !('products' in brief))
      throw new Error('Invalid reference brief');
    expect(catalog).toHaveLength(8);
    const canonical = catalog.map(
      ({ category, description, details, ...product }) => {
        expect(category).toBeTruthy();
        expect(description.length).toBeGreaterThan(40);
        expect(details.length).toBeGreaterThan(1);
        return product;
      },
    );
    expect(canonical).toEqual(brief.products);
    const images = catalog.flatMap((p) => p.variants.map((v) => v.image));
    expect(new Set(images).size).toBe(10);
    for (const image of images) {
      expect(existsSync(`public/images/${image}`)).toBe(true);
      expect(
        existsSync(`public/images/${image.replace('.webp', '-small.webp')}`),
      ).toBe(true);
    }
  });
  it('matches color and material on the same actual variant', () => {
    expect(
      filterProducts(parseFilters('?material=suede&color=oxblood')),
    ).toEqual([]);
    const selected = filterProducts(
      parseFilters('?material=grain-leather&color=ink&price=700'),
    );
    expect(selected.map((p) => p.id)).toEqual(['pleat-01']);
  });
  it('sorts without mutating catalog order and normalizes unsupported filters', () => {
    const before = catalog.map((p) => p.id);
    expect(filterProducts(parseFilters('?sort=price-asc'))[0]?.id).toBe(
      'fold-05',
    );
    expect(catalog.map((p) => p.id)).toEqual(before);
    expect(
      filterProducts(parseFilters('?silhouette=unknown&price=-1&sort=unsafe')),
    ).toHaveLength(8);
  });
});

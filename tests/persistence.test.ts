import { describe, expect, it } from 'vitest';
import {
  decodeSaved,
  encodeSaved,
  STORAGE_KEY,
} from '../src/domain/persistence';
import {
  readSelections,
  saveSelections,
  type SelectionStorage,
} from '../src/adapters/persistence';
const saved = {
  cart: [{ productId: 'pleat-01', variantId: 'ink-grain', quantity: 2 }],
  wishlist: [{ productId: 'meridian-02', variantId: 'espresso-suede' }],
};
const envelope = () => ({
  version: 1,
  cart: saved.cart.map((line) => ({ ...line })),
  wishlist: saved.wishlist.map((item) => ({ ...item })),
});
describe('validated versioned selection persistence', () => {
  it('round-trips only bag/wishlist fields', () => {
    const encoded = encodeSaved(saved);
    expect(decodeSaved(encoded)).toEqual(saved);
    expect(Object.keys(JSON.parse(encoded))).toEqual([
      'version',
      'cart',
      'wishlist',
    ]);
    expect(encoded).not.toContain('email');
  });
  it.each([
    '{broken',
    'null',
    '[]',
    '',
    JSON.stringify({ ...envelope(), version: 2 }),
    JSON.stringify({ ...envelope(), email: 'sample@example.com' }),
    'x'.repeat(20001),
  ])(
    'rejects malformed, unknown-version, extraneous or oversized payload',
    (raw) => expect(decodeSaved(raw)).toBeNull(),
  );
  it.each([0, -2, 1.5, 5, '2', null])(
    'rejects a mutated quantity %s',
    (quantity) => {
      const value = { ...envelope(), cart: [{ ...saved.cart[0], quantity }] };
      expect(decodeSaved(JSON.stringify(value))).toBeNull();
    },
  );
  it('rejects changed identifiers, unavailable stock, duplicates and extra persisted money', () => {
    for (const cart of [
      [{ ...saved.cart[0], productId: 'unknown' }],
      [{ ...saved.cart[0], variantId: 'unknown' }],
      [{ productId: 'meridian-02', variantId: 'espresso-suede', quantity: 1 }],
      [...saved.cart, ...saved.cart],
      [{ ...saved.cart[0], priceCents: 1 }],
    ])
      expect(decodeSaved(JSON.stringify({ ...envelope(), cart }))).toBeNull();
    expect(
      decodeSaved(
        JSON.stringify({
          ...envelope(),
          wishlist: [...saved.wishlist, ...saved.wishlist],
        }),
      ),
    ).toBeNull();
  });
  it('recovers from corrupt and blocked reads without throwing or retaining data', () => {
    const bad: SelectionStorage = { getItem: () => '{bad', setItem: () => {} };
    expect(readSelections(bad)).toEqual({
      data: { cart: [], wishlist: [] },
      status: 'recovered',
    });
    const blocked: SelectionStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readSelections(blocked)).toEqual({
      data: { cart: [], wishlist: [] },
      status: 'unavailable',
    });
    expect(saveSelections(blocked, saved)).toBe(false);
    expect(readSelections(null).status).toBe('unavailable');
  });
  it('writes a recoverable envelope and distinguishes a fresh saved selection', () => {
    const values = new Map<string, string>();
    const storage: SelectionStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => {
        values.set(key, value);
      },
    };
    expect(readSelections(storage).status).toBe('ready');
    expect(saveSelections(storage, saved)).toBe(true);
    expect(values.has(STORAGE_KEY)).toBe(true);
    expect(readSelections(storage)).toEqual({
      data: saved,
      status: 'restored',
    });
  });
});

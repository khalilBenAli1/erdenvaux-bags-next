import { describe, expect, it } from 'vitest';
import {
  emptyCustomer,
  validateCustomer,
  validEmail,
} from '../src/domain/customer';
import { createConfirmation } from '../src/domain/order';
import { createCommerceStore } from '../src/state/commerce-store';
const customer = {
  fullName: 'Alex Morgan',
  email: 'alex@example.com',
  address: '18 Example Street',
  city: 'Milan',
  postalCode: '20121',
  country: 'Italy',
};
const metadata = {
  reference: 'EV-DEMO-TEST0001',
  createdAt: '2026-11-03T12:00:00.000Z',
};
const selection = { productId: 'pleat-01', variantId: 'ink-grain' };
describe('local checkout contract', () => {
  it('validates required sample details and exact long-field boundaries', () => {
    expect(Object.keys(validateCustomer(emptyCustomer()))).toHaveLength(6);
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`;
    expect(email).toHaveLength(254);
    expect(validEmail(email)).toBe(true);
    expect(
      validateCustomer({
        ...customer,
        fullName: 'A'.repeat(100),
        email,
        address: 'A'.repeat(160),
        city: 'C'.repeat(100),
        postalCode: '1'.repeat(16),
      }),
    ).toEqual({});
    expect(
      validateCustomer({ ...customer, fullName: 'A'.repeat(101) }),
    ).toHaveProperty('fullName');
    expect(
      validateCustomer({ ...customer, email: `a${email}` }),
    ).toHaveProperty('email');
  });
  it.each([
    'a@',
    'a@b',
    'a@@example.com',
    'alex<smith>@example.com',
    'alex,smith@example.com',
    'alex:smith@example.com',
    '"alex"@example.com',
    `${'a'.repeat(65)}@example.com`,
    'a..b@example.com',
    'alex@-example.com',
    `alex@${'a'.repeat(64)}.com`,
  ])('rejects malformed common email %s', (email) =>
    expect(validEmail(email)).toBe(false),
  );
  it('retains supported plus and dot addresses', () => {
    expect(validEmail('alex.smith+studio@example.com')).toBe(true);
  });
  it('rejects whitespace-only fields and unsupported delivery countries', () => {
    expect(
      validateCustomer({
        ...customer,
        fullName: '  ',
        address: '     ',
        city: '  ',
        postalCode: ' ',
        country: 'Unknown',
      }),
    ).toEqual(
      expect.objectContaining({
        fullName: expect.any(String),
        address: expect.any(String),
        city: expect.any(String),
        postalCode: expect.any(String),
        country: expect.any(String),
      }),
    );
  });
  it('creates a deep immutable confirmation independent of subsequent bag reset and input edits', () => {
    const store = createCommerceStore();
    store.getState().add(selection, 2);
    const details = { ...customer };
    const order = createConfirmation(
      store.getState().cart,
      details,
      'express',
      metadata,
    );
    store.getState().reset();
    store
      .getState()
      .add({ productId: 'meridian-02', variantId: 'oxblood-smooth' }, 1);
    details.fullName = 'Someone else';
    expect(order.customer.fullName).toBe('Alex Morgan');
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0]?.quantity).toBe(2);
    expect(order.totals).toEqual({
      subtotalCents: 138000,
      deliveryCents: 1800,
      totalCents: 139800,
      itemCount: 2,
    });
    expect(Object.isFrozen(order)).toBe(true);
    expect(Object.isFrozen(order.customer)).toBe(true);
    expect(Object.isFrozen(order.delivery)).toBe(true);
    expect(Object.isFrozen(order.totals)).toBe(true);
    expect(Object.isFrozen(order.lines)).toBe(true);
    expect(Object.isFrozen(order.lines[0])).toBe(true);
  });
  it('refuses empty, invalid-stock or invalid-customer confirmation attempts', () => {
    expect(() =>
      createConfirmation([], customer, 'standard', metadata),
    ).toThrow();
    expect(() =>
      createConfirmation(
        [{ ...selection, quantity: 5 }],
        customer,
        'standard',
        metadata,
      ),
    ).toThrow();
    expect(() =>
      createConfirmation(
        [{ ...selection, quantity: 1 }],
        emptyCustomer(),
        'standard',
        metadata,
      ),
    ).toThrow();
  });
});

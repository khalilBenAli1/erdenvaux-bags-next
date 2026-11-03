export const countries = [
  'France',
  'Italy',
  'Germany',
  'Netherlands',
  'Belgium',
  'Spain',
  'Ireland',
] as const;
export const customerKeys = [
  'fullName',
  'email',
  'address',
  'city',
  'postalCode',
  'country',
] as const;
export type CustomerKey = (typeof customerKeys)[number];
export type Customer = Record<CustomerKey, string>;
export type CustomerErrors = Partial<Record<CustomerKey, string>>;
export const customerLimits = {
  fullName: 100,
  email: 254,
  address: 160,
  city: 100,
  postalCode: 16,
} as const;
export const emptyCustomer = (): Customer => ({
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
});
export function validEmail(raw: string): boolean {
  const value = raw.trim();
  if (value.length > 254 || value.length < 6) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const local = parts[0];
  const domain = parts[1];
  if (
    !local ||
    !domain ||
    local.length > 64 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) ||
    /\s/.test(value) ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..')
  )
    return false;
  const labels = domain.split('.');
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length >= 1 &&
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
    ) &&
    (labels.at(-1)?.length ?? 0) >= 2
  );
}
export function validateCustomer(customer: Customer): CustomerErrors {
  const errors: CustomerErrors = {};
  const length = (key: CustomerKey, min: number, max: number) => {
    const size = customer[key].trim().length;
    return size >= min && size <= max;
  };
  if (!length('fullName', 2, 100))
    errors.fullName = 'Enter a name between 2 and 100 characters.';
  if (!validEmail(customer.email))
    errors.email = 'Enter a valid email address, up to 254 characters.';
  if (!length('address', 5, 160))
    errors.address = 'Enter a sample address between 5 and 160 characters.';
  if (!length('city', 2, 100))
    errors.city = 'Enter a city between 2 and 100 characters.';
  if (!length('postalCode', 2, 16))
    errors.postalCode = 'Enter a postal code between 2 and 16 characters.';
  if (!countries.some((country) => country === customer.country))
    errors.country = 'Choose a sample delivery country.';
  return errors;
}
export const normalizeCustomer = (customer: Customer): Customer => ({
  fullName: customer.fullName.trim(),
  email: customer.email.trim(),
  address: customer.address.trim(),
  city: customer.city.trim(),
  postalCode: customer.postalCode.trim(),
  country: customer.country,
});

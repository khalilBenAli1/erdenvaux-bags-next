import type { Metadata } from 'next';
import { Checkout } from '@/features/checkout/Checkout';
export const metadata: Metadata = {
  title: 'Demo checkout',
  robots: { index: false, follow: false },
};
export default function CheckoutPage() {
  return (
    <div className="wrap">
      <Checkout />
    </div>
  );
}

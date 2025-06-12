import StandardFulfillmentCalculator from '@/components/calculators/StandardFulfillmentCalculator';

export const metadata = {
  title: 'Standard Fulfillment Calculator | ecom3pl',
  description: 'Calculate receiving, storage, pick & pack, and shipping costs for standard e-commerce fulfillment.'
};

export default function StandardFulfillmentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <StandardFulfillmentCalculator />
    </div>
  );
} 
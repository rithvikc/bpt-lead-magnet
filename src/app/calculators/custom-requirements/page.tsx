import CustomRequirementsCalculator from '@/components/calculators/CustomRequirementsCalculator';

export const metadata = {
  title: 'Custom Requirements Quote | ecom3pl',
  description: 'Request a custom quote for specialized 3PL fulfillment services including kitting, custom packaging, and more.'
};

export default function CustomRequirementsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <CustomRequirementsCalculator />
    </div>
  );
} 
import FreeShippingCalculator from "@/components/calculators/FreeShippingCalculator";

export const metadata = {
  title: 'Free Shipping Calculator | BPT Fulfillment',
  description: 'Calculate the optimal free shipping threshold for your ecommerce business based on your unit economics and shipping costs.'
};

export default function FreeShippingCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <FreeShippingCalculator />
    </div>
  );
} 
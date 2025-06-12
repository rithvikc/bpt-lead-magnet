import ReceivingCalculator from "@/components/calculators/ReceivingCalculator";

export const metadata = {
  title: 'Receiving Calculator | BPT Fulfillment',
  description: 'Calculate costs for receiving incoming inventory pallets, cartons, and units with our 3PL receiving calculator.'
};

export default function ReceivingCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <ReceivingCalculator />
    </div>
  );
} 
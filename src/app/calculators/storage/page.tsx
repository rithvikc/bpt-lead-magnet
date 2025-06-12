import StorageCalculator from "@/components/calculators/StorageCalculator";

export const metadata = {
  title: 'Storage Calculator | BPT Fulfillment',
  description: 'Calculate monthly and long-term storage costs for your inventory with our 3PL storage calculator.'
};

export default function StorageCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <StorageCalculator />
    </div>
  );
} 
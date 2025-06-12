import PickPackCalculator from "@/components/calculators/PickPackCalculator";

export const metadata = {
  title: 'Pick & Pack Calculator | BPT Fulfillment',
  description: 'Calculate order fulfillment costs including picking, packing, and packaging with our 3PL pick & pack calculator.'
};

export default function PickPackCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <PickPackCalculator />
    </div>
  );
} 
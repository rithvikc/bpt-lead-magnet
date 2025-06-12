import Link from "next/link";

export const metadata = {
  title: '3PL Pricing Calculators | BPT Fulfillment',
  description: 'Calculate pricing for all 3PL services including receiving, storage, pick & pack, and more.'
};

export default function CalculatorsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center">3PL Pricing Calculators</h1>
        <p className="text-lg text-center text-foreground/80 max-w-3xl mx-auto mb-12">
          Use our specialized calculators to get accurate pricing for each of our 3PL services.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Receiving Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate costs for receiving incoming inventory, pallets, cartons, and units.
            </p>
            <div className="mt-4">
              <Link href="/calculators/receiving" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Receiving Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Storage Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate monthly and long-term storage costs for your inventory.
            </p>
            <div className="mt-4">
              <Link href="/calculators/storage" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Storage Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Pick & Pack Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate order fulfillment costs including picking, packing, and packaging.
            </p>
            <div className="mt-4">
              <Link href="/calculators/pick-pack" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Pick & Pack Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Prep Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate costs for preparation services such as labeling, bundling, and more.
            </p>
            <div className="mt-4">
              <Link href="/calculators/prep" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Prep Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Palletization Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate palletizing and wrapping costs for your shipments.
            </p>
            <div className="mt-4">
              <Link href="/calculators/palletization" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Palletization Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Pallet Forwarding</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate shipping costs for pallet-level shipments to any destination.
            </p>
            <div className="mt-4">
              <Link href="/calculators/pallet-forwarding" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Shipping Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Master Cartons</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate costs for creating master cartons from individual units.
            </p>
            <div className="mt-4">
              <Link href="/calculators/master-cartons" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Master Carton Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Carton Forwarding</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate small parcel shipping costs for carton-level shipments.
            </p>
            <div className="mt-4">
              <Link href="/calculators/carton-forwarding" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Shipping Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Count Units</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Calculate inventory counting service costs for your SKUs.
            </p>
            <div className="mt-4">
              <Link href="/calculators/count-units" className="btn btn-primary px-4 py-2 w-full block text-center">
                Calculate Counting Costs
              </Link>
            </div>
          </div>
          
          <div className="card p-6 border-2 border-primary hover:shadow-md transition-shadow">
            <h3 className="text-xl font-serif mb-3">Master Calculator</h3>
            <p className="text-foreground/70 mb-4 h-16">
              Comprehensive pricing for all 3PL services in one calculator with volume discounts.
            </p>
            <div className="mt-4">
              <Link href="/calculators/master" className="btn btn-primary px-4 py-2 w-full block text-center">
                Use Master Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
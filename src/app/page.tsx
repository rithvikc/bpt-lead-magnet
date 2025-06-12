import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 px-6 md:px-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif mb-4">
              3PL Fulfillment Pricing Calculator
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
              Get instant, accurate pricing for all BPT Fulfillment services. Calculate costs for receiving, storage, pick & pack, shipping and more.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
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
                <h3 className="text-xl font-serif mb-3">Master Calculator</h3>
                <p className="text-foreground/70 mb-4 h-16">
                  Comprehensive pricing for all 3PL services in one calculator.
                </p>
                <div className="mt-4">
                  <Link href="/calculators/master" className="btn btn-primary px-4 py-2 w-full block text-center">
                    Master Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-secondary py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 text-center">
              Why Choose Our 3PL Services?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-2">Transparent Pricing</h3>
                <p className="text-foreground/70">
                  No hidden fees or surprise charges. Our calculators provide clear, accurate pricing.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-2">Scalable Solutions</h3>
                <p className="text-foreground/70">
                  From startups to enterprise businesses, our fulfillment services scale with your needs.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-2">Fast Shipping</h3>
                <p className="text-foreground/70">
                  Strategic warehouse locations ensure quick delivery times to your customers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-6 text-center">
              Contact Us
            </h2>
            <p className="text-center text-foreground/80 mb-8">
              Have questions about our 3PL services? Get in touch with our team.
            </p>
            
            <div className="card p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary px-4 py-2">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
        </div>
        </section>
      </main>
    </div>
  );
}

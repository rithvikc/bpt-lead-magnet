"use client";

import { useState } from "react";

// Define pricing constants
const PICK_FEE_PER_ITEM = 0.75;
const PACK_FEE_PER_ORDER = 1.50;
const POLY_MAILER_COST = 0.25;
const SMALL_BOX_COST = 0.75;
const MEDIUM_BOX_COST = 1.25;
const LARGE_BOX_COST = 2.00;
const SPECIAL_HANDLING_FEE = 2.00;

// Define packaging types
type PackagingType = "Poly mailer" | "Small box" | "Medium box" | "Large box";

// Define the pick pack calculator state interface
interface PickPackState {
  monthlyOrderVolume: number;
  itemsPerOrder: number;
  packagingType: PackagingType;
  specialHandling: boolean;
  isSubmitted: boolean;
}

// Define the calculation results interface
interface CalculationResults {
  pickCost: number;
  packCost: number;
  packagingCost: number;
  specialHandlingCost: number;
  costPerOrder: number;
  monthlyTotal: number;
  annualProjection: number;
}

export default function PickPackCalculator() {
  // Initial state
  const initialState: PickPackState = {
    monthlyOrderVolume: 100,
    itemsPerOrder: 1.5,
    packagingType: "Poly mailer",
    specialHandling: false,
    isSubmitted: false,
  };

  // State for form inputs and validation
  const [state, setState] = useState<PickPackState>(initialState);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setState(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    // Handle numeric inputs
    if (type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Please enter a valid positive number'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setState(prev => ({
          ...prev,
          [name]: numValue
        }));
      }
      return;
    }
    
    // Handle other inputs (select)
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get packaging cost based on type
  const getPackagingCost = (type: PackagingType) => {
    switch (type) {
      case "Poly mailer":
        return POLY_MAILER_COST;
      case "Small box":
        return SMALL_BOX_COST;
      case "Medium box":
        return MEDIUM_BOX_COST;
      case "Large box":
        return LARGE_BOX_COST;
      default:
        return POLY_MAILER_COST;
    }
  };

  // Calculate pick and pack costs
  const calculateCosts = () => {
    const { monthlyOrderVolume, itemsPerOrder, packagingType, specialHandling } = state;
    
    // Calculate pick cost (per item)
    const pickCost = monthlyOrderVolume * itemsPerOrder * PICK_FEE_PER_ITEM;
    
    // Calculate pack cost (per order)
    const packCost = monthlyOrderVolume * PACK_FEE_PER_ORDER;
    
    // Calculate packaging cost
    const packagingCost = monthlyOrderVolume * getPackagingCost(packagingType);
    
    // Calculate special handling cost (if applicable)
    const specialHandlingCost = specialHandling ? monthlyOrderVolume * SPECIAL_HANDLING_FEE : 0;
    
    // Calculate cost per order
    const costPerOrder = (pickCost + packCost + packagingCost + specialHandlingCost) / monthlyOrderVolume;
    
    // Calculate monthly total
    const monthlyTotal = pickCost + packCost + packagingCost + specialHandlingCost;
    
    // Calculate annual projection
    const annualProjection = monthlyTotal * 12;
    
    // Return results object
    return {
      pickCost,
      packCost,
      packagingCost,
      specialHandlingCost,
      costPerOrder,
      monthlyTotal,
      annualProjection
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (state.monthlyOrderVolume <= 0) {
      newErrors.monthlyOrderVolume = "Please enter a valid monthly order volume";
    }
    
    if (state.itemsPerOrder <= 0) {
      newErrors.itemsPerOrder = "Please enter a valid number of items per order";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate and show results
    if (Object.keys(newErrors).length === 0) {
      const calculationResults = calculateCosts();
      setResults(calculationResults);
      setState(prev => ({ ...prev, isSubmitted: true }));
    }
  };

  // Handle reset
  const handleReset = () => {
    setState(initialState);
    setResults(null);
    setErrors({});
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-serif mb-4">Pick & Pack Calculator</h1>
      <p className="text-lg text-foreground/80 mb-8">
        Calculate order fulfillment costs including picking, packing, and packaging materials.
      </p>
      
      {!state.isSubmitted ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="monthlyOrderVolume" className="block text-sm font-medium mb-1">
                    Monthly Order Volume
                  </label>
                  <input
                    type="number"
                    id="monthlyOrderVolume"
                    name="monthlyOrderVolume"
                    value={state.monthlyOrderVolume}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.monthlyOrderVolume && (
                    <p className="text-red-500 text-sm mt-1">{errors.monthlyOrderVolume}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Number of orders processed per month
                  </p>
                </div>
                
                <div>
                  <label htmlFor="itemsPerOrder" className="block text-sm font-medium mb-1">
                    Average Items Per Order
                  </label>
                  <input
                    type="number"
                    id="itemsPerOrder"
                    name="itemsPerOrder"
                    value={state.itemsPerOrder}
                    onChange={handleInputChange}
                    min="0.1"
                    step="0.1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.itemsPerOrder && (
                    <p className="text-red-500 text-sm mt-1">{errors.itemsPerOrder}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Pick fee: {formatCurrency(PICK_FEE_PER_ITEM)} per item
                  </p>
                </div>
                
                <div>
                  <label htmlFor="packagingType" className="block text-sm font-medium mb-1">
                    Packaging Type
                  </label>
                  <select
                    id="packagingType"
                    name="packagingType"
                    value={state.packagingType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Poly mailer">Poly mailer ({formatCurrency(POLY_MAILER_COST)})</option>
                    <option value="Small box">Small box ({formatCurrency(SMALL_BOX_COST)})</option>
                    <option value="Medium box">Medium box ({formatCurrency(MEDIUM_BOX_COST)})</option>
                    <option value="Large box">Large box ({formatCurrency(LARGE_BOX_COST)})</option>
                  </select>
                  <p className="text-xs text-foreground/60 mt-1">
                    Pack fee: {formatCurrency(PACK_FEE_PER_ORDER)} per order + packaging materials
                  </p>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="specialHandling"
                      name="specialHandling"
                      checked={state.specialHandling}
                      onChange={handleInputChange}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="specialHandling" className="ml-2 block text-sm">
                      Special handling required? (+{formatCurrency(SPECIAL_HANDLING_FEE)} per order)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">What's Included:</h3>
                  <ul className="text-xs space-y-1 text-foreground/70">
                    <li>• Order processing in our system</li>
                    <li>• Item picking from warehouse locations</li>
                    <li>• Secure packaging of products</li>
                    <li>• Quality control checks</li>
                    <li>• Packaging materials (as selected)</li>
                    <li>• Order documentation and inserts</li>
                  </ul>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">Packaging Types:</h3>
                  <ul className="text-xs space-y-2 text-foreground/70">
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Poly mailer:</span>
                      <span>Lightweight, flexible packaging for soft goods or small items</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Small box:</span>
                      <span>Up to 10" x 8" x 4" for small items or 1-2 products</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Medium box:</span>
                      <span>Up to 14" x 12" x 6" for medium-sized orders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Large box:</span>
                      <span>Up to 18" x 16" x 8" for larger or multiple-item orders</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">Special Handling:</h3>
                  <p className="text-xs text-foreground/70">
                    Required for fragile items, special inserts, gift wrapping, 
                    custom packaging arrangements, or other non-standard fulfillment needs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline px-4 py-2"
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary px-6 py-2"
              >
                Calculate Costs
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="text-xl font-serif mb-4">Pick & Pack Cost Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    Picking ({state.monthlyOrderVolume * state.itemsPerOrder} items @ {formatCurrency(PICK_FEE_PER_ITEM)}/item)
                  </span>
                  <span className="font-medium">{formatCurrency(results?.pickCost || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    Packing ({state.monthlyOrderVolume} orders @ {formatCurrency(PACK_FEE_PER_ORDER)}/order)
                  </span>
                  <span className="font-medium">{formatCurrency(results?.packCost || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    {state.packagingType} ({state.monthlyOrderVolume} @ {formatCurrency(getPackagingCost(state.packagingType))}/order)
                  </span>
                  <span className="font-medium">{formatCurrency(results?.packagingCost || 0)}</span>
                </div>
                
                {state.specialHandling && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      Special handling ({state.monthlyOrderVolume} @ {formatCurrency(SPECIAL_HANDLING_FEE)}/order)
                    </span>
                    <span className="font-medium">{formatCurrency(results?.specialHandlingCost || 0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-b pb-2">
                  <span className="font-medium">Cost Per Order</span>
                  <span className="font-medium">{formatCurrency(results?.costPerOrder || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Monthly Total</span>
                  <span className="text-xl font-serif text-primary">{formatCurrency(results?.monthlyTotal || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6 bg-secondary">
                <h3 className="text-lg font-serif mb-2">Fulfillment Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Monthly Order Volume:</span>
                    <span className="font-medium">{state.monthlyOrderVolume}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Average Items Per Order:</span>
                    <span className="font-medium">{state.itemsPerOrder}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Packaging Type:</span>
                    <span className="font-medium">{state.packagingType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Special Handling:</span>
                    <span className="font-medium">{state.specialHandling ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Monthly Items:</span>
                    <span className="font-medium">{state.monthlyOrderVolume * state.itemsPerOrder}</span>
                  </li>
                </ul>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Cost Projections</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left">Period</th>
                      <th className="pb-2 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Monthly</td>
                      <td className="py-2 text-right">{formatCurrency(results?.monthlyTotal || 0)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Quarterly (3 months)</td>
                      <td className="py-2 text-right">{formatCurrency((results?.monthlyTotal || 0) * 3)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Half-year (6 months)</td>
                      <td className="py-2 text-right">{formatCurrency((results?.monthlyTotal || 0) * 6)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Annual (12 months)</td>
                      <td className="py-2 text-right">{formatCurrency(results?.annualProjection || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Need to make changes?</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  You can adjust your input values and recalculate at any time.
                </p>
                <button
                  onClick={handleReset}
                  className="btn btn-primary w-full"
                >
                  Start New Calculation
                </button>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-accent">
            <p className="text-sm text-center">
              This is an estimate based on the information provided. 
              Actual costs may vary depending on specific requirements.
              Volume discounts are available for higher order volumes.
              Contact us for a detailed quote.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
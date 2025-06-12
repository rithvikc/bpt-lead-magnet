"use client";

import { useState } from "react";

// Define pricing constants
const STANDARD_PALLET_RATE = 15; // $15/month
const CLIMATE_CONTROLLED_RATE = 25; // $25/month
const HAZMAT_RATE = 40; // $40/month
const LONG_TERM_SURCHARGE = 0.25; // 25%
const SKU_MANAGEMENT_FEE = 2; // $2/SKU/month

// Define storage types
type StorageType = "Standard" | "Climate-controlled" | "Hazmat";

// Define the storage calculator state interface
interface StorageState {
  palletPositions: number;
  storageDuration: number;
  skuCount: number;
  storageType: StorageType;
  isSubmitted: boolean;
}

// Define the calculation results interface
interface CalculationResults {
  monthlyStorageCost: number;
  skuManagementCost: number;
  longTermSurcharge: number;
  monthlyTotal: number;
  totalDurationCost: number;
}

export default function StorageCalculator() {
  // Initial state
  const initialState: StorageState = {
    palletPositions: 1,
    storageDuration: 1,
    skuCount: 1,
    storageType: "Standard",
    isSubmitted: false,
  };

  // State for form inputs and validation
  const [state, setState] = useState<StorageState>(initialState);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      const numValue = parseInt(value);
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

  // Calculate storage costs
  const calculateCosts = () => {
    const { palletPositions, storageDuration, skuCount, storageType } = state;
    
    // Get base rate based on storage type
    let baseRate = STANDARD_PALLET_RATE;
    if (storageType === "Climate-controlled") {
      baseRate = CLIMATE_CONTROLLED_RATE;
    } else if (storageType === "Hazmat") {
      baseRate = HAZMAT_RATE;
    }
    
    // Calculate monthly storage cost
    const monthlyStorageCost = palletPositions * baseRate;
    
    // Calculate SKU management cost
    const skuManagementCost = skuCount * SKU_MANAGEMENT_FEE;
    
    // Calculate long-term surcharge (if applicable)
    const hasLongTermSurcharge = storageDuration >= 6;
    const longTermSurcharge = hasLongTermSurcharge 
      ? (monthlyStorageCost + skuManagementCost) * LONG_TERM_SURCHARGE 
      : 0;
    
    // Calculate monthly total
    const monthlyTotal = monthlyStorageCost + skuManagementCost + longTermSurcharge;
    
    // Calculate total cost for the full duration
    const totalDurationCost = monthlyTotal * storageDuration;
    
    // Return results object
    return {
      monthlyStorageCost,
      skuManagementCost,
      longTermSurcharge,
      monthlyTotal,
      totalDurationCost
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (state.palletPositions <= 0) {
      newErrors.palletPositions = "Please enter at least 1 pallet position";
    }
    
    if (state.storageDuration <= 0) {
      newErrors.storageDuration = "Please enter a valid storage duration";
    }
    
    if (state.skuCount <= 0) {
      newErrors.skuCount = "Please enter at least 1 SKU";
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
      <h1 className="text-3xl md:text-4xl font-serif mb-4">Storage Calculator</h1>
      <p className="text-lg text-foreground/80 mb-8">
        Calculate monthly and long-term storage costs for your inventory.
      </p>
      
      {!state.isSubmitted ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="palletPositions" className="block text-sm font-medium mb-1">
                    Number of Pallet Positions Needed
                  </label>
                  <input
                    type="number"
                    id="palletPositions"
                    name="palletPositions"
                    value={state.palletPositions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.palletPositions && (
                    <p className="text-red-500 text-sm mt-1">{errors.palletPositions}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="storageDuration" className="block text-sm font-medium mb-1">
                    Storage Duration (months)
                  </label>
                  <input
                    type="number"
                    id="storageDuration"
                    name="storageDuration"
                    value={state.storageDuration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.storageDuration && (
                    <p className="text-red-500 text-sm mt-1">{errors.storageDuration}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    {state.storageDuration >= 6 ? 
                      "Long-term storage fee (+25%) applies for 6+ months" : 
                      "Long-term storage fee applies for 6+ months"}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="skuCount" className="block text-sm font-medium mb-1">
                    Number of SKUs
                  </label>
                  <input
                    type="number"
                    id="skuCount"
                    name="skuCount"
                    value={state.skuCount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.skuCount && (
                    <p className="text-red-500 text-sm mt-1">{errors.skuCount}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    SKU management fee: {formatCurrency(SKU_MANAGEMENT_FEE)}/SKU/month
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="storageType" className="block text-sm font-medium mb-1">
                    Storage Type
                  </label>
                  <select
                    id="storageType"
                    name="storageType"
                    value={state.storageType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Standard">Standard ({formatCurrency(STANDARD_PALLET_RATE)}/pallet/month)</option>
                    <option value="Climate-controlled">Climate-controlled ({formatCurrency(CLIMATE_CONTROLLED_RATE)}/pallet/month)</option>
                    <option value="Hazmat">Hazmat ({formatCurrency(HAZMAT_RATE)}/pallet/month)</option>
                  </select>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">What's Included:</h3>
                  <ul className="text-xs space-y-1 text-foreground/70">
                    <li>• Secure warehouse storage space</li>
                    <li>• Inventory management system access</li>
                    <li>• Regular inventory reporting</li>
                    <li>• 24/7 security monitoring</li>
                    <li>• Climate control (for applicable storage type)</li>
                  </ul>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">Storage Types:</h3>
                  <ul className="text-xs space-y-2 text-foreground/70">
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Standard:</span>
                      <span>Regular warehouse storage for non-sensitive items</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Climate-controlled:</span>
                      <span>Temperature and humidity-controlled environment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-1">Hazmat:</span>
                      <span>Special storage for hazardous materials with safety protocols</span>
                    </li>
                  </ul>
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
              <h2 className="text-xl font-serif mb-4">Storage Cost Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    {state.palletPositions} pallet position{state.palletPositions !== 1 ? 's' : ''} × {formatCurrency(
                      state.storageType === "Standard" ? STANDARD_PALLET_RATE : 
                      state.storageType === "Climate-controlled" ? CLIMATE_CONTROLLED_RATE : 
                      HAZMAT_RATE
                    )}/month
                  </span>
                  <span className="font-medium">{formatCurrency(results?.monthlyStorageCost || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    {state.skuCount} SKU{state.skuCount !== 1 ? 's' : ''} × {formatCurrency(SKU_MANAGEMENT_FEE)}/month
                  </span>
                  <span className="font-medium">{formatCurrency(results?.skuManagementCost || 0)}</span>
                </div>
                
                {state.storageDuration >= 6 && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      Long-term storage surcharge (25%)
                    </span>
                    <span className="font-medium">{formatCurrency(results?.longTermSurcharge || 0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-b pb-2">
                  <span className="font-medium">Monthly Total</span>
                  <span className="text-lg font-medium">{formatCurrency(results?.monthlyTotal || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Total for {state.storageDuration} month{state.storageDuration !== 1 ? 's' : ''}</span>
                  <span className="text-xl font-serif text-primary">{formatCurrency(results?.totalDurationCost || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6 bg-secondary">
                <h3 className="text-lg font-serif mb-2">Storage Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Storage Type:</span>
                    <span className="font-medium">{state.storageType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pallet Positions:</span>
                    <span className="font-medium">{state.palletPositions}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Storage Duration:</span>
                    <span className="font-medium">{state.storageDuration} month{state.storageDuration !== 1 ? 's' : ''}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Number of SKUs:</span>
                    <span className="font-medium">{state.skuCount}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Long-term Storage:</span>
                    <span className="font-medium">{state.storageDuration >= 6 ? "Yes (+25%)" : "No"}</span>
                  </li>
                </ul>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Storage Cost Projection</h3>
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
                      <td className="py-2 text-right">{formatCurrency((results?.monthlyTotal || 0) * 12)}</td>
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
              Contact us for a detailed quote.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
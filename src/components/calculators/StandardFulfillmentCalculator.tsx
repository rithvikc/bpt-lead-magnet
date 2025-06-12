"use client";

import { useState } from 'react';

// Define the state interface for this calculator
interface StandardFulfillmentState {
  receivingCost: number;
  storageCost: number;
  pickPackCost: number;
  shippingCost: number;
  monthlyInventoryVolume: number; // cubic feet
  monthlyOrderVolume: number; // number of orders
  averageOrderWeight: number; // pounds
  monthlyStorageFee: number;
  isSubmitted: boolean;
}

// Calculator constants
const RECEIVING_RATE = 35; // $35 per hour
const STORAGE_RATE = 1.5; // $1.50 per cubic foot per month
const PICK_PACK_RATE = 3; // $3 per order
const BASE_SHIPPING_RATE = 8; // $8 base shipping cost
const SHIPPING_WEIGHT_RATE = 0.5; // $0.50 per pound

export default function StandardFulfillmentCalculator() {
  // Initial state
  const initialState: StandardFulfillmentState = {
    receivingCost: 0,
    storageCost: 0,
    pickPackCost: 0,
    shippingCost: 0,
    monthlyInventoryVolume: 100,
    monthlyOrderVolume: 500,
    averageOrderWeight: 2,
    monthlyStorageFee: 0,
    isSubmitted: false,
  };
  
  const [calculatorState, setCalculatorState] = useState<StandardFulfillmentState>(initialState);
  
  const [errors, setErrors] = useState<{
    monthlyInventoryVolume?: string;
    monthlyOrderVolume?: string;
    averageOrderWeight?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Please enter a valid positive number'
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof errors];
        return newErrors;
      });
      
      setCalculatorState(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const calculateStandardCosts = () => {
    const { monthlyInventoryVolume, monthlyOrderVolume, averageOrderWeight } = calculatorState;
    
    // Calculate each cost component
    const receivingCost = (monthlyInventoryVolume / 50) * RECEIVING_RATE; // Assume 50 cubic feet per hour to process
    const storageCost = monthlyInventoryVolume * STORAGE_RATE;
    const pickPackCost = monthlyOrderVolume * PICK_PACK_RATE;
    const shippingCost = monthlyOrderVolume * (BASE_SHIPPING_RATE + (averageOrderWeight * SHIPPING_WEIGHT_RATE));
    
    setCalculatorState(prev => ({
      ...prev,
      receivingCost,
      storageCost,
      pickPackCost,
      shippingCost,
      monthlyStorageFee: storageCost, // For display purposes
      isSubmitted: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors: typeof errors = {};
    if (!calculatorState.monthlyInventoryVolume || calculatorState.monthlyInventoryVolume <= 0) {
      newErrors.monthlyInventoryVolume = 'Please enter a valid inventory volume';
    }
    if (!calculatorState.monthlyOrderVolume || calculatorState.monthlyOrderVolume <= 0) {
      newErrors.monthlyOrderVolume = 'Please enter a valid order volume';
    }
    if (!calculatorState.averageOrderWeight || calculatorState.averageOrderWeight <= 0) {
      newErrors.averageOrderWeight = 'Please enter a valid weight';
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate costs
    if (Object.keys(newErrors).length === 0) {
      calculateStandardCosts();
    }
  };

  const handleReset = () => {
    setCalculatorState(initialState);
    setErrors({});
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">Standard Fulfillment Calculator</h2>
      
      {!calculatorState.isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="monthlyInventoryVolume" className="block text-sm font-medium mb-1">
                  Monthly Inventory Volume (cubic feet)
                </label>
                <input
                  type="number"
                  id="monthlyInventoryVolume"
                  name="monthlyInventoryVolume"
                  value={calculatorState.monthlyInventoryVolume || ''}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.monthlyInventoryVolume && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyInventoryVolume}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="monthlyOrderVolume" className="block text-sm font-medium mb-1">
                  Monthly Order Volume (# of orders)
                </label>
                <input
                  type="number"
                  id="monthlyOrderVolume"
                  name="monthlyOrderVolume"
                  value={calculatorState.monthlyOrderVolume || ''}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.monthlyOrderVolume && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyOrderVolume}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="averageOrderWeight" className="block text-sm font-medium mb-1">
                  Average Order Weight (pounds)
                </label>
                <input
                  type="number"
                  id="averageOrderWeight"
                  name="averageOrderWeight"
                  value={calculatorState.averageOrderWeight || ''}
                  onChange={handleInputChange}
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.averageOrderWeight && (
                  <p className="text-red-500 text-sm mt-1">{errors.averageOrderWeight}</p>
                )}
              </div>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="text-lg font-serif mb-4">What This Includes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Receiving: Product unloading, inspection, and system entry</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Storage: Secure warehousing of your inventory</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Pick & Pack: Order processing and packaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Shipping: Carrier selection and shipping label generation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline px-4 py-2"
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2"
            >
              Calculate Costs
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-serif mb-4">Your Monthly Costs</h3>
              
              <div className="space-y-4">
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Receiving</span>
                    <span className="font-medium">{formatCurrency(calculatorState.receivingCost)}</span>
                  </div>
                  <p className="text-xs text-foreground/70">Based on {calculatorState.monthlyInventoryVolume} cubic feet of inventory</p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="font-medium">{formatCurrency(calculatorState.storageCost)}</span>
                  </div>
                  <p className="text-xs text-foreground/70">Monthly storage fee at $1.50 per cubic foot</p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Pick & Pack</span>
                    <span className="font-medium">{formatCurrency(calculatorState.pickPackCost)}</span>
                  </div>
                  <p className="text-xs text-foreground/70">Based on {calculatorState.monthlyOrderVolume} orders per month</p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Shipping</span>
                    <span className="font-medium">{formatCurrency(calculatorState.shippingCost)}</span>
                  </div>
                  <p className="text-xs text-foreground/70">Based on {calculatorState.averageOrderWeight} lbs average order weight</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-secondary p-6 rounded-lg mb-6">
                <h3 className="text-xl font-serif mb-2">Total Monthly Cost</h3>
                <div className="text-3xl font-serif text-primary">
                  {formatCurrency(
                    calculatorState.receivingCost + 
                    calculatorState.storageCost + 
                    calculatorState.pickPackCost + 
                    calculatorState.shippingCost
                  )}
                </div>
                <p className="text-sm mt-2 text-foreground/70">
                  Estimated monthly cost based on your inputs
                </p>
              </div>
              
              <div className="bg-accent p-6 rounded-lg">
                <h3 className="text-lg font-serif mb-2">Cost Breakdown</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Receiving Cost:</span>
                    <span className="font-medium">{formatCurrency(calculatorState.receivingCost)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Storage Cost:</span>
                    <span className="font-medium">{formatCurrency(calculatorState.storageCost)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pick & Pack Cost:</span>
                    <span className="font-medium">{formatCurrency(calculatorState.pickPackCost)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Shipping Cost:</span>
                    <span className="font-medium">{formatCurrency(calculatorState.shippingCost)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleReset}
              className="btn btn-primary px-4 py-2"
            >
              Calculate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
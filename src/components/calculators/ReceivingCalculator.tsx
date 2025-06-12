"use client";

import { useState } from "react";

// Define pricing constants
const PALLET_FEE = 25;
const CARTON_FEE = 3;
const UNIT_FEE = 0.5;
const APPOINTMENT_FEE = 50;
const EXPEDITED_SURCHARGE = 0.5; // 50%
const WEEKEND_SURCHARGE = 1.0; // 100%

// Define the receiving calculator state interface
interface ReceivingState {
  pallets: number;
  cartons: number;
  units: number;
  appointmentRequired: boolean;
  receivingType: "Standard" | "Expedited" | "Weekend";
  isSubmitted: boolean;
}

// Define the calculation results interface
interface CalculationResults {
  palletCost: number;
  cartonCost: number;
  unitCost: number;
  appointmentCost: number;
  surchargeAmount: number;
  totalCost: number;
}

export default function ReceivingCalculator() {
  // Initial state
  const initialState: ReceivingState = {
    pallets: 0,
    cartons: 0,
    units: 0,
    appointmentRequired: false,
    receivingType: "Standard",
    isSubmitted: false,
  };

  // State for form inputs and validation
  const [state, setState] = useState<ReceivingState>(initialState);
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
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
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

  // Calculate receiving costs
  const calculateCosts = () => {
    const { pallets, cartons, units, appointmentRequired, receivingType } = state;
    
    // Calculate base costs
    const palletCost = pallets * PALLET_FEE;
    const cartonCost = cartons * CARTON_FEE;
    const unitCost = units * UNIT_FEE;
    const appointmentCost = appointmentRequired ? APPOINTMENT_FEE : 0;
    
    // Calculate subtotal before surcharges
    const subtotal = palletCost + cartonCost + unitCost + appointmentCost;
    
    // Apply surcharges if applicable
    let surchargeAmount = 0;
    if (receivingType === "Expedited") {
      surchargeAmount = subtotal * EXPEDITED_SURCHARGE;
    } else if (receivingType === "Weekend") {
      surchargeAmount = subtotal * WEEKEND_SURCHARGE;
    }
    
    // Calculate final total
    const totalCost = subtotal + surchargeAmount;
    
    // Return results object
    return {
      palletCost,
      cartonCost,
      unitCost,
      appointmentCost,
      surchargeAmount,
      totalCost
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (state.pallets === 0 && state.cartons === 0 && state.units === 0) {
      newErrors.general = "Please enter at least one value for pallets, cartons, or units";
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
      <h1 className="text-3xl md:text-4xl font-serif mb-4">Receiving Calculator</h1>
      <p className="text-lg text-foreground/80 mb-8">
        Calculate costs for receiving incoming inventory including pallets, cartons, and individual units.
      </p>
      
      {!state.isSubmitted ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="pallets" className="block text-sm font-medium mb-1">
                    Number of Pallets
                  </label>
                  <input
                    type="number"
                    id="pallets"
                    name="pallets"
                    value={state.pallets}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.pallets && (
                    <p className="text-red-500 text-sm mt-1">{errors.pallets}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Receiving fee: {formatCurrency(PALLET_FEE)} per pallet
                  </p>
                </div>
                
                <div>
                  <label htmlFor="cartons" className="block text-sm font-medium mb-1">
                    Number of Cartons
                  </label>
                  <input
                    type="number"
                    id="cartons"
                    name="cartons"
                    value={state.cartons}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.cartons && (
                    <p className="text-red-500 text-sm mt-1">{errors.cartons}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Receiving fee: {formatCurrency(CARTON_FEE)} per carton
                  </p>
                </div>
                
                <div>
                  <label htmlFor="units" className="block text-sm font-medium mb-1">
                    Number of Individual Units
                  </label>
                  <input
                    type="number"
                    id="units"
                    name="units"
                    value={state.units}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  {errors.units && (
                    <p className="text-red-500 text-sm mt-1">{errors.units}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Receiving fee: {formatCurrency(UNIT_FEE)} per unit
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="receivingType" className="block text-sm font-medium mb-1">
                    Receiving Type
                  </label>
                  <select
                    id="receivingType"
                    name="receivingType"
                    value={state.receivingType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Expedited">Expedited (50% surcharge)</option>
                    <option value="Weekend">Weekend (100% surcharge)</option>
                  </select>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="appointmentRequired"
                      name="appointmentRequired"
                      checked={state.appointmentRequired}
                      onChange={handleInputChange}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="appointmentRequired" className="ml-2 block text-sm">
                      Appointment required? (+{formatCurrency(APPOINTMENT_FEE)} fee)
                    </label>
                  </div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">What's Included:</h3>
                  <ul className="text-xs space-y-1 text-foreground/70">
                    <li>• Unloading of freight</li>
                    <li>• Inspection for damages</li>
                    <li>• Product count verification</li>
                    <li>• System entry and processing</li>
                    <li>• Placement in warehouse storage</li>
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
              <h2 className="text-xl font-serif mb-4">Receiving Cost Breakdown</h2>
              
              <div className="space-y-4">
                {state.pallets > 0 && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      {state.pallets} {state.pallets === 1 ? 'Pallet' : 'Pallets'} × {formatCurrency(PALLET_FEE)}
                    </span>
                    <span className="font-medium">{formatCurrency(results?.palletCost || 0)}</span>
                  </div>
                )}
                
                {state.cartons > 0 && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      {state.cartons} {state.cartons === 1 ? 'Carton' : 'Cartons'} × {formatCurrency(CARTON_FEE)}
                    </span>
                    <span className="font-medium">{formatCurrency(results?.cartonCost || 0)}</span>
                  </div>
                )}
                
                {state.units > 0 && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      {state.units} {state.units === 1 ? 'Unit' : 'Units'} × {formatCurrency(UNIT_FEE)}
                    </span>
                    <span className="font-medium">{formatCurrency(results?.unitCost || 0)}</span>
                  </div>
                )}
                
                {state.appointmentRequired && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">Appointment Scheduling Fee</span>
                    <span className="font-medium">{formatCurrency(APPOINTMENT_FEE)}</span>
                  </div>
                )}
                
                {(state.receivingType === "Expedited" || state.receivingType === "Weekend") && (
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm">
                      {state.receivingType} Surcharge 
                      ({state.receivingType === "Expedited" ? "50%" : "100%"})
                    </span>
                    <span className="font-medium">{formatCurrency(results?.surchargeAmount || 0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Total Receiving Cost</span>
                  <span className="text-xl font-serif text-primary">{formatCurrency(results?.totalCost || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6 bg-secondary">
                <h3 className="text-lg font-serif mb-2">Receiving Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Receiving Type:</span>
                    <span className="font-medium">{state.receivingType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Appointment Required:</span>
                    <span className="font-medium">{state.appointmentRequired ? "Yes" : "No"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">
                      {state.pallets + state.cartons + state.units} 
                      {state.pallets > 0 && ` (${state.pallets} pallets)`}
                      {state.cartons > 0 && ` (${state.cartons} cartons)`}
                      {state.units > 0 && ` (${state.units} units)`}
                    </span>
                  </li>
                </ul>
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
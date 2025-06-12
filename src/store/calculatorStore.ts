"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Standard Fulfillment Calculator State
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

// Custom Requirements Calculator State
interface CustomRequirementsState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  requirements: string;
  isSubmitted: boolean;
}

interface CalculatorStore {
  // Standard Fulfillment
  standardFulfillment: StandardFulfillmentState;
  updateStandardFulfillment: (data: Partial<StandardFulfillmentState>) => void;
  calculateStandardCosts: () => void;
  resetStandardFulfillment: () => void;
  
  // Custom Requirements
  customRequirements: CustomRequirementsState;
  updateCustomRequirements: (data: Partial<CustomRequirementsState>) => void;
  submitCustomRequirements: () => void;
  resetCustomRequirements: () => void;
}

// Initial states
const initialStandardFulfillment: StandardFulfillmentState = {
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

const initialCustomRequirements: CustomRequirementsState = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  requirements: '',
  isSubmitted: false,
};

// Calculator constants
const RECEIVING_RATE = 35; // $35 per hour
const STORAGE_RATE = 1.5; // $1.50 per cubic foot per month
const PICK_PACK_RATE = 3; // $3 per order
const BASE_SHIPPING_RATE = 8; // $8 base shipping cost
const SHIPPING_WEIGHT_RATE = 0.5; // $0.50 per pound

let store: any;

// This is to avoid "Cannot create a store" Zustand error during SSR
// See: https://github.com/pmndrs/zustand/issues/1145
export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      // Standard Fulfillment
      standardFulfillment: initialStandardFulfillment,
      
      updateStandardFulfillment: (data) => {
        set((state) => ({
          standardFulfillment: {
            ...state.standardFulfillment,
            ...data,
          },
        }));
      },
      
      calculateStandardCosts: () => {
        const { monthlyInventoryVolume, monthlyOrderVolume, averageOrderWeight } = get().standardFulfillment;
        
        // Calculate each cost component
        const receivingCost = (monthlyInventoryVolume / 50) * RECEIVING_RATE; // Assume 50 cubic feet per hour to process
        const storageCost = monthlyInventoryVolume * STORAGE_RATE;
        const pickPackCost = monthlyOrderVolume * PICK_PACK_RATE;
        const shippingCost = monthlyOrderVolume * (BASE_SHIPPING_RATE + (averageOrderWeight * SHIPPING_WEIGHT_RATE));
        
        set((state) => ({
          standardFulfillment: {
            ...state.standardFulfillment,
            receivingCost,
            storageCost,
            pickPackCost,
            shippingCost,
            monthlyStorageFee: storageCost, // For display purposes
            isSubmitted: true,
          },
        }));
      },
      
      resetStandardFulfillment: () => {
        set({ standardFulfillment: initialStandardFulfillment });
      },
      
      // Custom Requirements
      customRequirements: initialCustomRequirements,
      
      updateCustomRequirements: (data) => {
        set((state) => ({
          customRequirements: {
            ...state.customRequirements,
            ...data,
          },
        }));
      },
      
      submitCustomRequirements: () => {
        set((state) => ({
          customRequirements: {
            ...state.customRequirements,
            isSubmitted: true,
          },
        }));
      },
      
      resetCustomRequirements: () => {
        set({ customRequirements: initialCustomRequirements });
      },
    }),
    {
      name: 'calculator-storage',
      skipHydration: true,
    }
  )
); 
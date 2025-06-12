"use client";

import { useState } from "react";

// Define the calculator state interface
interface FreeShippingState {
  productPrice: number;
  productCost: number;
  averageShippingCost: number;
  targetProfitMargin: number;
  currentConversionRate: number;
  estimatedConversionIncrease: number;
  averageOrderValue: number;
  shippingAsPercentOfRevenue: number;
  isSubmitted: boolean;
}

// Define the calculation results interface
interface CalculationResults {
  grossMargin: number;
  grossMarginPercentage: number;
  minThresholdBasic: number;
  recommendedThreshold: number;
  optimalThreshold: number;
  profitImpactAtRecommended: number;
  profitImpactAtOptimal: number;
  breakEvenPoint: number;
  conversionImpactAnalysis: {
    currentRevenue: number;
    projectedRevenue: number;
    revenueIncrease: number;
    additionalProfit: number;
  };
  recommendations: string[];
}

export default function FreeShippingCalculator() {
  // Initial state
  const initialState: FreeShippingState = {
    productPrice: 0,
    productCost: 0,
    averageShippingCost: 0,
    targetProfitMargin: 20,
    currentConversionRate: 2.5,
    estimatedConversionIncrease: 15,
    averageOrderValue: 0,
    shippingAsPercentOfRevenue: 8,
    isSubmitted: false,
  };

  // State for form inputs and validation
  const [state, setState] = useState<FreeShippingState>(initialState);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    const numValue = parseFloat(value);
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
  };

  // Calculate free shipping thresholds and impacts
  const calculateThresholds = () => {
    const { 
      productPrice, 
      productCost, 
      averageShippingCost, 
      targetProfitMargin,
      currentConversionRate,
      estimatedConversionIncrease,
      averageOrderValue,
      shippingAsPercentOfRevenue
    } = state;
    
    // Calculate gross margin
    const grossMargin = productPrice - productCost;
    const grossMarginPercentage = (grossMargin / productPrice) * 100;
    
    // Basic threshold: Cover shipping cost
    const minThresholdBasic = averageShippingCost / (grossMarginPercentage / 100);
    
    // Recommended threshold: Maintain target profit margin
    const targetProfitAmount = productPrice * (targetProfitMargin / 100);
    const recommendedThreshold = (averageShippingCost + targetProfitAmount) / (grossMarginPercentage / 100);
    
    // Optimal threshold: Based on psychological pricing
    const optimalThreshold = Math.ceil(recommendedThreshold / 10) * 10; // Round up to nearest $10
    
    // Profit impact calculations
    const profitImpactAtRecommended = grossMargin - averageShippingCost;
    const profitImpactAtOptimal = grossMargin - averageShippingCost;
    
    // Break-even point for conversion increase
    const currentOrdersNeeded = Math.ceil(averageShippingCost / grossMargin);
    const breakEvenPoint = (averageShippingCost / grossMargin) * 100; // as percentage increase
    
    // Conversion impact analysis
    const currentRevenue = averageOrderValue * (currentConversionRate / 100) * 1000; // Assuming 1000 visitors
    const newConversionRate = currentConversionRate * (1 + estimatedConversionIncrease / 100);
    const projectedRevenue = averageOrderValue * (newConversionRate / 100) * 1000;
    const revenueIncrease = projectedRevenue - currentRevenue;
    const additionalProfit = revenueIncrease * (grossMarginPercentage / 100) - (projectedRevenue * (shippingAsPercentOfRevenue / 100));
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (grossMarginPercentage < 30) {
      recommendations.push("Consider increasing your product margins before offering free shipping");
    }
    
    if (averageShippingCost > grossMargin * 0.5) {
      recommendations.push("Your shipping costs are high relative to margins. Consider negotiating better shipping rates");
    }
    
    if (optimalThreshold > averageOrderValue * 1.5) {
      recommendations.push("Your threshold may be too high. Consider product bundling to increase order values");
    }
    
    if (estimatedConversionIncrease < 10) {
      recommendations.push("Test your free shipping offer to validate the conversion impact");
    }
    
    recommendations.push("Monitor your average order value closely after implementing free shipping");
    recommendations.push("Consider offering free shipping on orders over your calculated threshold");
    
    return {
      grossMargin,
      grossMarginPercentage,
      minThresholdBasic,
      recommendedThreshold,
      optimalThreshold,
      profitImpactAtRecommended,
      profitImpactAtOptimal,
      breakEvenPoint,
      conversionImpactAnalysis: {
        currentRevenue,
        projectedRevenue,
        revenueIncrease,
        additionalProfit
      },
      recommendations
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (state.productPrice <= 0) {
      newErrors.productPrice = "Product price must be greater than 0";
    }
    
    if (state.productCost <= 0) {
      newErrors.productCost = "Product cost must be greater than 0";
    }
    
    if (state.productCost >= state.productPrice) {
      newErrors.productCost = "Product cost must be less than product price";
    }
    
    if (state.averageShippingCost <= 0) {
      newErrors.averageShippingCost = "Average shipping cost must be greater than 0";
    }
    
    if (state.averageOrderValue <= 0) {
      newErrors.averageOrderValue = "Average order value must be greater than 0";
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate and show results
    if (Object.keys(newErrors).length === 0) {
      const calculationResults = calculateThresholds();
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

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-serif mb-4">Free Shipping Calculator</h1>
      <p className="text-lg text-foreground/80 mb-8">
        Calculate the optimal free shipping threshold for your ecommerce business based on your unit economics, 
        conversion goals, and profit targets.
      </p>
      
      {!state.isSubmitted ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Economics */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif border-b pb-2">Product Economics</h2>
                
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium mb-1">
                    Average Product Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    name="productPrice"
                    value={state.productPrice || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 49.99"
                  />
                  {errors.productPrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Your average selling price per product
                  </p>
                </div>
                
                <div>
                  <label htmlFor="productCost" className="block text-sm font-medium mb-1">
                    Average Product Cost <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="productCost"
                    name="productCost"
                    value={state.productCost || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 24.99"
                  />
                  {errors.productCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.productCost}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Cost of goods sold (COGS) per product
                  </p>
                </div>
                
                <div>
                  <label htmlFor="averageShippingCost" className="block text-sm font-medium mb-1">
                    Average Shipping Cost <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="averageShippingCost"
                    name="averageShippingCost"
                    value={state.averageShippingCost || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 8.50"
                  />
                  {errors.averageShippingCost && (
                    <p className="text-red-500 text-sm mt-1">{errors.averageShippingCost}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    What you pay to ship an average order
                  </p>
                </div>
                
                <div>
                  <label htmlFor="targetProfitMargin" className="block text-sm font-medium mb-1">
                    Target Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    id="targetProfitMargin"
                    name="targetProfitMargin"
                    value={state.targetProfitMargin || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 20"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Desired profit margin to maintain
                  </p>
                </div>
              </div>
              
              {/* Business Metrics */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif border-b pb-2">Business Metrics</h2>
                
                <div>
                  <label htmlFor="averageOrderValue" className="block text-sm font-medium mb-1">
                    Current Average Order Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="averageOrderValue"
                    name="averageOrderValue"
                    value={state.averageOrderValue || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 75.00"
                  />
                  {errors.averageOrderValue && (
                    <p className="text-red-500 text-sm mt-1">{errors.averageOrderValue}</p>
                  )}
                  <p className="text-xs text-foreground/60 mt-1">
                    Your current AOV across all orders
                  </p>
                </div>
                
                <div>
                  <label htmlFor="currentConversionRate" className="block text-sm font-medium mb-1">
                    Current Conversion Rate (%)
                  </label>
                  <input
                    type="number"
                    id="currentConversionRate"
                    name="currentConversionRate"
                    value={state.currentConversionRate || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 2.5"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Percentage of visitors who make a purchase
                  </p>
                </div>
                
                <div>
                  <label htmlFor="estimatedConversionIncrease" className="block text-sm font-medium mb-1">
                    Expected Conversion Increase (%)
                  </label>
                  <input
                    type="number"
                    id="estimatedConversionIncrease"
                    name="estimatedConversionIncrease"
                    value={state.estimatedConversionIncrease || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 15"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Expected increase from free shipping offer
                  </p>
                </div>
                
                <div>
                  <label htmlFor="shippingAsPercentOfRevenue" className="block text-sm font-medium mb-1">
                    Shipping Costs as % of Revenue
                  </label>
                  <input
                    type="number"
                    id="shippingAsPercentOfRevenue"
                    name="shippingAsPercentOfRevenue"
                    value={state.shippingAsPercentOfRevenue || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="e.g., 8"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Current shipping costs as percentage of total revenue
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">How This Calculator Works:</h3>
              <ul className="text-xs space-y-1 text-foreground/70">
                <li>• Analyzes your unit economics to determine sustainable free shipping thresholds</li>
                <li>• Calculates the minimum order value needed to absorb shipping costs</li>
                <li>• Projects the impact on conversion rates and overall profitability</li>
                <li>• Provides recommendations based on industry best practices</li>
              </ul>
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
                Calculate Thresholds
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-serif mb-4">Free Shipping Thresholds</h2>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-foreground/60 mb-1">Minimum Threshold</div>
                    <div className="text-xl font-serif text-primary">{formatCurrency(results?.minThresholdBasic || 0)}</div>
                    <div className="text-xs text-foreground/60 mt-1">Break-even point</div>
                  </div>
                  
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <div className="text-sm text-foreground/60 mb-1">Recommended</div>
                    <div className="text-xl font-serif text-primary">{formatCurrency(results?.recommendedThreshold || 0)}</div>
                    <div className="text-xs text-foreground/60 mt-1">Maintains margins</div>
                  </div>
                  
                  <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <div className="text-sm text-foreground/60 mb-1">Optimal Threshold</div>
                    <div className="text-xl font-serif text-primary font-bold">{formatCurrency(results?.optimalThreshold || 0)}</div>
                    <div className="text-xs text-foreground/60 mt-1">Psychological pricing</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Unit Economics Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Margin per Product:</span>
                      <span className="font-medium">{formatCurrency(results?.grossMargin || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Margin %:</span>
                      <span className="font-medium">{formatPercentage(results?.grossMarginPercentage || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Cost Coverage:</span>
                      <span className="font-medium">{formatCurrency(state.averageShippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Break-even Conversion Increase:</span>
                      <span className="font-medium">{formatPercentage(results?.breakEvenPoint || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-4">Conversion Impact Analysis</h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-foreground/60">Current Monthly Revenue (est.)</div>
                      <div className="text-lg font-medium">{formatCurrency(results?.conversionImpactAnalysis.currentRevenue || 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground/60">Projected Monthly Revenue</div>
                      <div className="text-lg font-medium text-green-600">{formatCurrency(results?.conversionImpactAnalysis.projectedRevenue || 0)}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-foreground/60">Revenue Increase</div>
                      <div className="text-lg font-medium text-green-600">+{formatCurrency(results?.conversionImpactAnalysis.revenueIncrease || 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground/60">Additional Profit Impact</div>
                      <div className="text-lg font-medium text-primary">{formatCurrency(results?.conversionImpactAnalysis.additionalProfit || 0)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-secondary rounded text-sm">
                  <strong>Note:</strong> This analysis assumes 1,000 monthly visitors. Scale proportionally for your traffic volume.
                </div>
              </div>
            </div>
            
            {/* Recommendations Sidebar */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Key Recommendations</h3>
                <ul className="space-y-3 text-sm">
                  {results?.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card p-6 bg-accent">
                <h3 className="font-medium mb-3">Implementation Strategy</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Start with your recommended threshold</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>A/B test the impact on conversion rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Monitor average order value changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
                    <span>Adjust based on real performance data</span>
                  </li>
                </ol>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Need to make changes?</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Adjust your inputs to see how different scenarios affect your optimal threshold.
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
          
          <div className="card p-4 bg-muted">
            <p className="text-sm text-center">
              <strong>Disclaimer:</strong> This calculator provides estimates based on the inputs provided. 
              Actual results may vary based on customer behavior, market conditions, and implementation strategy. 
              Always test and validate assumptions with real data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
"use client";

import { useState } from "react";

// Define a single product interface
interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  salesVolume: number; // percentage of total sales or units sold per month
}

// Define the calculator state interface
interface FreeShippingState {
  products: Product[];
  averageShippingCost: number;
  targetProfitMargin: number;
  currentConversionRate: number;
  estimatedConversionIncrease: number;
  averageOrderValue: number;
  shippingAsPercentOfRevenue: number;
  useMultipleProducts: boolean;
  isSubmitted: boolean;
}

// Define the calculation results interface
interface CalculationResults {
  weightedAveragePrice: number;
  weightedAverageCost: number;
  weightedGrossMargin: number;
  weightedGrossMarginPercentage: number;
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
  productBreakdown: Array<{
    product: Product;
    grossMargin: number;
    grossMarginPercentage: number;
    contributionToThreshold: number;
  }>;
  recommendations: string[];
}

export default function FreeShippingCalculator() {
  // Initial state
  const initialState: FreeShippingState = {
    products: [
      {
        id: '1',
        name: 'Product 1',
        price: 0,
        cost: 0,
        salesVolume: 100
      }
    ],
    averageShippingCost: 0,
    targetProfitMargin: 20,
    currentConversionRate: 2.5,
    estimatedConversionIncrease: 15,
    averageOrderValue: 0,
    shippingAsPercentOfRevenue: 8,
    useMultipleProducts: false,
    isSubmitted: false,
  };

  // State for form inputs and validation
  const [state, setState] = useState<FreeShippingState>(initialState);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add a new product
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: `Product ${state.products.length + 1}`,
      price: 0,
      cost: 0,
      salesVolume: 0
    };
    setState(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  // Remove a product
  const removeProduct = (id: string) => {
    if (state.products.length > 1) {
      setState(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      }));
    }
  };

  // Update product data
  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === id 
          ? { ...p, [field]: field === 'name' ? value : parseFloat(value.toString()) || 0 }
          : p
      )
    }));
  };

  // Handle input changes for non-product fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setState(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
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

  // Calculate weighted averages and thresholds
  const calculateThresholds = () => {
    const { 
      products,
      averageShippingCost, 
      targetProfitMargin,
      currentConversionRate,
      estimatedConversionIncrease,
      averageOrderValue,
      shippingAsPercentOfRevenue,
      useMultipleProducts
    } = state;
    
    let weightedAveragePrice = 0;
    let weightedAverageCost = 0;
    let totalSalesVolume = 0;
    
    if (useMultipleProducts) {
      // Calculate weighted averages based on sales volume
      totalSalesVolume = products.reduce((sum, p) => sum + p.salesVolume, 0);
      
      if (totalSalesVolume > 0) {
        weightedAveragePrice = products.reduce((sum, p) => 
          sum + (p.price * (p.salesVolume / totalSalesVolume)), 0
        );
        weightedAverageCost = products.reduce((sum, p) => 
          sum + (p.cost * (p.salesVolume / totalSalesVolume)), 0
        );
      }
    } else {
      // Use single product data
      const product = products[0];
      weightedAveragePrice = product.price;
      weightedAverageCost = product.cost;
      totalSalesVolume = 100;
    }
    
    // Calculate weighted gross margin
    const weightedGrossMargin = weightedAveragePrice - weightedAverageCost;
    const weightedGrossMarginPercentage = weightedAveragePrice > 0 
      ? (weightedGrossMargin / weightedAveragePrice) * 100 
      : 0;
    
    // Basic threshold: Cover shipping cost
    const minThresholdBasic = weightedGrossMarginPercentage > 0 
      ? averageShippingCost / (weightedGrossMarginPercentage / 100)
      : 0;
    
    // Recommended threshold: Maintain target profit margin
    const targetProfitAmount = weightedAveragePrice * (targetProfitMargin / 100);
    const recommendedThreshold = weightedGrossMarginPercentage > 0
      ? (averageShippingCost + targetProfitAmount) / (weightedGrossMarginPercentage / 100)
      : 0;
    
    // Optimal threshold: Based on psychological pricing
    const optimalThreshold = Math.ceil(recommendedThreshold / 10) * 10; // Round up to nearest $10
    
    // Profit impact calculations
    const profitImpactAtRecommended = weightedGrossMargin - averageShippingCost;
    const profitImpactAtOptimal = weightedGrossMargin - averageShippingCost;
    
    // Break-even point for conversion increase
    const breakEvenPoint = weightedGrossMargin > 0 
      ? (averageShippingCost / weightedGrossMargin) * 100 
      : 0;
    
    // Conversion impact analysis
    const currentRevenue = averageOrderValue * (currentConversionRate / 100) * 1000; // Assuming 1000 visitors
    const newConversionRate = currentConversionRate * (1 + estimatedConversionIncrease / 100);
    const projectedRevenue = averageOrderValue * (newConversionRate / 100) * 1000;
    const revenueIncrease = projectedRevenue - currentRevenue;
    const additionalProfit = revenueIncrease * (weightedGrossMarginPercentage / 100) - (projectedRevenue * (shippingAsPercentOfRevenue / 100));
    
    // Product breakdown analysis
    const productBreakdown = products.map(product => {
      const grossMargin = product.price - product.cost;
      const grossMarginPercentage = product.price > 0 ? (grossMargin / product.price) * 100 : 0;
      const contributionToThreshold = totalSalesVolume > 0 
        ? (product.salesVolume / totalSalesVolume) * 100 
        : 0;
      
      return {
        product,
        grossMargin,
        grossMarginPercentage,
        contributionToThreshold
      };
    });
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (weightedGrossMarginPercentage < 30) {
      recommendations.push("Your weighted gross margin is below 30%. Consider increasing product margins before offering free shipping");
    }
    
    if (averageShippingCost > weightedGrossMargin * 0.5) {
      recommendations.push("Your shipping costs are high relative to margins. Consider negotiating better shipping rates");
    }
    
    if (optimalThreshold > averageOrderValue * 1.5) {
      recommendations.push("Your threshold may be too high. Consider product bundling or promotional strategies to increase order values");
    }
    
    if (useMultipleProducts) {
      const lowMarginProducts = productBreakdown.filter(p => p.grossMarginPercentage < 20);
      if (lowMarginProducts.length > 0) {
        recommendations.push(`Consider reviewing pricing for low-margin products: ${lowMarginProducts.map(p => p.product.name).join(', ')}`);
      }
      
      const highVolumeProducts = productBreakdown.filter(p => p.contributionToThreshold > 30);
      if (highVolumeProducts.length > 0) {
        recommendations.push(`Focus free shipping strategy on high-volume products: ${highVolumeProducts.map(p => p.product.name).join(', ')}`);
      }
    }
    
    if (estimatedConversionIncrease < 10) {
      recommendations.push("Test your free shipping offer to validate the conversion impact");
    }
    
    recommendations.push("Monitor your average order value closely after implementing free shipping");
    recommendations.push("Consider offering free shipping on orders over your calculated threshold");
    
    if (useMultipleProducts) {
      recommendations.push("Consider implementing tiered free shipping based on product categories");
    }
    
    return {
      weightedAveragePrice,
      weightedAverageCost,
      weightedGrossMargin,
      weightedGrossMarginPercentage,
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
      productBreakdown,
      recommendations
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (state.useMultipleProducts) {
      // Validate all products
      let hasValidProduct = false;
      state.products.forEach((product, index) => {
        if (product.price <= 0) {
          newErrors[`product${index}Price`] = `Product ${index + 1} price must be greater than 0`;
        }
        if (product.cost <= 0) {
          newErrors[`product${index}Cost`] = `Product ${index + 1} cost must be greater than 0`;
        }
        if (product.cost >= product.price) {
          newErrors[`product${index}Cost`] = `Product ${index + 1} cost must be less than price`;
        }
        if (product.salesVolume <= 0) {
          newErrors[`product${index}Volume`] = `Product ${index + 1} sales volume must be greater than 0`;
        }
        if (product.price > 0 && product.cost > 0 && product.cost < product.price && product.salesVolume > 0) {
          hasValidProduct = true;
        }
      });
      
      if (!hasValidProduct) {
        newErrors.general = "Please add at least one valid product with price, cost, and sales volume";
      }
    } else {
      // Validate single product
      const product = state.products[0];
      if (product.price <= 0) {
        newErrors.productPrice = "Product price must be greater than 0";
      }
      if (product.cost <= 0) {
        newErrors.productCost = "Product cost must be greater than 0";
      }
      if (product.cost >= product.price) {
        newErrors.productCost = "Product cost must be less than product price";
      }
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
        Calculate the optimal free shipping threshold for your ecommerce business. Add multiple products 
        for a comprehensive analysis based on your complete product catalog.
      </p>
      
      {!state.isSubmitted ? (
        <div className="space-y-6">
          {/* Product Input Mode Selection */}
          <div className="card p-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="checkbox"
                id="useMultipleProducts"
                name="useMultipleProducts"
                checked={state.useMultipleProducts}
                onChange={handleInputChange}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="useMultipleProducts" className="text-sm font-medium">
                Add multiple products for comprehensive analysis
              </label>
            </div>
            <p className="text-xs text-foreground/60">
              {state.useMultipleProducts 
                ? "Add your product catalog with sales volumes for weighted analysis"
                : "Use single product analysis for quick calculations"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            {/* Product Catalog Section */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif">
                  {state.useMultipleProducts ? "Product Catalog" : "Product Information"}
                </h2>
                {state.useMultipleProducts && (
                  <button
                    type="button"
                    onClick={addProduct}
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    + Add Product
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {state.products.map((product, index) => (
                  <div key={product.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="text-lg font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                        placeholder="Product Name"
                      />
                      {state.useMultipleProducts && state.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={product.price || ''}
                          onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          placeholder="e.g., 49.99"
                        />
                        {errors[`product${index}Price`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`product${index}Price`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Cost (COGS) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={product.cost || ''}
                          onChange={(e) => updateProduct(product.id, 'cost', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          placeholder="e.g., 24.99"
                        />
                        {errors[`product${index}Cost`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`product${index}Cost`]}</p>
                        )}
                      </div>
                      
                      {state.useMultipleProducts && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Monthly Sales Volume <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={product.salesVolume || ''}
                            onChange={(e) => updateProduct(product.id, 'salesVolume', e.target.value)}
                            min="0"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            placeholder="e.g., 100"
                          />
                          {errors[`product${index}Volume`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`product${index}Volume`]}</p>
                          )}
                          <p className="text-xs text-foreground/60 mt-1">
                            Units sold per month
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Show product margins */}
                    {product.price > 0 && product.cost > 0 && (
                      <div className="mt-3 p-3 bg-secondary rounded text-sm">
                        <div className="flex justify-between">
                          <span>Gross Margin:</span>
                          <span className="font-medium">{formatCurrency(product.price - product.cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin %:</span>
                          <span className="font-medium">
                            {formatPercentage((product.price - product.cost) / product.price * 100)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shipping & Business Metrics */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif border-b pb-2">Shipping & Business Metrics</h2>
                
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
              </div>
              
              {/* Conversion Metrics */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif border-b pb-2">Conversion Metrics</h2>
                
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
                <li>• Analyzes your {state.useMultipleProducts ? "product catalog" : "product"} to determine sustainable free shipping thresholds</li>
                <li>• {state.useMultipleProducts ? "Calculates weighted averages based on sales volumes" : "Uses single product economics"}</li>
                <li>• Projects the impact on conversion rates and overall profitability</li>
                <li>• Provides recommendations based on your specific product mix and margins</li>
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
                  <h3 className="font-medium">
                    {state.useMultipleProducts ? "Weighted Economics Summary" : "Unit Economics Summary"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>{state.useMultipleProducts ? "Weighted Avg Price:" : "Product Price:"}</span>
                      <span className="font-medium">{formatCurrency(results?.weightedAveragePrice || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{state.useMultipleProducts ? "Weighted Avg Cost:" : "Product Cost:"}</span>
                      <span className="font-medium">{formatCurrency(results?.weightedAverageCost || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Margin:</span>
                      <span className="font-medium">{formatCurrency(results?.weightedGrossMargin || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Margin %:</span>
                      <span className="font-medium">{formatPercentage(results?.weightedGrossMarginPercentage || 0)}</span>
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
              
              {/* Product Breakdown for Multiple Products */}
              {state.useMultipleProducts && (
                <div className="card p-6">
                  <h3 className="text-lg font-serif mb-4">Product Breakdown Analysis</h3>
                  <div className="space-y-4">
                    {results?.productBreakdown.map((item, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <span className="text-sm text-foreground/60">
                            {formatPercentage(item.contributionToThreshold)} of sales
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span>{formatCurrency(item.product.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margin:</span>
                            <span>{formatCurrency(item.grossMargin)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margin %:</span>
                            <span className={item.grossMarginPercentage < 20 ? "text-red-600" : ""}>
                              {formatPercentage(item.grossMarginPercentage)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                  {state.useMultipleProducts && (
                    <li className="flex items-start">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mr-2 mt-0.5">5</span>
                      <span>Consider category-specific thresholds</span>
                    </li>
                  )}
                </ol>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-serif mb-3">Need to make changes?</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Adjust your {state.useMultipleProducts ? "product catalog or" : ""} inputs to see how different scenarios affect your optimal threshold.
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
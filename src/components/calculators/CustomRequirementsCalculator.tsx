"use client";

import { useState } from 'react';

// Define the state interface
interface CustomRequirementsState {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  requirements: string;
  isSubmitted: boolean;
}

export default function CustomRequirementsCalculator() {
  // Initial state
  const initialState: CustomRequirementsState = {
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    requirements: '',
    isSubmitted: false,
  };
  
  const [customRequirements, setCustomRequirements] = useState<CustomRequirementsState>(initialState);
  
  const [errors, setErrors] = useState<{
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    requirements?: string;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomRequirements(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error if field is filled
    if (value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof errors];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: typeof errors = {};
    if (!customRequirements.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!customRequirements.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    if (!customRequirements.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customRequirements.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customRequirements.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!customRequirements.requirements.trim()) {
      newErrors.requirements = 'Please describe your requirements';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      setCustomRequirements(prev => ({
        ...prev,
        isSubmitted: true
      }));
    }
  };

  const handleReset = () => {
    setCustomRequirements(initialState);
    setErrors({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-serif mb-6">Custom Requirements Quote</h2>
      
      {!customRequirements.isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={customRequirements.companyName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={customRequirements.contactName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.contactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customRequirements.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customRequirements.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium mb-1">
                  Describe Your Requirements *
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={customRequirements.requirements}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Please describe your product types, special handling requirements, kitting needs, or any other specific services you're looking for."
                />
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                )}
              </div>
              
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Custom Services We Offer:</h3>
                <ul className="text-xs space-y-1 text-foreground/70">
                  <li>• Kitting and assembly</li>
                  <li>• Custom packaging</li>
                  <li>• Special handling (fragile, oversized)</li>
                  <li>• Subscription box fulfillment</li>
                  <li>• Returns processing</li>
                  <li>• International shipping</li>
                </ul>
              </div>
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
              Request Quote
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-secondary p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif mb-4">Thank You for Your Request!</h3>
            <p className="mb-6">
              We've received your custom requirements and will prepare a personalized quote for your business.
            </p>
            
            <div className="text-left bg-background border border-border rounded-lg p-6 mb-6">
              <h4 className="font-serif text-lg mb-4">Request Details:</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Company:</p>
                  <p className="text-sm">{customRequirements.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact:</p>
                  <p className="text-sm">{customRequirements.contactName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">{customRequirements.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone:</p>
                  <p className="text-sm">{customRequirements.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Requirements:</p>
                <p className="text-sm bg-secondary p-3 rounded mt-1">
                  {customRequirements.requirements}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-foreground/70">
              A member of our team will contact you within 1 business day to discuss your requirements in detail.
            </p>
          </div>
          
          <button
            onClick={handleReset}
            className="btn btn-primary px-4 py-2"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
} 
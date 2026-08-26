*** copy Checkout Stepper1.md ***

An accessible, production-ready React Checkout Stepper component covering **Customer Info**, **Shipping Info**, **Payment Info**, and **Delivered (Order Summary)** stages with validation, step indicator lines, and responsive layout.

---

### Component Implementation

```tsx
import React, { useState } from 'react';

interface CheckoutData {
  // 1. Customer Info
  name: string;
  email: string;
  phone: string;
  // 2. Shipping Info
  address: string;
  city: string;
  postalCode: string;
  // 3. Payment Info
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const INITIAL_DATA: CheckoutData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
};

const STEP_CONFIG = [
  { id: 0, title: 'Customer Info' },
  { id: 1, title: 'Shipping Info' },
  { id: 2, title: 'Payment Info' },
  { id: 3, title: 'Delivered Info' },
];

export const CheckoutStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<CheckoutData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string>('');

  const updateField = (field: keyof CheckoutData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Valid email is required';
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        newErrors.phone = 'Valid 10-digit phone number is required';
      }
    } else if (currentStep === 1) {
      if (!formData.address.trim()) newErrors.address = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal / Zip Code is required';
    } else if (currentStep === 2) {
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry (MM/YY) is required';
      if (!formData.cardCvv.trim() || formData.cardCvv.length < 3) {
        newErrors.cardCvv = '3-digit CVV required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 2) {
        setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      }
      setCurrentStep((prev) => Math.min(prev + 1, STEP_CONFIG.length - 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const progressPercentage = (currentStep / (STEP_CONFIG.length - 1)) * 100;

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '30px auto',
        padding: '28px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Horizontal Stepper Header */}
      <div style={{ position: 'relative', marginBottom: '36px' }}>
        {/* Progress connecting line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '40px',
            right: '40px',
            height: '4px',
            backgroundColor: '#e2e8f0',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#2563eb',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Step circles */}
        <div
          role="tablist"
          aria-label="Checkout Navigation Steps"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {STEP_CONFIG.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${step.title}, Step ${index + 1} of ${STEP_CONFIG.length}`}
                  disabled={index > currentStep}
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#16a34a' : isActive ? '#2563eb' : '#ffffff',
                    border: `2px solid ${isCompleted ? '#16a34a' : isActive ? '#2563eb' : '#cbd5e1'}`,
                    color: isCompleted || isActive ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: index < currentStep ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? '✓' : index + 1}
                </button>
                <span
                  style={{
                    fontSize: '11px',
                    marginTop: '8px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0f172a' : '#64748b',
                    textAlign: 'center',
                  }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div style={{ minHeight: '260px' }}>
        {/* Step 1: Customer Information */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
              1. Customer Information
            </h3>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.name ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.name && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name}</span>}
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.email ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
            </div>
            <div>
              <label htmlFor="phone" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.phone}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Shipping Information */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
              2. Shipping Information
            </h3>
            <div>
              <label htmlFor="address" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Street Address</label>
              <input
                id="address"
                type="text"
                placeholder="123 Main St, Apartment 4B"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.address ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.address && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.address}</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 2 }}>
                <label htmlFor="city" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Pune"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.city ? '#ef4444' : '#cbd5e1'}` }}
                />
                {errors.city && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.city}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="postalCode" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>PIN / Zip</label>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="411057"
                  value={formData.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.postalCode ? '#ef4444' : '#cbd5e1'}` }}
                />
                {errors.postalCode && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.postalCode}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Information */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>
              3. Payment Details
            </h3>
            <div>
              <label htmlFor="cardNumber" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Card Number</label>
              <input
                id="cardNumber"
                type="text"
                placeholder="4532 •••• •••• 8890"
                maxLength={19}
                value={formData.cardNumber}
                onChange={(e) => updateField('cardNumber', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.cardNumber ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.cardNumber && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.cardNumber}</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="cardExpiry" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Expiry</label>
                <input
                  id="cardExpiry"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={formData.cardExpiry}
                  onChange={(e) => updateField('cardExpiry', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.cardExpiry ? '#ef4444' : '#cbd5e1'}` }}
                />
                {errors.cardExpiry && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.cardExpiry}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="cardCvv" style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>CVV</label>
                <input
                  id="cardCvv"
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={formData.cardCvv}
                  onChange={(e) => updateField('cardCvv', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${errors.cardCvv ? '#ef4444' : '#cbd5e1'}` }}
                />
                {errors.cardCvv && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.cardCvv}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Delivered / Order Placed Summary */}
        {currentStep === 3 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              ✓
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Order Placed & Scheduled for Delivery!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>
              Tracking ID: <strong>{orderId}</strong>
            </p>

            <div
              style={{
                textAlign: 'left',
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div><strong>Recipient:</strong> {formData.name} ({formData.phone})</div>
              <div><strong>Shipping Destination:</strong> {formData.address}, {formData.city} - {formData.postalCode}</div>
              <div><strong>Payment Method:</strong> Card ending in •••• {formData.cardNumber.slice(-4) || '8890'}</div>
              <div><strong>Delivery Status:</strong> Out for Delivery 🚚</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {currentStep < 3 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              color: '#334155',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.4 : 1,
              fontWeight: 600,
            }}
          >
            Back
          </button>
        )}

        {currentStep < 2 && (
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              marginLeft: 'auto',
            }}
          >
            Next
          </button>
        )}

        {currentStep === 2 && (
          <button
            type="button"
            onClick={handleNext}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#16a34a',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              marginLeft: 'auto',
            }}
          >
            Place Order
          </button>
        )}

        {currentStep === 3 && (
          <button
            type="button"
            onClick={() => {
              setFormData(INITIAL_DATA);
              setCurrentStep(0);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              width: '100%',
            }}
          >
            Book Another Order
          </button>
        )}
      </div>
    </div>
  );
};

```

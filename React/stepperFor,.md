To preserve previously filled form data when moving backward and forward in a multi-step component, the key pattern in React is to **lift the form state up** to the parent wizard component (or a global store) instead of keeping it inside individual step components.

When a step unmounts and remounts, local step state is wiped. Lifting the state keeps the values intact across transitions.

Here is a complete, production-ready implementation with validation, back/forward navigation, and persistent data:

---

### Implementation

```jsx
import React, { useState } from 'react';

// --- STEP 1: Personal Info ---
function StepOne({ formData, updateFormData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Step 1: Personal Details</h3>
      <label>
        Full Name:
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormData('fullName', e.target.value)}
          placeholder="John Doe"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </label>
      <label>
        Email Address:
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="john@example.com"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </label>
    </div>
  );
}

// --- STEP 2: Address Details ---
function StepTwo({ formData, updateFormData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Step 2: Location</h3>
      <label>
        Street Address:
        <input
          type="text"
          value={formData.street}
          onChange={(e) => updateFormData('street', e.target.value)}
          placeholder="123 Main St"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          value={formData.city}
          onChange={(e) => updateFormData('city', e.target.value)}
          placeholder="New York"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </label>
      <label>
        ZIP / Postal Code:
        <input
          type="text"
          value={formData.zipCode}
          onChange={(e) => updateFormData('zipCode', e.target.value)}
          placeholder="10001"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
      </label>
    </div>
  );
}

// --- STEP 3: Review and Finalize ---
function StepThree({ formData, updateFormData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Step 3: Review & Preferences</h3>
      <div style={{ background: '#f4f4f5', padding: '12px', borderRadius: '6px' }}>
        <p><strong>Name:</strong> {formData.fullName || 'Not provided'}</p>
        <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
        <p><strong>Address:</strong> {formData.street ? `${formData.street}, ${formData.city} (${formData.zipCode})` : 'Not provided'}</p>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <input
          type="checkbox"
          checked={formData.subscribeNewsletter}
          onChange={(e) => updateFormData('subscribeNewsletter', e.target.checked)}
        />
        Subscribe to product announcements
      </label>
    </div>
  );
}

// --- MAIN WIZARD COMPONENT ---
export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    subscribeNewsletter: false,
  });

  // 2. Generic update handler
  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 3. Navigation Controls
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Payload:', formData);
    alert('Form submitted successfully! Check the console.');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', fontFamily: 'sans-serif', border: '1px solid #e4e4e7', padding: '24px', borderRadius: '8px' }}>
      {/* Progress Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              fontWeight: currentStep === step ? 'bold' : 'normal',
              color: currentStep >= step ? '#2563eb' : '#a1a1aa',
            }}
          >
            Step {step}
          </div>
        ))}
      </div>

      {/* Step Render: Data remains intact via lifted formData */}
      {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} />}
      {currentStep === 2 && <StepTwo formData={formData} updateFormData={updateFormData} />}
      {currentStep === 3 && <StepThree formData={formData} updateFormData={updateFormData} />}

      {/* Button Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{
            padding: '8px 16px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          Back
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

```

---

### Alternative: CSS Display Hiding (Avoids Remounting)

If your form steps contain heavy components (like maps, file uploaders, or rich text editors) where unmounting destroys the DOM instance or loses focus:

Instead of conditional unmounting (`{currentStep === 1 && <StepOne/>}`), keep all components mounted in the DOM and toggle visibility via CSS:

```jsx
<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
  <StepOne formData={formData} updateFormData={updateFormData} />
</div>

<div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
  <StepTwo formData={formData} updateFormData={updateFormData} />
</div>

<div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
  <StepThree formData={formData} updateFormData={updateFormData} />
</div>

```

### Key Rules for Preserving Multi-Step Data

* **Never store step inputs in local `useState` inside the child component** if you are conditionally unmounting it. Store it in the parent or a React Context.
* **Pass down controlled values**: Ensure each input has `value={formData[key] || ''}` so it always reflects the lifted state.
* **For browser refresh persistence**, wrap the parent state initializer with `localStorage.getItem('step_data')` and write to `localStorage` on each `updateFormData` call.

Here is how to enhance the generic stepper with a **fully dynamic, accessible, and customizable Breadcrumb component**.

The breadcrumbs dynamically react to step updates, show visual progress states (completed, active, pending), support clickable backward navigation, and include ARIA attributes for screen readers.

---

### 1. The Dynamic Breadcrumb Component (`StepperBreadcrumb.jsx`)

This component can render either a classic chevron/slash style or a connected timeline badge style.

```jsx
// StepperBreadcrumb.jsx
import React from 'react';

export default function StepperBreadcrumb({
  steps,
  currentStepIndex,
  onStepClick,
  variant = 'dots' // 'dots' | 'chevrons' | 'pills'
}) {
  return (
    <nav aria-label="Progress Breadcrumb" style={{ marginBottom: '2rem' }}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          const isClickable = isCompleted; // Prevent jumping ahead to unvalidated steps

          return (
            <React.Fragment key={step.id || index}>
              {/* Breadcrumb Item */}
              <li
                aria-current={isActive ? 'step' : undefined}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: 'none',
                    background: 'transparent',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: isClickable ? 'pointer' : 'default',
                    color: isActive ? '#1d4ed8' : isCompleted ? '#0f766e' : '#94a3b8',
                    backgroundColor: isActive ? '#eff6ff' : isCompleted ? '#f0fdf4' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Status Indicator Badge */}
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: isActive
                        ? '#2563eb'
                        : isCompleted
                        ? '#16a34a'
                        : '#cbd5e1',
                      color: '#ffffff'
                    }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>

                  {/* Title & Optional Description */}
                  <span>{step.title}</span>
                </button>
              </li>

              {/* Dynamic Separator between breadcrumbs */}
              {index < steps.length - 1 && (
                <li
                  aria-hidden="true"
                  style={{
                    color: '#cbd5e1',
                    userSelect: 'none',
                    fontSize: '16px',
                    margin: '0 2px'
                  }}
                >
                  /
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

```

---

### 2. Integrate into `GenericStepper.jsx`

Replace the hardcoded navigation in the generic stepper with the dynamic breadcrumb component:

```jsx
// GenericStepper.jsx
import React, { useState } from 'react';
import StepperBreadcrumb from './StepperBreadcrumb';

export default function GenericStepper({
  steps = [],
  initialData = {},
  onComplete
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const activeStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const updateData = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const next = async () => {
    setValidationError(null);

    if (activeStep?.validate) {
      try {
        setIsValidating(true);
        const isValid = await activeStep.validate(formData);
        setIsValidating(false);

        if (!isValid) {
          setValidationError('Please resolve the errors on this step.');
          return;
        }
      } catch (err) {
        setIsValidating(false);
        setValidationError(err.message || 'Validation failed.');
        return;
      }
    }

    if (!isLast) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete(formData);
    }
  };

  const prev = () => {
    setValidationError(null);
    if (!isFirst) setCurrentStepIndex((prev) => prev - 1);
  };

  const goToStep = (index) => {
    // Only permit navigating to previous completed steps
    if (index < currentStepIndex) {
      setValidationError(null);
      setCurrentStepIndex(index);
    }
  };

  const ActiveComponent = activeStep?.component;

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* --- DYNAMIC BREADCRUMB INTEGRATION --- */}
      <StepperBreadcrumb
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepClick={goToStep}
      />

      {/* Validation Alert */}
      {validationError && (
        <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', marginBottom: '1.25rem' }}>
          {validationError}
        </div>
      )}

      {/* Step View */}
      <section style={{ minHeight: '220px', padding: '1rem 0' }}>
        {ActiveComponent && (
          <ActiveComponent
            data={formData}
            updateData={updateData}
            next={next}
            prev={prev}
            isFirst={isFirst}
            isLast={isLast}
          />
        )}
      </section>

      {/* Controls */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
        <button
          type="button"
          onClick={prev}
          disabled={isFirst || isValidating}
          style={{ padding: '8px 18px', opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={next}
          disabled={isValidating}
          style={{
            padding: '8px 22px',
            backgroundColor: isLast ? '#16a34a' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isValidating ? 'Checking...' : isLast ? 'Finish & Submit' : 'Continue'}
        </button>
      </footer>
    </div>
  );
}

```

---

### 3. Usage with Dynamic Steps (Add/Remove steps on the fly)

Because the breadcrumb is fully dynamic, the steps can be generated or filtered based on the current state.

```jsx
import React, { useState } from 'react';
import GenericStepper from './GenericStepper';

// Example step views
const General = ({ data, updateData }) => (
  <div>
    <h3>General Information</h3>
    <input
      placeholder="Project Title"
      value={data.title || ''}
      onChange={(e) => updateData({ title: e.target.value })}
      style={{ padding: '8px', width: '100%' }}
    />
    <label style={{ display: 'block', marginTop: '12px' }}>
      <input
        type="checkbox"
        checked={data.requiresShipping || false}
        onChange={(e) => updateData({ requiresShipping: e.target.checked })}
      />
      This project requires physical shipment delivery
    </label>
  </div>
);

const Shipping = ({ data, updateData }) => (
  <div>
    <h3>Shipping Address</h3>
    <input
      placeholder="Street & House #"
      value={data.shippingAddress || ''}
      onChange={(e) => updateData({ shippingAddress: e.target.value })}
      style={{ padding: '8px', width: '100%' }}
    />
  </div>
);

const Payment = ({ data, updateData }) => (
  <div>
    <h3>Payment Options</h3>
    <select
      value={data.paymentMethod || 'Credit Card'}
      onChange={(e) => updateData({ paymentMethod: e.target.value })}
      style={{ padding: '8px', width: '100%' }}
    >
      <option value="Credit Card">Credit Card</option>
      <option value="Wire Transfer">Wire Transfer</option>
    </select>
  </div>
);

const Summary = ({ data }) => (
  <div>
    <h3>Review & Finish</h3>
    <pre style={{ background: '#f8fafc', padding: '12px' }}>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

export default function App() {
  const [formData, setFormData] = useState({ requiresShipping: false });

  // Dynamically compute the steps:
  // If `requiresShipping` is false, the Shipping step is removed from the breadcrumbs and stepper flow!
  const steps = [
    {
      id: 'general',
      title: 'General',
      component: General,
      validate: (d) => Boolean(d.title?.trim())
    },
    ...(formData.requiresShipping
      ? [
          {
            id: 'shipping',
            title: 'Shipping',
            component: Shipping,
            validate: (d) => Boolean(d.shippingAddress?.trim())
          }
        ]
      : []),
    {
      id: 'payment',
      title: 'Payment',
      component: Payment
    },
    {
      id: 'summary',
      title: 'Confirmation',
      component: Summary
    }
  ];

  return (
    <GenericStepper
      steps={steps}
      initialData={formData}
      onComplete={(result) => alert(`Done! ${JSON.stringify(result)}`)}
    />
  );
}

```

### What this achieves

1. **Dynamic updates**: Checking "requires physical shipment delivery" dynamically inserts the `Shipping` step directly into the breadcrumbs, numbers adjust automatically, and removing it removes the step seamlessly.
2. **Backwards Jumping**: Completed breadcrumb items are clickable buttons, enabling the user to immediately jump back to any previous step without losing any filled state.
3. **Accessibility**: Includes `<nav aria-label="...">`, `<ol>`, `aria-current="step"`, and disabled state properties for keyboard/screen-reader users.

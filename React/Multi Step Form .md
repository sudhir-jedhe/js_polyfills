***  Multi Step Form .md ***

An accessible, production-ready React Multi-Step Form with step-by-step state preservation, per-step field validation, and an interactive progress indicator.

---

### Component Implementation

```tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  // Step 2: Account Details
  username: string;
  role: string;
  // Step 3: Preferences
  newsletter: boolean;
  notifications: string;
}

const INITIAL_DATA: FormData = {
  fullName: '',
  email: '',
  username: '',
  role: 'developer',
  newsletter: true,
  notifications: 'email',
};

const STEPS = ['Personal Info', 'Account Setup', 'Preferences', 'Review'];

export const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Valid email is required';
      }
    } else if (currentStep === 1) {
      if (!formData.username.trim() || formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: '480px', margin: '40px auto', padding: '32px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#16a34a' }}>Application Submitted!</h2>
        <p>Thank you, <strong>{formData.fullName}</strong>. Your profile is all set.</p>
        <button
          onClick={() => {
            setFormData(INITIAL_DATA);
            setCurrentStep(0);
            setIsSubmitted(false);
          }}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '40px auto',
        padding: '28px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', position: 'relative' }}>
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;

          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? '#16a34a' : isActive ? '#2563eb' : '#e2e8f0',
                  color: isDone || isActive ? '#fff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  zIndex: 2,
                }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '12px', marginTop: '6px', color: isActive ? '#0f172a' : '#64748b', fontWeight: isActive ? 600 : 400, textAlign: 'center' }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Step 1: Personal Info */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="fullName" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Full Name</label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${errors.fullName ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.fullName}</span>}
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${errors.email ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Account Setup */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => updateField('username', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${errors.username ? '#ef4444' : '#cbd5e1'}` }}
              />
              {errors.username && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.username}</span>}
            </div>

            <div>
              <label htmlFor="role" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Primary Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => updateField('role', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Product Manager</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => updateField('newsletter', e.target.checked)}
              />
              Subscribe to weekly engineering newsletter
            </label>

            <div>
              <span style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Notification Frequency:</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="radio"
                    name="notifications"
                    value="email"
                    checked={formData.notifications === 'email'}
                    onChange={(e) => updateField('notifications', e.target.value)}
                  />
                  Email
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="radio"
                    name="notifications"
                    value="slack"
                    checked={formData.notifications === 'slack'}
                    onChange={(e) => updateField('notifications', e.target.value)}
                  />
                  Slack
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary / Review */}
        {currentStep === 3 && (
          <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Full Name:</strong> {formData.fullName}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            <div><strong>Username:</strong> {formData.username}</div>
            <div><strong>Role:</strong> {formData.role}</div>
            <div><strong>Newsletter:</strong> {formData.newsletter ? 'Subscribed' : 'No'}</div>
            <div><strong>Notifications:</strong> {formData.notifications}</div>
          </div>
        )}

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
          >
            Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#16a34a',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Submit Form
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

```

---

### Key Architectural Patterns

* **Single Source of Truth (`formData`)**: Holds all field inputs in a top-level state object so transitions between steps do not lose user data.
* **Per-Step Guard Validation (`validateStep`)**: Blocks forward progress until inputs on the active step satisfy validation criteria.
* **Declarative Conditional Rendering**: Matches UI screens to `currentStep` while keeping the global `<form>` wrapper intact for native submission.

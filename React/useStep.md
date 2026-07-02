# `useStep` Hook (Wizard / Stepper Hook)

A reusable hook for:

```text
✅ Multi-Step Forms
✅ Checkout Flow
✅ Event Creation Wizard
✅ Onboarding Flow
✅ Survey Forms
✅ Interview Machine Coding
```

***

# Basic `useStep`

```jsx
import { useState } from "react";

export function useStep(
  totalSteps = 1,
  initialStep = 1
) {
  const [step, setStep] =
    useState(initialStep);

  const next = () =>
    setStep(current =>
      Math.min(
        totalSteps,
        current + 1
      )
    );

  const prev = () =>
    setStep(current =>
      Math.max(
        1,
        current - 1
      )
    );

  const goTo = value => {
    if (
      value >= 1 &&
      value <= totalSteps
    ) {
      setStep(value);
    }
  };

  const reset = () =>
    setStep(initialStep);

  return {
    step,
    next,
    prev,
    goTo,
    reset,
    isFirstStep:
      step === 1,
    isLastStep:
      step === totalSteps,
    totalSteps,
  };
}
```

***

# Usage

```jsx
function App() {
  const {
    step,
    next,
    prev,
    isFirstStep,
    isLastStep,
  } = useStep(3);

  return (
    <div>
      <h1>
        Step {step}
      </h1>

      {!isFirstStep && (
        <button
          onClick={prev}
        >
          Previous
        </button>
      )}

      {!isLastStep && (
        <button
          onClick={next}
        >
          Next
        </button>
      )}
    </div>
  );
}
```

***

# Advanced Version (Steps Array)

```jsx
import { useState } from "react";

export function useStep(
  steps = []
) {
  const [index, setIndex] =
    useState(0);

  const next = () =>
    setIndex(i =>
      Math.min(
        i + 1,
        steps.length - 1
      )
    );

  const prev = () =>
    setIndex(i =>
      Math.max(0, i - 1)
    );

  const goTo = step =>
    setIndex(step);

  return {
    currentStep:
      steps[index],
    currentIndex:
      index,
    totalSteps:
      steps.length,
    next,
    prev,
    goTo,
    isFirst:
      index === 0,
    isLast:
      index ===
      steps.length - 1,
  };
}
```

***

# Event Wizard Example

```jsx
const {
  currentStep,
  next,
  prev,
} = useStep([
  "Event",
  "Location",
  "Date",
]);

return (
  <>
    {currentStep ===
      "Event" && (
      <EventForm />
    )}

    {currentStep ===
      "Location" && (
      <LocationForm />
    )}

    {currentStep ===
      "Date" && (
      <DateForm />
    )}

    <button
      onClick={prev}
    >
      Back
    </button>

    <button
      onClick={next}
    >
      Next
    </button>
  </>
);
```

***

# Production Version (With Validation)

```jsx
export function useStep(
  totalSteps,
  validateStep
) {
  const [step, setStep] =
    useState(1);

  const next = async () => {
    const valid =
      await validateStep(
        step
      );

    if (!valid) return;

    setStep(s =>
      Math.min(
        totalSteps,
        s + 1
      )
    );
  };

  const prev = () =>
    setStep(s =>
      Math.max(
        1,
        s - 1
      )
    );

  return {
    step,
    next,
    prev,
  };
}
```

***

# Enterprise Version (Store Step Data)

```jsx
export function useStepWizard(
  totalSteps
) {
  const [step, setStep] =
    useState(1);

  const [values, setValues] =
    useState({});

  const saveStepData =
    data => {
      setValues(prev => ({
        ...prev,
        ...data,
      }));
    };

  return {
    step,
    values,
    saveStepData,
    next: () =>
      setStep(s =>
        Math.min(
          totalSteps,
          s + 1
        )
      ),
    prev: () =>
      setStep(s =>
        Math.max(
          1,
          s - 1
        )
      ),
  };
}
```

### Data Example

```js
{
  name: "Sudhir",
  email: "sudhir@test.com",
  city: "Pune",
  date: "2026-07-02"
}
```

Values persist between steps.

***

# Senior Interview Follow-Up

### Features Expected

```text
✅ Next
✅ Previous
✅ Skip Step
✅ Conditional Step

✅ Step Validation

✅ Save Step Data

✅ Dynamic Steps

✅ Progress Bar

✅ URL Synchronization

✅ Resume Later

✅ Auto Save Draft

✅ React Hook Form Integration

✅ Zod Validation
```

### Complexity

```text
Next      O(1)
Previous  O(1)
GoTo      O(1)
SaveData  O(1)
```

### Real World Usage

```text
Amazon Checkout

Event Creation Wizard

Employee Onboarding

Insurance Forms

Loan Applications

Tax Filing (TurboTax)
```

This is the `useStep` hook implementation typically expected in Senior React interviews when building reusable multi-step workflows.


Below are **real-world `useStep` wizard examples** frequently asked in Senior React interviews.

***

# 1. Amazon Checkout Flow

### Flow

```text
Cart
 ↓
Shipping Address
 ↓
Delivery Options
 ↓
Payment Method
 ↓
Review Order
 ↓
Place Order
```

### useStep

```jsx
const checkoutSteps = [
  "cart",
  "shipping",
  "delivery",
  "payment",
  "review",
  "success",
];

const {
  currentStep,
  next,
  prev,
} = useStep(checkoutSteps);
```

### Conditional Navigation

```jsx
if (cartItems.length === 0) {
  return <EmptyCart />;
}
```

### Persist Data

```jsx
{
  shippingAddress,
  paymentMethod,
  deliveryOption,
}
```

***

# 2. Event Creation Wizard

### Flow

```text
Event Information
      ↓
Location
      ↓
Date & Settings
      ↓
Confirmation
```

### Conditional Step

```text
Online Event
      ↓
Skip Location
      ↓
Date & Settings
```

```jsx
if (isOnline) {
  goTo(3);
}
```

### State

```jsx
{
  name,
  description,
  isOnline,
  location,
  date,
  capacity
}
```

***

# 3. Employee Onboarding

### Flow

```text
Personal Information
      ↓
Contact Details
      ↓
Education
      ↓
Employment History
      ↓
Documents Upload
      ↓
Review & Submit
```

### Step Validation

```jsx
next() only after

firstName ✅
lastName ✅
email ✅
phone ✅
```

### Persist Documents

```jsx
resume.pdf
aadhaar.pdf
photo.jpg
```

### Progress

```text
Step 4/6
66% Complete
```

***

# 4. Insurance Application

### Flow

```text
Personal Details
      ↓
Medical History
      ↓
Nominee Information
      ↓
Coverage Selection
      ↓
Payment
      ↓
Policy Confirmation
```

### Dynamic Flow

Example:

```text
Age > 60
      ↓
Extra Medical Questions
```

```jsx
if (age > 60) {
  goTo("medical");
}
```

***

# 5. Loan Application

### Flow

```text
Basic Information
      ↓
Employment Details
      ↓
Income Details
      ↓
Documents
      ↓
Review
      ↓
Submit
```

### Conditional Branching

```text
Salaried
     ↓
Salary Information

Self Employed
     ↓
Business Information
```

```jsx
if (
  employmentType ===
  "SELF_EMPLOYED"
) {
  goTo("business");
}
```

### Persisted Data

```jsx
PAN
Income
Bank Details
IT Returns
```

***

# 6. TurboTax Filing Wizard

One of the most complex wizard systems.

### Flow

```text
Personal Info
      ↓
Income Sources
      ↓
Employment Income
      ↓
Business Income
      ↓
Deductions
      ↓
Tax Credits
      ↓
Review
      ↓
File Return
```

### Dynamic Step Injection

Example:

```text
User selects

Business Income

↓

Insert:

Business Expenses Step
```

```jsx
steps.push(
  "businessExpenses"
);
```

***

# Generic Enterprise `useStepWizard`

```jsx
function useStepWizard(
  initialSteps
) {
  const [steps, setSteps] =
    useState(initialSteps);

  const [index, setIndex] =
    useState(0);

  const [data, setData] =
    useState({});

  const saveData =
    values => {
      setData(prev => ({
        ...prev,
        ...values,
      }));
    };

  const next = () =>
    setIndex(i =>
      Math.min(
        i + 1,
        steps.length - 1
      )
    );

  const prev = () =>
    setIndex(i =>
      Math.max(0, i - 1)
    );

  const appendStep =
    stepName => {
      if (
        !steps.includes(
          stepName
        )
      ) {
        setSteps(prev => [
          ...prev,
          stepName,
        ]);
      }
    };

  return {
    currentStep:
      steps[index],
    index,
    data,
    saveData,
    next,
    prev,
    appendStep,
  };
}
```

***

# Architecture Used in Large Products

```text
WizardProvider
        ↓
useStepWizard
        ↓
Step Components
        ↓
Validation Layer
(Zod / Yup)
        ↓
Persistence Layer
(LocalStorage/API)
        ↓
Progress Tracker
        ↓
Review Page
```

***

# Senior Interview Follow-up Questions

### Q. How do you persist step data?

```jsx
Context
Redux Toolkit
URL State
LocalStorage
Backend Draft API
```

***

### Q. How do you support Resume Later?

```jsx
localStorage.setItem(
  "wizardDraft",
  JSON.stringify(data)
);
```

or

```text
Save Draft API
```

***

### Q. How do you support dynamic steps?

```jsx
steps.splice(...)
steps.push(...)
steps.filter(...)
```

based on user answers.

***

### Q. How do you handle validation?

```text
React Hook Form
        +
Zod
```

Validate before:

```jsx
next();
```

***

# Staff Engineer Answer

A production wizard should support:

```text
✅ Dynamic Steps

✅ Conditional Navigation

✅ Persisted State

✅ Save Draft

✅ Resume Later

✅ Cross-Step Validation

✅ Analytics

✅ Accessibility

✅ URL Synchronisation

✅ Offline Support

✅ Auto Save

✅ Review & Edit
```

and should be implemented as a reusable `useStepWizard` abstraction rather than embedding navigation logic inside individual forms.

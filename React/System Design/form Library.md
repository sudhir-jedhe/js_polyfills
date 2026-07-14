# Reusable & Extensible Generic Form Library in React

### Senior React System Design + Complete Interview-Ready Code

Forms are one of the most complex parts of any application:

```txt
Signup / Login
Profile Update
Payment
Onboarding Wizards
Admin Dashboards
Search Filters
Insurance Forms
Job Applications
```

A **generic form library** should support:

✅ Reusable Fields (Input, Select, Radio, Checkbox, Textarea, DatePicker)

✅ Configurable Schema

✅ Dynamic Fields

✅ Validation Support (Sync + Async)

✅ Error Handling

✅ Nested Fields

✅ Conditional Fields

✅ Custom Components

✅ Accessibility

✅ Type-Safe (TypeScript optional)

---

# 1. System Design

```txt
FormProvider (Context)
     │
     ▼
useForm() Hook
     │
     ▼
Form Fields
     │
     ├── Input
     ├── Select
     ├── Checkbox
     ├── Radio
     └── Textarea
     ▼
Validation Layer
     │
     ▼
Error Layer
     │
     ▼
Submit Handler
```

---

# 2. Component Architecture

```txt
Form
│
├── useForm() Hook
│
├── FormProvider (Context)
│
├── FormField
│    ├── Input
│    ├── Select
│    ├── Radio
│    └── Checkbox
│
├── Validation Layer
│
└── Submit Button
```

---

# 3. Project Structure

```txt
src/
│
├── App.jsx
│
├── form/
│   ├── FormProvider.jsx
│   ├── useForm.js
│   ├── FormField.jsx
│   ├── fields/
│   │   ├── TextField.jsx
│   │   ├── SelectField.jsx
│   │   ├── CheckboxField.jsx
│   │   └── RadioField.jsx
│   ├── validators.js
│   └── SubmitButton.jsx
│
└── styles.css
```

---

# 4. FormProvider

```jsx
import { createContext, useContext, useState, useCallback } from "react";

const FormContext = createContext();

export function FormProvider({ initialValues = {}, onSubmit, children }) {
  const [values, setValues] = useState(initialValues);

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      values,
      errors,
    });
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        touched,

        setFieldValue,
        setFieldError,
        setFieldTouched,
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

export function useForm() {
  return useContext(FormContext);
}
```

---

# 5. Validators

```js
export const required = (value) => (value ? "" : "Required");

export const email = (value) =>
  /\S+@\S+\.\S+/.test(value) ? "" : "Invalid Email";

export const minLength = (n) => (value) =>
  value.length >= n ? "" : `Min ${n} chars`;

export const compose =
  (...validators) =>
  (value) => {
    for (const fn of validators) {
      const message = fn(value);

      if (message) return message;
    }

    return "";
  };
```

---

# 6. Base Form Field

```jsx
import { useForm } from "./FormProvider";

export function FormField({ name, label, as: Component, validate, ...props }) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useForm();

  const value = values[name] ?? "";

  const error = errors[name];

  const isTouched = touched[name];

  function handleChange(event) {
    const newValue = event.target ? event.target.value : event;

    setFieldValue(name, newValue);

    if (validate) {
      setFieldError(name, validate(newValue));
    }
  }

  function handleBlur() {
    setFieldTouched(name);
  }

  return (
    <div className="field">
      <label>{label}</label>

      <Component
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {isTouched && error && <span className="error">{error}</span>}
    </div>
  );
}
```

---

# 7. Prebuilt Fields

## TextField.jsx

```jsx
import { FormField } from "../FormField";

export default function TextField({ name, label, validate, ...props }) {
  return (
    <FormField
      name={name}
      label={label}
      validate={validate}
      as="input"
      {...props}
    />
  );
}
```

---

## SelectField.jsx

```jsx
import { FormField } from "../FormField";

export default function SelectField({ name, label, options, validate }) {
  return (
    <FormField name={name} label={label} validate={validate} as="select">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FormField>
  );
}
```

---

## CheckboxField.jsx

```jsx
import { FormField } from "../FormField";

export default function CheckboxField({ name, label }) {
  return <FormField name={name} label={label} as="input" type="checkbox" />;
}
```

---

# 8. Submit Button

```jsx
export default function SubmitButton({ children }) {
  return <button type="submit">{children}</button>;
}
```

---

# 9. Usage Example

## App.jsx

```jsx
import { FormProvider } from "./form/FormProvider";

import TextField from "./form/fields/TextField";

import SelectField from "./form/fields/SelectField";

import CheckboxField from "./form/fields/CheckboxField";

import SubmitButton from "./form/SubmitButton";

import { required, email, minLength, compose } from "./form/validators";

export default function App() {
  return (
    <FormProvider
      initialValues={{
        firstName: "",
        email: "",
        country: "in",
        subscribe: false,
      }}
      onSubmit={({ values, errors }) => {
        console.log(values, errors);
      }}
    >
      <TextField
        name="firstName"
        label="First Name"
        validate={compose(required, minLength(3))}
      />

      <TextField
        name="email"
        label="Email"
        validate={compose(required, email)}
      />

      <SelectField
        name="country"
        label="Country"
        options={[
          {
            label: "India",
            value: "in",
          },
          {
            label: "USA",
            value: "us",
          },
        ]}
      />

      <CheckboxField name="subscribe" label="Subscribe to Newsletter" />

      <SubmitButton>Submit</SubmitButton>
    </FormProvider>
  );
}
```

---

# 10. CSS

```css
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field label {
  font-weight: 600;
}

.error {
  color: red;
  font-size: 12px;
}
```

---

# 11. How It Works

```txt
User Types
     │
     ▼
FormField
     │
     ▼
setFieldValue()
     │
     ▼
Validation Runs
     │
     ▼
Error Updated
     │
     ▼
Rerender With Error
     │
     ▼
On Submit
     │
     ▼
values + errors
```

---

# 12. Extensibility

Add:

✅ Async validation (email exists?)

✅ Nested objects

✅ Conditional rendering

✅ Field arrays (Add multiple education entries)

✅ Wizard steps

✅ File uploads

✅ RTL Support

✅ Yup / Zod schema integration

---

# 13. Schema-Driven Version

Some libraries follow schema-driven approach:

```jsx
const schema = {
  firstName: {
    type: "text",
    label: "First Name",
    required: true
  },
  email: {
    type: "email",
    label: "Email"
  },
  country: {
    type: "select",
    options: [...]
  }
};
```

Then:

```jsx
<GenericForm schema={schema} />
```

Generates the form automatically.

---

# 14. Optimizations

### 1. Reduce Re-Renders

Use `useCallback`, `React.memo`.

---

### 2. Selective Field Rerenders

Store fields separately:

```txt
Per-field state slices
```

---

### 3. Async Validation

```jsx
await checkEmailExists(value);
```

---

### 4. Schema Validators

Support:

```txt
Yup
Zod
Joi
```

---

### 5. Accessibility

```jsx
aria-invalid={
  Boolean(error)
}
```

---

# 15. Comparison With Popular Libraries

| Feature        | Our Library | react-hook-form | Formik |
| -------------- | ----------- | --------------- | ------ |
| Context Based  | ✅          | ❌              | ✅     |
| Extensible     | ✅          | ✅              | ✅     |
| Simple API     | ✅          | ✅              | ✅     |
| Custom Fields  | ✅          | ✅              | ✅     |
| Schema Support | Optional    | ✅              | ✅     |

---

# 16. Senior React Interview Answer

> I built a reusable, extensible form library using React Context to share form state across nested components. The library exposes a `FormProvider`, a `useForm` hook, and a generic `FormField` component that supports any input type through the `as` prop. Field-level validation is composable using small pure functions, and errors are automatically tracked with `touched` state. The library is easily extensible with additional fields such as select, checkbox, radio, textarea, or custom components, and can support async validation, nested objects, conditional rendering, and schema-driven forms using Yup or Zod. This architecture separates state management, UI, and validation logic, making it scalable, testable, and easy to reuse across enterprise-grade applications.

# Advanced Form Library Extensions

### Async Validation • Nested Fields • Conditional Fields

These are the **three most important senior-level extensions** for a reusable React form library.

They convert a simple form into a **production-grade, enterprise form engine**.

---

# 1. Async Validation

## Why?

Sync validation:

```txt
Required
Min Length
Email format
```

Async validation:

```txt
Email already exists?
Username already taken?
Coupon valid?
Discount available?
Server-side rule check?
```

Requires API call.

---

## Async Flow

```txt
User Types
     │
     ▼
Debounce
     │
     ▼
API Call
     │
     ▼
Server Response
     │
     ▼
Update Error State
```

---

## Async Validator Example

```jsx
export async function checkEmailExists(value) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const taken = ["sudhir@test.com", "admin@test.com"];

  return taken.includes(value) ? "Email already taken" : "";
}
```

---

## FormProvider Enhancement

Add async validators to state:

```jsx
const [validating, setValidating] = useState({});
```

---

## setFieldValueAsync

```jsx
async function setFieldValueAsync(name, value, asyncValidator) {
  setFieldValue(name, value);

  if (asyncValidator) {
    setValidating((prev) => ({
      ...prev,
      [name]: true,
    }));

    const errorMessage = await asyncValidator(value);

    setFieldError(name, errorMessage);

    setValidating((prev) => ({
      ...prev,
      [name]: false,
    }));
  }
}
```

---

## Async Field Usage

```jsx
<TextField
  name="email"
  label="Email"
  validate={compose(required, email)}
  asyncValidate={checkEmailExists}
/>
```

---

## FormField Enhancement

Inside `FormField`:

```jsx
async function handleBlur() {
  setFieldTouched(name);

  if (asyncValidate) {
    await setFieldValueAsync(name, value, asyncValidate);
  }
}
```

---

## UX Loading State

```jsx
{
  validating[name] && <span>Checking...</span>;
}
```

---

## Async Example

Email:

```txt
sudhir@test.com
```

Result:

```txt
Email already taken
```

Email:

```txt
new@test.com
```

Result:

```txt
Valid
```

---

# 2. Nested Fields

## Why?

Real forms often contain:

```txt
User
 ├── Name
 └── Address
      ├── City
      ├── State
      └── Zip
```

Or:

```txt
Payment
 ├── Card
 │    ├── Number
 │    ├── Expiry
 │    └── CVV
 └── Billing Address
      ├── Line1
      └── Line2
```

---

## Nested Value Structure

```js
{
  user: {
    name: "Sudhir",
    address: {
      city: "Pune",
      state: "MH",
      zip: "411045"
    }
  }
}
```

---

## Getter / Setter Utility

Getter:

```js
export function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
```

Example:

```txt
getNestedValue(values, "user.address.city")
```

---

## Immutable Setter

```js
export function setNestedValue(obj, path, value) {
  const keys = path.split(".");

  const newObj = {
    ...obj,
  };

  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    current[key] = {
      ...current[key],
    };

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;

  return newObj;
}
```

---

## Update FormProvider

Replace:

```jsx
setValues((prev) => ({
  ...prev,
  [name]: value,
}));
```

With:

```jsx
setValues((prev) => setNestedValue(prev, name, value));
```

---

## Read Nested Value

Inside FormField:

```jsx
const value = getNestedValue(values, name);
```

---

## Nested Form Example

```jsx
<TextField
  name="user.address.city"
  label="City"
/>

<TextField
  name="user.address.zip"
  label="ZIP Code"
/>
```

---

## Result

Value stored as:

```js
{
  user: {
    address: {
      city: "Pune",
      zip: "411045"
    }
  }
}
```

Perfect for nested APIs.

---

# 3. Conditional Rendering

## Why?

Real forms hide/show fields dynamically.

Example:

```txt
Country = "India"
   → Show "PAN Card"
```

or

```txt
Employment = "Employed"
   → Show "Company Name"
```

or

```txt
"Do you own a car?" = Yes
   → Show "Car Model"
```

---

## Approach 1: Read Form Values via `useForm`

```jsx
export default function DynamicFields() {
  const { values } = useForm();

  return (
    <>
      {values.country === "in" && <TextField name="panCard" label="PAN Card" />}

      {values.employment === "employed" && (
        <TextField name="company" label="Company Name" />
      )}
    </>
  );
}
```

---

## Approach 2: Schema-Driven Conditional Rendering

Preferred for enterprise use.

---

### Schema

```js
const schema = [
  {
    type: "select",
    name: "country",
    label: "Country",
    options: [
      {
        label: "India",
        value: "in",
      },
      {
        label: "USA",
        value: "us",
      },
    ],
  },

  {
    type: "text",
    name: "panCard",
    label: "PAN Card",
    when: (values) => values.country === "in",
  },

  {
    type: "text",
    name: "ssn",
    label: "SSN",
    when: (values) => values.country === "us",
  },
];
```

---

### Renderer

```jsx
function GenericForm({ schema }) {
  const { values } = useForm();

  return (
    <>
      {schema.map((field) => {
        if (field.when && !field.when(values)) {
          return null;
        }

        switch (field.type) {
          case "text":
            return (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
              />
            );

          case "select":
            return (
              <SelectField
                key={field.name}
                name={field.name}
                label={field.label}
                options={field.options}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}
```

---

### Result

If user picks:

```txt
Country = India
```

PAN Card field shows.

If user picks:

```txt
Country = USA
```

SSN field shows.

---

# 4. Enterprise-Level Extensions

Once we have:

```txt
✅ Async validation
✅ Nested fields
✅ Conditional rendering
```

We can extend it further:

---

## Field Arrays

```js
{
  education: [
    {
      degree: "BE",
      year: 2015,
    },
    {
      degree: "MTech",
      year: 2017,
    },
  ];
}
```

Add/remove entries.

---

## Wizard/Multi-Step Forms

```txt
Step 1: Personal
Step 2: Contact
Step 3: Preferences
Step 4: Payment
```

---

## Schema Validation

Combine with:

```txt
Yup
Zod
Joi
```

Example:

```js
const schema = Yup.object({
  email: Yup.string().required().email(),
});
```

---

## Server-Side Errors

Show global backend errors.

```jsx
setFieldError("email", serverError);
```

---

# Senior React Interview Answer

> I extended the form library with three enterprise-grade capabilities. First, async validation is implemented using debounced API calls, allowing rules like uniqueness checks or coupon validation. Second, nested field support is enabled by using dotted path names such as `user.address.city` and using immutable getter/setter helpers to update deeply nested state. Third, conditional field rendering is handled either directly using the `useForm` hook or through a schema-driven approach where each field defines a `when` predicate that determines its visibility based on form state. Together, these features form the foundation of a reusable enterprise-grade form engine similar to `react-hook-form`, `Formik`, and enterprise ERP frameworks.

***  React hook form tutorial (with zod).md ***

A complete, end-to-end tutorial on integrating **React Hook Form (RHF)** with **Zod** schema validation, covering setup, form state tracking, nested fields, dynamic arrays (`useFieldArray`), and submission handling.

---

### 1. Installation

Install React Hook Form, Zod, and the official Zod resolver bridge:

```bash
npm install react-hook-form zod @hookform/resolvers

```

---

### 2. Define the Zod Schema

Zod validates the data shape and automatically infers TypeScript/JavaScript structure. You can enforce regex rules, numeric transformations, and custom validations (like password matching) using `.refine()`.

```javascript
// schema.js
import { z } from 'zod';

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username cannot exceed 20 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    age: z
      .coerce
      .number({ invalid_type_error: 'Age must be a number' })
      .min(18, 'You must be at least 18 years old'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    // Nested Object Example
    address: z.object({
      city: z.string().min(1, 'City is required'),
      zipCode: z.string().regex(/^\d{5}$/, 'Zip code must be exactly 5 digits'),
    }),
    // Dynamic Array Example
    skills: z
      .array(
        z.object({
          name: z.string().min(1, 'Skill name cannot be empty'),
        })
      )
      .min(1, 'Add at least one skill'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Anchor the error to the confirm field
  });

```

---

### 3. Build the Form Component (`RegistrationForm.jsx`)

Connect the schema to React Hook Form using `zodResolver`.

```jsx
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from './schema';

export default function RegistrationForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched', // Validate when user leaves the field
    defaultValues: {
      username: '',
      email: '',
      age: '',
      password: '',
      confirmPassword: '',
      address: { city: '', zipCode: '' },
      skills: [{ name: 'React' }],
      terms: false,
    },
  });

  // Dynamic Array Hook
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  // Valid submit handler
  const onSubmit = async (data) => {
    // Simulate backend API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Sanitized Form Data:', data);
    alert('Form submitted successfully!');
    reset();
  };

  return (
    <div style={styles.card}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
        {/* Username */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            {...register('username')}
            style={errors.username ? styles.inputError : styles.input}
          />
          {errors.username && <p style={styles.error}>{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            {...register('email')}
            style={errors.email ? styles.inputError : styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email.message}</p>}
        </div>

        {/* Age (Coerced Number) */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Age</label>
          <input
            type="number"
            {...register('age')}
            style={errors.age ? styles.inputError : styles.input}
          />
          {errors.age && <p style={styles.error}>{errors.age.message}</p>}
        </div>

        {/* Nested Address Fields */}
        <div style={styles.row}>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              {...register('address.city')}
              style={errors.address?.city ? styles.inputError : styles.input}
            />
            {errors.address?.city && (
              <p style={styles.error}>{errors.address.city.message}</p>
            )}
          </div>

          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Zip Code</label>
            <input
              type="text"
              {...register('address.zipCode')}
              style={errors.address?.zipCode ? styles.inputError : styles.input}
            />
            {errors.address?.zipCode && (
              <p style={styles.error}>{errors.address.zipCode.message}</p>
            )}
          </div>
        </div>

        {/* Password & Confirm */}
        <div style={styles.row}>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              {...register('password')}
              style={errors.password ? styles.inputError : styles.input}
            />
            {errors.password && <p style={styles.error}>{errors.password.message}</p>}
          </div>

          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              style={errors.confirmPassword ? styles.inputError : styles.input}
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Dynamic Skill List (useFieldArray) */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Skills</label>
          {fields.map((field, index) => (
            <div key={field.id} style={styles.arrayRow}>
              <input
                type="text"
                {...register(`skills.${index}.name`)}
                placeholder={`Skill #${index + 1}`}
                style={
                  errors.skills?.[index]?.name ? styles.inputError : styles.input
                }
              />
              <button
                type="button"
                onClick={() => remove(index)}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
          {errors.skills?.message && (
            <p style={styles.error}>{errors.skills.message}</p>
          )}
          <button
            type="button"
            onClick={() => append({ name: '' })}
            style={styles.addBtn}
          >
            + Add Skill
          </button>
        </div>

        {/* Terms Checkbox */}
        <div style={styles.checkboxGroup}>
          <input type="checkbox" id="terms" {...register('terms')} />
          <label htmlFor="terms" style={styles.checkboxLabel}>
            I agree to the Terms of Service
          </label>
        </div>
        {errors.terms && <p style={styles.error}>{errors.terms.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitBtn,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Register Account'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: '540px',
    margin: '40px auto',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
  },
  inputError: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #ef4444',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#fff5f5',
  },
  error: {
    margin: 0,
    fontSize: '0.78rem',
    color: '#ef4444',
    fontWeight: '500',
  },
  arrayRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  removeBtn: {
    padding: '0 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  addBtn: {
    alignSelf: 'flex-start',
    padding: '6px 12px',
    fontSize: '0.85rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkboxLabel: {
    fontSize: '0.85rem',
    color: '#4b5563',
  },
  submitBtn: {
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '10px',
  },
};

```

---

### 4. Key Concepts Explained

* **`zodResolver(schema)`:** Delegates the form's entire validation lifecycle to Zod. RHF automatically translates Zod validation errors into its own `formState.errors` dictionary.
* **`z.coerce.number()`:** HTML input values always return strings (`"25"`). `z.coerce` casts the string value to a real JavaScript number before executing validations like `.min()`.
* **`useFieldArray`:** Provides performant additions (`append`), deletions (`remove`), and swapping of nested list items without causing unnecessary re-renders across the rest of the form. Always use `field.id` (generated by RHF) as the React `key`.
* **`mode: 'onTouched'`:** Triggers field-level validation as soon as the user focuses and blurs an input, offering early feedback without premature validation errors on empty forms.

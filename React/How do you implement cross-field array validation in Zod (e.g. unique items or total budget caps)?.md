In Zod, validating rules that span multiple items in an array—such as **checking for duplicate entries**, **enforcing a cumulative sum/budget limit**, or **ensuring percentage splits total 100%**—is implemented using **`z.array().refine()`** or **`z.array().superRefine()`**.

While `.refine()` works well for returning a single general error, **`.superRefine()` is essential when you need to attach specific error messages to the exact matching element index (path)** in the array.

---

### 1. Cumulative Budget Limit with `.refine()`

When the total sum of numeric fields across an array must not exceed a parent threshold:

```typescript
// types/budget.ts
import { z } from 'zod';

export const ExpenseItemSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
});

const MAX_BUDGET = 5000;

export const BudgetSchema = z.object({
  department: z.string().min(2),
  expenses: z
    .array(ExpenseItemSchema)
    .min(1, 'At least one expense is required')
    .refine(
      (items) => {
        const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        return total <= MAX_BUDGET;
      },
      (items) => {
        const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        return {
          message: `Total expenses ($${total}) exceed maximum department budget of $${MAX_BUDGET}`,
          // Attaches the error to the root array field
          path: [],
        };
      }
    ),
});

export type BudgetFormData = z.infer<typeof BudgetSchema>;

```

---

### 2. Duplicate Detection with Index-Specific Errors via `.superRefine()`

To highlight the **exact duplicate field** instead of showing a generic array-level error, use `.superRefine()` and `ctx.addIssue()` with explicit `path` targeting:

```typescript
// types/team-allocations.ts
import { z } from 'zod';

export const AllocationRowSchema = z.object({
  email: z.string().email('Invalid email address'),
  percentage: z.coerce.number().min(1).max(100),
});

export const ProjectAllocationSchema = z.object({
  projectName: z.string().min(2),
  allocations: z
    .array(AllocationRowSchema)
    .min(1, 'At least one member is required')
    .superRefine((items, ctx) => {
      // ── Rule 1: Enforce Unique Emails (Flags the exact duplicate index) ──
      const seenEmails = new Map<string, number>();

      items.forEach((item, index) => {
        const normalized = item.email.toLowerCase().trim();
        if (!normalized) return;

        if (seenEmails.has(normalized)) {
          const originalIndex = seenEmails.get(normalized)!;

          // Attach error directly to the current duplicate input
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate team member (already added in row #${originalIndex + 1})`,
            path: [index, 'email'], // Maps to `allocations.${index}.email`
          });
        } else {
          seenEmails.set(normalized, index);
        }
      });

      // ── Rule 2: Cumulative Percentage Check (Must equal 100%) ──
      const totalPercentage = items.reduce((sum, item) => sum + (item.percentage || 0), 0);

      if (totalPercentage !== 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total allocation must equal 100% (currently ${totalPercentage}%)`,
          path: [], // Array root error
        });
      }
    }),
});

```

---

### 3. Cross-Field Parent-to-Array Comparison

When the array constraint depends on a separate parent property (e.g., comparing item sum against a user-defined `maxCap` input):

```typescript
// types/dynamic-limit.ts
import { z } from 'zod';

export const DynamicLimitSchema = z
  .object({
    maxLimit: z.coerce.number().positive('Limit must be greater than 0'),
    items: z.array(
      z.object({
        name: z.string().min(1),
        cost: z.coerce.number().positive(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    const totalCost = data.items.reduce((sum, item) => sum + (item.cost || 0), 0);

    if (totalCost > data.maxLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total line item cost ($${totalCost}) cannot exceed max limit ($${data.maxLimit})`,
        path: ['items'], // Displays above the dynamic item list
      });
    }
  });

```

---

### 4. Handling Error Output in React Server Actions

When issues are generated via `.superRefine()`, `issue.path.join('.')` standardizes the keys so client form hooks (like React Hook Form or `useActionState`) can route error strings directly to individual row fields:

```typescript
// app/actions/validate-allocations.ts
'use server';

import { ProjectAllocationSchema } from '@/types/team-allocations';

export async function submitAllocationsAction(prevState: any, rawData: any) {
  const result = ProjectAllocationSchema.safeParse(rawData);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of result.error.issues) {
      // Formats path to "allocations.1.email" or "allocations"
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }

    return {
      status: 'error',
      fieldErrors,
    };
  }

  return { status: 'success', data: result.data };
}

```

---

### Summary Checklist

* **Use `.refine()**` for simple true/false checks where displaying a single generic error message over the entire list is sufficient.
* **Use `.superRefine()**` when you need to iterate over items and tag specific array indices (`path: [index, 'fieldName']`) with pinpoint error annotations.
* **Normalize Comparisons:** When checking uniqueness for emails, codes, or identifiers, always run `.trim().toLowerCase()` before tracking keys in a `Set` or `Map`.

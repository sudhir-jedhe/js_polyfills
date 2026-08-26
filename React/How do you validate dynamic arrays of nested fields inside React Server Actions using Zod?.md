Validating dynamic arrays of nested fields (like line items in an invoice, team members, or dynamic variants) requires parsing structured form inputs from a flat `FormData` object into a nested JavaScript array before passing it to **Zod’s array schema**.

---

### 1. Schema Definition with Nested Array

Define the single-item schema and wrap it in `z.array()` with refine rules for item-level or cross-field constraints:

```typescript
// types/invoice.ts
import { z } from 'zod';

export const LineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.coerce.number().positive('Unit price must be greater than 0'),
});

export const InvoiceSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  items: z
    .array(LineItemSchema)
    .min(1, 'Invoice must have at least one line item')
    .max(50, 'Maximum 50 items allowed'),
});

export type InvoiceFormData = z.infer<typeof InvoiceSchema>;

```

---

### 2. Flat FormData to Nested Array Parsing Helper

Native HTML form submissions send indexed names (e.g., `items[0].description`, `items[0].quantity`). You can transform these flat entries into a structured object using a generic parser:

```typescript
// lib/form-parser.ts

export function parseNestedFormData(formData: FormData): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    // Matches keys like: items[0].description or items[0].quantity
    const match = key.match(/^(\w+)\[(\d+)\]\.(\w+)$/);

    if (match) {
      const [, arrayName, indexStr, fieldName] = match;
      const index = parseInt(indexStr, 10);

      if (!result[arrayName]) {
        result[arrayName] = [];
      }
      if (!result[arrayName][index]) {
        result[arrayName][index] = {};
      }

      result[arrayName][index][fieldName] = value;
    } else {
      result[key] = value;
    }
  }

  // Filter out sparse/empty array indices if any items were removed
  for (const key of Object.keys(result)) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].filter(Boolean);
    }
  }

  return result;
}

```

---

### 3. Server Action with Structured Error Formatting

Use `z.format()` or `flatten()` to return item-specific path errors (e.g., `items.0.description`):

```typescript
// app/actions/invoice.ts
'use server';

import { InvoiceSchema, type InvoiceFormData } from '@/types/invoice';
import { parseNestedFormData } from '@/lib/form-parser';
import db from '@/lib/db';

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: InvoiceFormData;
};

export async function createInvoiceAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Convert indexed FormData entries into nested JS object
  const rawData = parseNestedFormData(formData);

  // 2. Validate against Zod schema
  const parsed = InvoiceSchema.safeParse(rawData);

  if (!parsed.success) {
    // Map Zod issue paths (e.g., ["items", 0, "quantity"]) to dot-notated keys
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of parsed.error.issues) {
      const pathKey = issue.path.join('.');
      if (!fieldErrors[pathKey]) {
        fieldErrors[pathKey] = [];
      }
      fieldErrors[pathKey].push(issue.message);
    }

    return {
      status: 'error',
      message: 'Please resolve errors in the line items.',
      fieldErrors,
      data: rawData as InvoiceFormData,
    };
  }

  // 3. Persist validated data
  try {
    await db.invoice.create({
      data: {
        clientName: parsed.data.clientName,
        items: {
          create: parsed.data.items,
        },
      },
    });

    return {
      status: 'success',
      message: 'Invoice created successfully!',
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message || 'Database transaction failed',
    };
  }
}

```

---

### 4. Client Form with Dynamic Row Add/Remove

Maintain dynamic item keys on the client using stable identifiers (`crypto.randomUUID()`) to prevent uncontrolled input index desynchronization:

```tsx
// app/components/InvoiceForm.tsx
'use client';

import { useActionState, useState } from 'react';
import { createInvoiceAction, type ActionState } from '@/app/actions/invoice';

interface DynamicItemRow {
  keyId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const initialState: ActionState = {
  status: 'idle',
};

export function InvoiceForm() {
  const [state, formAction, isPending] = useActionState(createInvoiceAction, initialState);

  // Dynamic row array state initialized with one default row
  const [items, setItems] = useState<DynamicItemRow[]>([
    { keyId: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { keyId: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (keyId: string) => {
    if (items.length <= 1) return; // Maintain minimum 1 item constraint
    setItems((prev) => prev.filter((item) => item.keyId !== keyId));
  };

  return (
    <form action={formAction} className="max-w-2xl mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>

      {state.message && (
        <div
          className={`p-3 rounded text-sm ${
            state.status === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Static Root Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Client Name
        </label>
        <input
          name="clientName"
          defaultValue={state.data?.clientName || ''}
          placeholder="Acme Corp"
          className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {state.fieldErrors?.['clientName'] && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors['clientName'][0]}</p>
        )}
      </div>

      {/* Dynamic Line Items */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Line Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            + Add Item
          </button>
        </div>

        {items.map((item, index) => {
          const descError = state.fieldErrors?.[`items.${index}.description`];
          const qtyError = state.fieldErrors?.[`items.${index}.quantity`];
          const priceError = state.fieldErrors?.[`items.${index}.unitPrice`];

          return (
            <div key={item.keyId} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border">
              {/* Description */}
              <div className="flex-1">
                <input
                  name={`items[${index}].description`}
                  defaultValue={item.description}
                  placeholder="Item description"
                  className="w-full border rounded p-1.5 text-sm bg-white"
                />
                {descError && <p className="text-[11px] text-red-500 mt-0.5">{descError[0]}</p>}
              </div>

              {/* Quantity */}
              <div className="w-24">
                <input
                  type="number"
                  name={`items[${index}].quantity`}
                  defaultValue={item.quantity}
                  placeholder="Qty"
                  className="w-full border rounded p-1.5 text-sm bg-white"
                />
                {qtyError && <p className="text-[11px] text-red-500 mt-0.5">{qtyError[0]}</p>}
              </div>

              {/* Unit Price */}
              <div className="w-28">
                <input
                  type="number"
                  step="0.01"
                  name={`items[${index}].unitPrice`}
                  defaultValue={item.unitPrice}
                  placeholder="Price"
                  className="w-full border rounded p-1.5 text-sm bg-white"
                />
                {priceError && <p className="text-[11px] text-red-500 mt-0.5">{priceError[0]}</p>}
              </div>

              {/* Delete Button */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.keyId)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                  aria-label={`Remove row ${index + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {state.fieldErrors?.['items'] && (
          <p className="text-xs text-red-500">{state.fieldErrors['items'][0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
      >
        {isPending ? 'Processing Invoice...' : 'Submit Invoice'}
      </button>
    </form>
  );
}

```

---

### Key Best Practices

* **Use Stable Key IDs for React Rows:** When mapping dynamic input rows, use stable identifiers (`crypto.randomUUID()`) for `key={item.keyId}`. Using the array index as the React `key` causes inputs to retain old DOM values when intermediate rows are removed.
* **Filter Sparse Indices:** When converting `items[0]`, `items[2]` from `FormData` after row deletion, filter empty slots (`array.filter(Boolean)`) before validation so Zod receives a contiguous array.
* **Map Error Paths with `issue.path.join('.')`:** Standardizing error paths as `items.0.description` makes lookup in the client view straightforward via direct property indexing (`state.fieldErrors?.[items.${index}.description]`).

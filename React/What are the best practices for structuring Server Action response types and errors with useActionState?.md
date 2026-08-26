Structuring Server Action responses properly ensures type safety, clean error rendering, and smooth interoperability with React 19’s `useActionState`.

The industry standard pattern is to use a **Discriminated Union / Result Object** pattern rather than throwing uncaught exceptions for expected validation or business logic errors.

---

### 1. Define a Standard Action Result Type

Avoid returning arbitrary data or unstructured strings. Create a reusable type definition that distinguishes between **success**, **field-level validation errors**, and **general server errors**:

```typescript
// types/actions.ts

export type FieldErrors<T> = Partial<Record<keyof T, string[]>>;

export type ActionState<TData = unknown, TFields = unknown> =
  | {
      status: 'idle';
      data?: null;
      error?: null;
      fieldErrors?: null;
    }
  | {
      status: 'success';
      data: TData;
      message?: string;
      error?: null;
      fieldErrors?: null;
    }
  | {
      status: 'error';
      data?: null;
      error: string; // General error (e.g., "Unauthorized", "Database offline")
      fieldErrors?: FieldErrors<TFields>; // Specific validation issues
    };

```

---

### 2. Implement the Server Action with Schema Validation (e.g., Zod)

Use a validation library to safely parse and type incoming `FormData`. Return field-level errors as structured objects:

```typescript
// app/actions/update-profile.ts
'use server';

import { z } from 'zod';
import type { ActionState } from '@/types/actions';

const ProfileSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFields = z.infer<typeof ProfileSchema>;

export async function updateProfileAction(
  prevState: ActionState<{ id: string; username: string }, ProfileFields>,
  formData: FormData
): Promise<ActionState<{ id: string; username: string }, ProfileFields>> {
  // 1. Extract raw data
  const rawData = {
    username: formData.get('username'),
    email: formData.get('email'),
  };

  // 2. Validate input schema
  const parsed = ProfileSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 3. Execute business logic & database mutations
  try {
    const user = await db.user.update({
      where: { id: currentUserId },
      data: parsed.data,
    });

    return {
      status: 'success',
      data: { id: user.id, username: user.username },
      message: 'Profile updated successfully!',
    };
  } catch (err: any) {
    // Expected business logic / db failures
    return {
      status: 'error',
      error: err.message || 'Something went wrong while saving your profile.',
    };
  }
}

```

---

### 3. Consume in the Client Component with `useActionState`

Connect the structured state directly to input elements and error alerts:

```tsx
// app/components/ProfileForm.tsx
'use client';

import { useActionState } from 'react';
import { updateProfileAction } from '@/app/actions/update-profile';
import { SubmitButton } from './SubmitButton'; // Child using useFormStatus

const initialState = { status: 'idle' as const };

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {/* General Error Alert */}
      {state.status === 'error' && state.error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
          {state.error}
        </div>
      )}

      {/* Success Notification */}
      {state.status === 'success' && state.message && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm">
          {state.message}
        </div>
      )}

      {/* Field 1: Username */}
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          name="username"
          defaultValue={state.status === 'success' ? state.data.username : undefined}
          className="w-full border p-2 rounded mt-1"
          aria-invalid={!!state.fieldErrors?.username}
          aria-describedby="username-error"
        />
        {state.fieldErrors?.username && (
          <p id="username-error" className="text-red-500 text-xs mt-1">
            {state.fieldErrors.username[0]}
          </p>
        )}
      </div>

      {/* Field 2: Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          className="w-full border p-2 rounded mt-1"
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby="email-error"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-red-500 text-xs mt-1">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <SubmitButton label="Save Changes" />
    </form>
  );
}

```

---

### 4. Best Practices Summary

* **Return Errors, Don't Throw:** Only throw unexpected/fatal runtime errors (which trigger `<ErrorBoundary>`). For expected user errors (e.g., validation, email already in use, bad password), return a `{ status: 'error' }` response object.
* **Flatten Validation Maps:** Use structures like `Record<string, string[]>` for `fieldErrors`. This simplifies rendering directly under `<input>` elements.
* **Maintain Signature Alignment:** The Server Action function must match the `(prevState: State, formData: FormData) => Promise<State>` signature expected by `useActionState`.
* **Include Accessibility Attributes:** When returning field errors, bind `aria-invalid={true}` and `aria-describedby` to make form validation accessible to screen readers.
* **Keep Initial State Serializable:** Ensure `initialState` is a clean, plain JSON object (e.g., `{ status: 'idle' }`) to avoid serialization overhead across the Flight protocol.

Integrating **React Hook Form (`useFieldArray`)** with **React 19’s `useActionState**` requires bridging controlled/uncontrolled client form state with React’s progressive enhancement action pipeline.

The most robust pattern uses:

1. `useFieldArray` to manage client-side dynamic row operations (add, remove, reorder, client validation).
2. `handleSubmit(onValid)` to trigger the `useActionState` action programmatically inside `startTransition`.
3. Server error synchronization via `setError` so server-side Zod validation errors attach directly to individual fields in the field array.

---

### Step 1: Define Schemas and Server Action

The Server Action validates the array of items and returns path-specific error tuples if verification fails:

```typescript
// app/actions/team-actions.ts
'use server';

import { z } from 'zod';

export const MemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const TeamSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  members: z.array(MemberSchema).min(1, 'At least one team member is required'),
});

export type TeamFormValues = z.infer<typeof TeamSchema>;

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createTeamAction(
  prevState: ActionState,
  data: TeamFormValues
): Promise<ActionState> {
  const parsed = TeamSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }

    return {
      status: 'error',
      message: 'Validation failed on the server.',
      fieldErrors,
    };
  }

  try {
    // Database write / mutation
    return {
      status: 'success',
      message: `Team "${parsed.data.teamName}" with ${parsed.data.members.length} members created!`,
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message || 'Database error occurred.',
    };
  }
}

```

---

### Step 2: Client Integration (`useFieldArray` + `useActionState`)

Wire React Hook Form to `useActionState` and sync server errors using an effect:

```tsx
// app/components/TeamFieldArrayForm.tsx
'use client';

import { useActionState, startTransition, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamSchema, createTeamAction, type TeamFormValues, type ActionState } from '@/app/actions/team-actions';

const initialState: ActionState = {
  status: 'idle',
};

export function TeamFieldArrayForm() {
  // 1. Initialize useActionState
  const [state, formAction, isActionPending] = useActionState(createTeamAction, initialState);

  // 2. Initialize React Hook Form with Zod validation
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      teamName: '',
      members: [{ name: '', email: '', role: 'MEMBER' }],
    },
  });

  // 3. Initialize useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  // 4. Map server-side Zod validation errors back to RHF field paths
  useEffect(() => {
    if (state.status === 'error' && state.fieldErrors) {
      for (const [path, messages] of Object.entries(state.fieldErrors)) {
        setError(path as any, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [state, setError]);

  // 5. Submit bridge: run client validation first, then trigger Action inside startTransition
  const onSubmit = (data: TeamFormValues) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const isPending = isActionPending || isSubmitting;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Create Team</h2>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Team Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
            Team Name
          </label>
          <input
            {...register('teamName')}
            placeholder="Engineering"
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.teamName && (
            <p className="text-xs text-red-500 mt-1">{errors.teamName.message}</p>
          )}
        </div>

        {/* Dynamic Members Array */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Members ({fields.length})
            </h3>
            <button
              type="button"
              onClick={() => append({ name: '', email: '', role: 'MEMBER' })}
              className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              + Add Member
            </button>
          </div>

          {fields.map((field, index) => {
            const nameError = errors.members?.[index]?.name;
            const emailError = errors.members?.[index]?.email;

            return (
              <div
                key={field.id} // Stable RHF identifier
                className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border"
              >
                {/* Member Name */}
                <div className="flex-1">
                  <input
                    {...register(`members.${index}.name` as const)}
                    placeholder="Name"
                    className="w-full border rounded p-1.5 text-sm bg-white"
                  />
                  {nameError && (
                    <p className="text-[11px] text-red-500 mt-0.5">{nameError.message}</p>
                  )}
                </div>

                {/* Member Email */}
                <div className="flex-1">
                  <input
                    {...register(`members.${index}.email` as const)}
                    placeholder="Email"
                    className="w-full border rounded p-1.5 text-sm bg-white"
                  />
                  {emailError && (
                    <p className="text-[11px] text-red-500 mt-0.5">{emailError.message}</p>
                  )}
                </div>

                {/* Member Role */}
                <div className="w-28">
                  <select
                    {...register(`members.${index}.role` as const)}
                    className="w-full border rounded p-1.5 text-sm bg-white"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                {/* Remove Button */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                    aria-label={`Remove member ${index + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {errors.members?.root && (
            <p className="text-xs text-red-500">{errors.members.root.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
        >
          {isPending ? 'Saving Team...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
}

```

---

### Core Integration Principles

* **Key Tracking with `field.id`:** Always use `key={field.id}` on mapped rows rather than `key={index}`. React Hook Form assigns internal UUIDs (`field.id`) so items retain their input values during reorders and deletions.
* **Bridge with `startTransition`:** Because `handleSubmit` receives a parsed JS object rather than raw `FormData`, call the Server Action inside `startTransition(() => formAction(data))` to maintain concurrent rendering compatibility.
* **Server-to-RHF Error Mapping:** Setting errors via `setError('members.0.email', { type: 'server', message })` ensures server-side invariants render inline beneath the exact failed input.

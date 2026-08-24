# Problem 2: Server Action With Field-Level Validation Errors

## Task

Implement a `createEvent` Server Action for an event-creation form with fields `name`, `date` (ISO string), and `capacity` (number). Requirements:

- `name`: required, 3–80 characters.
- `date`: required, must parse to a valid date, and must not be in the past.
- `capacity`: required, integer, must be at least 1.
- On any validation failure, return `{ errors: { fieldName: 'message', ... } }` — collect **all** field errors in one pass, don't stop at the first one.
- On success, "save" the event (push to an in-memory array is fine) and return `{ success: true, event }`.
- Wire it to a Client Component form using `useFormState`, displaying each error under its corresponding field.

## Constraints

- No external validation library.
- Must be a real Server Action (`'use server'`), not a Route Handler.

## Solution

```js
// app/actions/create-event.js
'use server';

let events = [];
let nextId = 1;

export async function createEvent(prevState, formData) {
  const name = formData.get('name')?.toString() ?? '';
  const dateStr = formData.get('date')?.toString() ?? '';
  const capacityRaw = formData.get('capacity')?.toString() ?? '';

  const errors = {};

  if (name.trim().length < 3 || name.trim().length > 80) {
    errors.name = 'Name must be between 3 and 80 characters';
  }

  const date = new Date(dateStr);
  if (dateStr === '' || Number.isNaN(date.getTime())) {
    errors.date = 'Enter a valid date';
  } else if (date.getTime() < Date.now()) {
    errors.date = 'Date cannot be in the past';
  }

  const capacity = Number(capacityRaw);
  if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = 'Capacity must be a whole number of at least 1';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const event = { id: nextId++, name: name.trim(), date: date.toISOString(), capacity };
  events.push(event);

  return { success: true, event };
}
```

```jsx
// app/new-event-form.jsx
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { createEvent } from './actions/create-event';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Creating…' : 'Create event'}</button>;
}

export default function NewEventForm() {
  const [state, formAction] = useFormState(createEvent, { errors: {} });

  return (
    <form action={formAction}>
      <label>
        Name
        <input name="name" />
        {state.errors?.name && <span className="field-error">{state.errors.name}</span>}
      </label>
      <label>
        Date
        <input name="date" type="date" />
        {state.errors?.date && <span className="field-error">{state.errors.date}</span>}
      </label>
      <label>
        Capacity
        <input name="capacity" type="number" />
        {state.errors?.capacity && <span className="field-error">{state.errors.capacity}</span>}
      </label>
      <SubmitButton />
      {state.success && <p>Event "{state.event.name}" created!</p>}
    </form>
  );
}
```

Key implementation detail: every field is validated independently before returning — the `errors` object accumulates across all checks rather than `return`ing on the first failure, which is what lets the UI show all problems at once instead of forcing the user through one-error-at-a-time resubmission.

// app/actions/subscribe.js
'use server';

export async function subscribe(prevState, formData) {
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    return { error: 'Enter a valid email address' };
  }

  // await db.subscriber.create({ data: { email } });
  return { success: true };
}

// app/newsletter-form.jsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribe } from './actions/subscribe';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Subscribing…' : 'Subscribe'}
    </button>
  );
}

export default function NewsletterForm() {
  const [state, formAction] = useFormState(subscribe, {});

  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="you@example.com" required />
      <SubmitButton />
      {state?.error && <p role="alert">{state.error}</p>}
      {state?.success && <p>Thanks for subscribing!</p>}
    </form>
  );
}

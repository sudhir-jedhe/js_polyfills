'use client';

// components/edit-form.tsx
// "Confirm before leaving" pattern: intercept programmatic navigation
// triggered by this component, and warn on tab-close/refresh via the
// native beforeunload event (which useRouter cannot intercept).

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function EditForm({ initialTitle }: { initialTitle: string }) {
  const [title, setTitle] = useState(initialTitle);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  // Native browser prompt for closing the tab / hard refresh / typing a new URL.
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = ''; // required for Chrome to show the prompt
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  function handleTitleChange(value: string) {
    setTitle(value);
    setIsDirty(true);
  }

  function handleNavigateAway(href: string) {
    if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) {
      return; // user cancelled -- stay put, no router call
    }
    router.push(href);
  }

  return (
    <div>
      <input value={title} onChange={(e) => handleTitleChange(e.target.value)} />
      <button onClick={() => handleNavigateAway('/dashboard')}>Cancel</button>
    </div>
  );
}

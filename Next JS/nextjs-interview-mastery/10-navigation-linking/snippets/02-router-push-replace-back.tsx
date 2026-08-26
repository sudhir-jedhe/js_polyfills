'use client';

// components/post-actions.tsx
// useRouter: push, replace, back, refresh.

import { useRouter } from 'next/navigation';

export function PostActions({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleSaveAndContinue() {
    await fetch(`/api/posts/${postId}`, { method: 'PATCH' });
    // Adds a history entry -- "back" returns to the edit form.
    router.push(`/posts/${postId}`);
  }

  async function handleLoginRedirect() {
    // Replaces current entry -- pressing "back" after login shouldn't
    // return the user to a stale login form.
    router.replace('/dashboard');
  }

  function handleCancel() {
    router.back();
  }

  async function handleDeleteDraft() {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    // Re-fetch server data for the CURRENT route without a full reload.
    router.refresh();
  }

  return (
    <div>
      <button onClick={handleSaveAndContinue}>Save and View</button>
      <button onClick={handleLoginRedirect}>Simulate Login Redirect</button>
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleDeleteDraft}>Delete Draft</button>
    </div>
  );
}

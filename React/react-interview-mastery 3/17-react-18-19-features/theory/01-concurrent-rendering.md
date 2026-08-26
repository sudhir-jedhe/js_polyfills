# Concurrent Rendering — "Interruptible," Not "Faster"

The single biggest conceptual shift in React 18 is concurrent rendering. It does not make any individual render faster. What it does is let React start rendering an update, pause partway through if something more urgent comes in (like a keystroke), work on the urgent thing first, and then either resume or throw away the paused work.

Before React 18, rendering was synchronous and uninterruptible once started — a big update would block the main thread until it finished, including blocking user input.

## Opt-in, not automatic

Concurrency is opt-in: you get it by using `createRoot` (the React 18 default) and specifically by using APIs like `useTransition` and `useDeferredValue` that tell React "this update is allowed to be interrupted." Simply upgrading to React 18 and using `createRoot` doesn't make every update interruptible by itself — you still need to mark specific updates as non-urgent for the interruptible behavior to kick in for them.

## Why this matters for interviews

This is the concept everything else in this topic builds on: `useTransition`, `useDeferredValue`, and even the framing of automatic batching all stem from React 18 giving the renderer more flexibility about *when* and *in what order* it commits work to the screen. Being able to explain "it doesn't make renders faster, it makes the app feel more responsive by letting React prioritize" is the core answer interviewers are listening for.

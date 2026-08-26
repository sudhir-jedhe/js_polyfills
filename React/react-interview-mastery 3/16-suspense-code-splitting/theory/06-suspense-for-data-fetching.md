# Suspense for Data Fetching

React 18 extended Suspense beyond code splitting toward a general primitive: any code that "suspends" (throws a promise) can be caught by a Suspense boundary, including data fetching, not just lazy component code. This is the direction frameworks like Next.js (App Router) and libraries like Relay have built on.

## Why you don't hand-roll this

This is genuinely still evolving. Plain `useEffect`-based fetching does not automatically suspend — hooking up Suspense-compatible data fetching by hand is nontrivial and generally discouraged. You use it via a framework or library that implements the contract correctly: a cache that throws a promise while pending, then returns the resolved value once ready.

## What to know for interviews

Know the concept and be able to name it — that Suspense's role has broadened from "wait for a lazy component's code" to "wait for any async thing, including data" — but don't expect to write a Suspense-integrated fetcher from scratch in an interview. This is a "know the shape of the idea" topic, not an "implement it live" topic.

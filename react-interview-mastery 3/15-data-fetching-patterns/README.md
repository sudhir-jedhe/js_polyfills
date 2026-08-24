# Data Fetching Patterns

Fetching data in React components looks trivial until you hit race conditions, memory leaks from setting state after unmount, and duplicated network requests across siblings. This topic covers the manual `useEffect` fetch pattern end to end — including the parts most tutorials skip, like aborting stale requests and handling params that change quickly — and then explains why the ecosystem largely moved to libraries like React Query and SWR. The goal is to understand the underlying problem well enough that you could explain what those libraries buy you, not just how to call their hooks.

## What's covered
- The classic `useEffect` + `fetch`/`axios` pattern and its lifecycle pitfalls
- Race conditions when props/params change faster than requests resolve
- `AbortController` for cancelling in-flight requests on cleanup
- Hand-rolled loading/error/data state management
- Why React Query/SWR exist: caching, dedup, stale-while-revalidate, refetch-on-focus
- Waterfalls vs parallel fetching
- The concept of optimistic updates

## Structure
- `theory/` — concepts split by boundary: classic fetch pattern, race conditions/cleanup/AbortController, why React Query/SWR exist, waterfalls vs parallel fetching, optimistic updates
- `snippets/` — one focused code sample per file
- `output-based/` — "what renders/logs/fires" questions, one per file
- `scenarios/` — real-world scenario questions with worked approaches
- `interview-qa/` — Q&A grouped into fetching lifecycle/race conditions, caching/libraries, and parallel fetching/optimistic updates
- `problems/` — hands-on implementation problems (`useFetch` hook with AbortController, in-memory cache layer, optimistic "like" button)
- `assets/` — placeholder for images/PDFs from original notes
- `from-your-notes/` — untouched original notes

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

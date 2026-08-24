# Problem 1: Configure a route for the Edge runtime and explain the failure mode

## Task

1. Implement a Route Handler at `app/api/greeting/route.ts` that reads a `name` query parameter and a country header, and returns a personalized JSON greeting. Configure it to run on the Edge Runtime.
2. Then, deliberately introduce a Node-only dependency into the same file (e.g., reading a file from disk with `fs`, or using a native-binding npm package) and explain — in a comment — exactly what breaks and why, referencing the Edge Runtime's actual constraints (not just "it doesn't work").
3. Fix the broken version by either removing the Edge runtime declaration or replacing the Node-only dependency with an Edge-compatible alternative — implement whichever fix you'd choose in a real project and justify the choice in a comment.

## Requirements

- The working Edge version must only use Web-standard APIs (`Request`, `Response`, `Headers`, `fetch`, `URL`, Web Crypto if needed).
- Explicitly export `runtime = 'edge'`.
- The broken version's comment must name the specific category of API that fails (native Node module / filesystem / native binding) — not just say "it errors."

## Starter shape

```ts
// app/api/greeting/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  // fill in: read `name` from URL search params, read a country header,
  // return Response.json({ greeting: `...` })
}
```

## Self-check

- Does the working version avoid every Node-native API?
- Is the explanation of the Node-only failure specific (names the actual incompatible API category), not generic?
- Does the fixed version actually run correctly under Edge (no residual Node dependency)?

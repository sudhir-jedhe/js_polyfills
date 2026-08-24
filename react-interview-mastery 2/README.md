# React Interview Mastery

Companion repo to `js-interview-mastery`, same deep structure: every topic is a folder of folders (`theory/`, `snippets/`, `output-based/`, `scenarios/`, `interview-qa/`, `problems/`, `assets/`, `from-your-notes/` where applicable) instead of flat files, so it can keep growing without any single file becoming unmanageable.

## Topics

| # | Topic | Folder |
|---|---|---|
| 01 | JSX & Rendering Basics | [`01-jsx-rendering-basics`](./01-jsx-rendering-basics) |
| 02 | Components & Props | [`02-components-props`](./02-components-props) |
| 03 | State & `useState` | [`03-state-usestate`](./03-state-usestate) |
| 04 | `useEffect` & Lifecycle | [`04-useeffect-lifecycle`](./04-useeffect-lifecycle) |
| 05 | Event Handling & Forms | [`05-event-handling-forms`](./05-event-handling-forms) |
| 06 | Lists, Keys & Conditional Rendering | [`06-lists-keys-conditional-rendering`](./06-lists-keys-conditional-rendering) |
| 07 | Context API | [`07-context-api`](./07-context-api) |
| 08 | `useRef` & DOM Access | [`08-useref-dom-access`](./08-useref-dom-access) |
| 09 | `useMemo` & `useCallback` | [`09-usememo-usecallback`](./09-usememo-usecallback) |
| 10 | Custom Hooks | [`10-custom-hooks`](./10-custom-hooks) |
| 11 | Re-renders & Performance | [`11-rerenders-performance`](./11-rerenders-performance) |
| 12 | HOCs & Render Props | [`12-hoc-render-props`](./12-hoc-render-props) |
| 13 | Error Boundaries | [`13-error-boundaries`](./13-error-boundaries) |
| 14 | React Router | [`14-react-router`](./14-react-router) |
| 15 | Data Fetching Patterns | [`15-data-fetching-patterns`](./15-data-fetching-patterns) |
| 16 | Suspense & Code Splitting | [`16-suspense-code-splitting`](./16-suspense-code-splitting) |
| 17 | React 18/19 Features | [`17-react-18-19-features`](./17-react-18-19-features) |
| 18 | Design Patterns & Anti-Patterns | [`18-design-patterns-anti-patterns`](./18-design-patterns-anti-patterns) |

## Projects worth running

- `07-context-api/projects/theme-switcher/` — light/dark theme demo using Context + a custom `useTheme()` hook
- `10-custom-hooks/projects/hooks-playground/` — one app composing `useToggle`, `useLocalStorage`, and `useDebounce`
- `14-react-router/projects/protected-routes-demo/` — login + protected dashboard route with auth-aware redirects

See [`STUDY-PLAN.md`](./STUDY-PLAN.md) for a suggested order and [`SOURCE-MAP.md`](./SOURCE-MAP.md) for where this maps to your existing `js_polyfills/React` notes (which are extensive — LinkedIn-style Q&A posts, machine-coding challenges, a Redux/RTK section, a System Design section, and dozens of component-build exercises).

**Prerequisite:** this repo assumes you've already got the fundamentals from `js-interview-mastery` (closures, `this`, async/await, the event loop) — React interview questions constantly lean on those.

***  06-uselayouteffect-and-effects-as-synchronization.md ***

# `useLayoutEffect`, and Effects as Synchronization

## `useEffect` vs. `useLayoutEffect`

`useLayoutEffect` has the identical API but runs synchronously *before* the browser paints, right after DOM mutations are applied — useful when you need to measure the DOM (`getBoundingClientRect`) and synchronously adjust something before the user sees a flicker. It blocks painting, so it should be reserved for cases where visual consistency requires it; `useEffect` is the right default for everything else (data fetching, subscriptions, logging).

| Aspect | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Timing | After the browser paints | Synchronously after DOM mutations, before paint |
| Blocks visual update | No | Yes — delays paint until it finishes |
| Typical use case | Data fetching, subscriptions, logging, most side effects | DOM measurement + synchronous adjustment (positioning, scroll, avoiding flicker) |

Default to `useEffect` for nearly everything; reach for `useLayoutEffect` specifically when skipping it would cause a visible flash of incorrect layout (e.g., measuring an element's size and repositioning something based on it). The common mistake is using `useLayoutEffect` by default "to be safe," which unnecessarily blocks painting and can hurt perceived performance.

## Effects vs. event handlers for triggering side effects

| Aspect | Side effect in `useEffect` | Side effect directly in an event handler |
|---|---|---|
| Trigger | Runs in response to a *render* (declaratively tied to changed values) | Runs in direct response to a *user action* |
| Best for | Syncing with external systems based on current props/state (subscriptions, fetches keyed on an id) | One-off actions caused by a specific interaction (submit a form, log an analytics click) |
| Common mistake | Putting user-action-triggered logic in an effect keyed on a flag toggled by the handler — indirect and hard to trace | Missing cases where the value also needs to update on non-interactive causes (e.g., prop changing externally) |

Put logic in an event handler when it's fundamentally "this specific click/submit should do X"; put it in an effect when it's "this component's state should always reflect Y based on current props/state," including via routes other than that one handler. The common mistake is using an effect to react to a state flag that only your own handler ever sets — that's just a more roundabout way of writing an event handler and adds an extra render cycle.

## Effects as synchronization, not lifecycle replacement

It's tempting to map `useEffect(fn, [])` to `componentDidMount` and the cleanup to `componentWillUnmount`, but that framing leads to bugs. The more accurate mental model: an effect describes how to *synchronize* the component with some external system given its current props/state, and the dependency array says which values that synchronization depends on. Thinking in terms of "when does this run" (lifecycle) encourages omitting dependencies to control timing; thinking in terms of "what does this depend on" (synchronization) leads to correct dependency arrays and fewer stale-closure bugs.

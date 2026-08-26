# Scenario: A Third-Party Charting Library Only Exposes a HOC, Not a Hook

You're integrating a third-party charting library whose docs say "wrap your component with `withChartContext(YourComponent)` to receive the chart instance as a prop." A teammate wants to rewrite this as a hook before using it. What do you tell them?

**Approach:** Don't fight it — if the library only exposes a HOC (no exported hook), use it as documented rather than reverse-engineering an internal hook from library internals, which is fragile across library version upgrades.

```jsx
import { withChartContext } from 'third-party-charts';

function MyChartOverlay({ chartInstance }) {
  useEffect(() => {
    chartInstance.on('zoom', handleZoom);
    return () => chartInstance.off('zoom', handleZoom);
  }, [chartInstance]);
  return <div className="overlay" />;
}

export default withChartContext(MyChartOverlay);
```

If you want a hook-like ergonomic on your side, write a thin wrapper hook that consumes the prop the HOC injects, but keep the HOC boundary at the library integration point:

```jsx
function useChartInstance(chartInstance) {
  // just a pass-through convenience, still requires the HOC to supply chartInstance
  return chartInstance;
}
```

The key point: this is exactly the legitimate "library integration" case where a HOC remains the right call, because you don't control the library's internals and it hasn't shipped a hook API.

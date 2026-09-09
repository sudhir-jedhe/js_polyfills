***  03-chart-library-imperative-integration.md ***

# Scenario: A third-party charting library needs a raw DOM element to mount into, wrapped in a reusable component

You're integrating an imperative charting library (not React-aware) that exposes `new Chart(domElement, config)` and `chart.destroy()`. You need a `<ChartWidget data={...} />` component that other teams can drop in anywhere, without knowing about the underlying library's imperative API.

**Approach:** Use a ref to get the mount point, instantiate the chart in a `useEffect`, and clean it up on unmount or when `data` changes:

```jsx
function ChartWidget({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = new Chart(containerRef.current, { data });
    return () => chartRef.current.destroy();
  }, [data]); // recreate the chart whenever data changes

  return <div ref={containerRef} className="chart-container" />;
}
```

This isolates the imperative, non-React library entirely inside `ChartWidget` — consumers just pass `data` as a prop and never touch the underlying instance. If frequent `data` updates make full chart recreation too expensive, switch to calling `chart.update(data)` on an existing instance instead of destroying/recreating, still driven from the same effect.

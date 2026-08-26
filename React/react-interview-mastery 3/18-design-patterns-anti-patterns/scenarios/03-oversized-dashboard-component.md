# A 900-Line Dashboard.jsx File Is Hard to Review and Slow to Change

The component fetches data for four separate widgets, manages a dozen `useState` calls, computes several derived values, and renders a huge JSX tree — every PR touching any one widget has a large, risky diff because everything lives in one file.

**Approach:** Split by responsibility: extract each widget's data-fetching into its own custom hook, extract each widget's JSX into its own component, and keep `Dashboard` as a thin composition layer.

```jsx
// Before: everything inline in Dashboard
function Dashboard() {
  const [revenue, setRevenue] = useState(null);
  const [traffic, setTraffic] = useState(null);
  // ...10 more state variables, 4 useEffects, huge JSX
}

// After
function useRevenueData() {
  const [revenue, setRevenue] = useState(null);
  useEffect(() => { fetchRevenue().then(setRevenue); }, []);
  return revenue;
}

function RevenueWidget() {
  const revenue = useRevenueData();
  if (!revenue) return <WidgetSkeleton />;
  return <RevenueChart data={revenue} />;
}

function Dashboard() {
  return (
    <div className="grid">
      <RevenueWidget />
      <TrafficWidget />
      <ChurnWidget />
      <SupportWidget />
    </div>
  );
}
```

Each widget is now independently testable, independently reviewable, and a PR touching `RevenueWidget` no longer risks the other three.

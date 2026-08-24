# A Tab-Switch Causes a Visible Flash of Blank Content

Switching between tabs in a dashboard (e.g., "Overview" → "Detailed Report") triggers a heavy re-render of the new tab's content, and during that time the previous tab's content disappears abruptly before the new content is ready, creating a flash.

**Approach:** Wrap the tab-switching state update in `useTransition` so React keeps rendering the old tab's content while the new tab's heavy render happens in the background, only swapping once it's ready, with `isPending` driving a subtle loading indicator instead of an abrupt disappearance.

```jsx
function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  function selectTab(next) {
    startTransition(() => setTab(next));
  }

  return (
    <div>
      <nav>
        <button onClick={() => selectTab("overview")}>Overview</button>
        <button onClick={() => selectTab("detailed")}>Detailed Report</button>
      </nav>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === "overview" ? <Overview /> : <DetailedReport />}
      </div>
    </div>
  );
}
```

Because it's a transition, React can keep the current tab mounted and interactable while preparing the next one, avoiding the jarring blank flash.

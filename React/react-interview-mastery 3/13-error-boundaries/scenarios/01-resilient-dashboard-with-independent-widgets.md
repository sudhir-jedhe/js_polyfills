# You're Building a Dashboard With Five Independent Widgets

Weather, stock ticker, news, calendar, todo list. Currently one buggy widget crashing takes down the entire dashboard with a blank white screen. How do you architect this to be resilient?

**Approach:** Wrap each widget individually in its own error boundary, plus keep one global boundary at the app root as a last resort for anything outside the widget grid (routing errors, layout bugs).

```jsx
function Widget({ title, children }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="widget-error">
          <p>{title} couldn't load.</p>
        </div>
      }
    >
      <section>
        <h2>{title}</h2>
        {children}
      </section>
    </ErrorBoundary>
  );
}

function Dashboard() {
  return (
    <div className="grid">
      <Widget title="Weather"><WeatherWidget /></Widget>
      <Widget title="Stocks"><StockTicker /></Widget>
      <Widget title="News"><NewsFeed /></Widget>
      <Widget title="Calendar"><CalendarWidget /></Widget>
      <Widget title="Todo"><TodoList /></Widget>
    </div>
  );
}
```

Now a crash in `StockTicker` shows "Stocks couldn't load" in that one grid cell while the other four widgets keep working — the failure is contained to exactly the section that failed.

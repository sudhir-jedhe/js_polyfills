# Problem: Per-Section Error Boundaries in a Dashboard Layout

**Requirements:**
- A dashboard renders several independent widgets (weather, stocks, news, calendar).
- One widget crashing must not take down the rest of the dashboard.
- Each widget's failure should show a small, section-specific fallback, not a full-page error screen.
- Keep one global boundary as a last-resort safety net for anything outside the widget grid.

## Solution

```jsx
import React from 'react';
import ErrorBoundary from '../problems-01-reusable-error-boundary'; // reusable boundary from problem 1

function WidgetBoundary({ title, children }) {
  return (
    <ErrorBoundary
      onError={(error, info) =>
        console.error(`[${title}] widget crashed:`, error, info.componentStack)
      }
      fallback={(error, reset) => (
        <div className="widget widget--error">
          <p>{title} couldn't load.</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <section className="widget">
        <h2>{title}</h2>
        {children}
      </section>
    </ErrorBoundary>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <WidgetBoundary title="Weather">
        <WeatherWidget />
      </WidgetBoundary>
      <WidgetBoundary title="Stocks">
        <StockTicker />
      </WidgetBoundary>
      <WidgetBoundary title="News">
        <NewsFeed />
      </WidgetBoundary>
      <WidgetBoundary title="Calendar">
        <CalendarWidget />
      </WidgetBoundary>
    </div>
  );
}

function App() {
  return (
    // last-resort global boundary for layout/routing bugs outside the widget grid
    <ErrorBoundary fallback={<p>Something went wrong. Please refresh.</p>}>
      <Header />
      <Dashboard />
      <Footer />
    </ErrorBoundary>
  );
}
```

**Notes:**
- If `StockTicker` throws during render, only its `WidgetBoundary` fallback ("Stocks couldn't load") appears — the other three widgets, the header, and the footer keep working normally.
- `reset()` per widget lets a user retry just that section without reloading the whole dashboard, which matters if the failure was transient (a flaky third-party feed, a brief network blip).
- Don't wrap every tiny sub-component individually — pick boundaries at meaningful, independently-useful sections (a whole widget), not, say, around a single `<span>` inside one.

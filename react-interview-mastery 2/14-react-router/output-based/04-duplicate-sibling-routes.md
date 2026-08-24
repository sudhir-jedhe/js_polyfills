# Two Sibling Routes Are Defined for the Same Path. Which One Renders?

```jsx
<Routes>
  <Route path="/report" element={<ReportA />} />
  <Route path="/report" element={<ReportB />} />
</Routes>
```

**Answer:** `ReportA` renders — React Router uses the first matching route in document order when multiple routes could match the same path exactly.

**Why:** `Routes` picks a single best match by ranking specificity, but among routes with identical specificity/path, the one declared first wins. This is a real footgun when routes are generated dynamically (e.g., from a config array) and accidentally produce duplicate paths.

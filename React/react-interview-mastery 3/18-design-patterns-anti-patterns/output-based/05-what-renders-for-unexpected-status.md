# What Renders When `status` Is an Unexpected Value Like `"unknown"`?

```jsx
function StatusBadge({ status }) {
  return status === "active" ? (
    <span className="green">Active</span>
  ) : status === "pending" ? (
    <span className="yellow">Pending</span>
  ) : (
    <span className="red">Inactive</span>
  );
}
```

**Answer:** It renders `<span className="red">Inactive</span>` for `status="unknown"`.

**Why:** The nested ternary's final `else` branch is a catch-all for anything that isn't `"active"` or `"pending"`, silently mislabeling an unrecognized status as "Inactive" rather than surfacing that it's an unexpected value — a symptom of nested ternaries hiding logic gaps that an explicit `switch` or lookup table with a clear default would make more visible.

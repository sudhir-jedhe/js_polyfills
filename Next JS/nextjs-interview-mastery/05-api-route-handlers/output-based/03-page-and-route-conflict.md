## Why does the build fail?

```
app/
  dashboard/
    page.jsx     // renders the dashboard UI
    route.js     // exports GET() returning JSON stats
```

```js
// app/dashboard/route.js
export async function GET() {
  return Response.json({ visits: 1200 });
}
```

**Answer:** The build fails with an error along the lines of *"You cannot have two parallel pages that resolve to the same path"* / a route conflict between `page.jsx` and `route.js` in the same segment. It's not a runtime 404 or a silent override — it's a hard build-time error.

**Why:** Both `page.jsx` and `route.js` respond to `GET /dashboard`, and a route segment can only produce one response for a given method. Next.js enforces this at the file-convention level: a segment is either a UI segment (`page.jsx`) or an API segment (`route.js`), never both simultaneously for the same path. The fix is to move the JSON endpoint to a sibling path that doesn't collide, e.g. `app/api/dashboard/route.js`, keeping `app/dashboard/page.jsx` as the only occupant of `/dashboard`.

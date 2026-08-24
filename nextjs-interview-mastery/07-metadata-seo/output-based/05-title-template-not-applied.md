## Why doesn't the site name suffix show up on this page's title?

```jsx
// app/layout.jsx
export const metadata = {
  title: { default: 'Acme Inc', template: '%s | Acme Inc' },
};

// app/careers/page.jsx
export const metadata = {
  title: { absolute: 'Careers' },
};
```

Team expects the browser tab to show "Careers | Acme Inc", matching every
other page on the site, but it just shows "Careers".

**Answer:** This is working exactly as designed, even though it "looks like"
a bug — `title.absolute` is specifically the escape hatch that bypasses the
parent's `template` entirely. The page author (perhaps by copying a snippet
from another page that intentionally wanted no suffix, like a login page)
used `absolute` instead of a plain string.

**Why:** `title: { template: '%s | Acme Inc' }` only applies its template to
descendant segments that set title as a **plain string** (`title: 'Careers'`)
or that inherit the `default` — it does not apply to a segment that
explicitly opts out via `title.absolute`. This distinction exists precisely
so pages that need an untemplated title (a login page wanting exactly "Sign
In", not "Sign In | Acme Inc") can get one — but it's easy to reach for
`absolute` out of habit or copy-paste and unintentionally suppress the site
name suffix somewhere it was actually wanted. The fix here is simply using a
plain string instead:

```jsx
export const metadata = {
  title: 'Careers', // now templated into "Careers | Acme Inc"
};
```

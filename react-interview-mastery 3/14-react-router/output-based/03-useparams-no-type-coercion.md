# What Does `useParams()` Return Here, and What Happens With a Malformed Param?

```jsx
// <Route path="/users/:userId" element={<UserProfile />} />
function UserProfile() {
  const { userId } = useParams();
  const id = Number(userId);
  return <p>User ID: {id}</p>;
}
// visiting /users/42
```

**Answer:** For `/users/42`, `userId` is the string `"42"`, and the component renders `"User ID: 42"`. For `/users/abc`, `userId` is `"abc"`, `Number("abc")` is `NaN`, and it renders `"User ID: NaN"` — no error is thrown, no validation happens automatically.

**Why:** Route params are always strings — React Router does zero type coercion or validation on dynamic segments. Any type conversion (and validation, like checking it's a valid numeric ID) is the developer's responsibility inside the component or a loader.

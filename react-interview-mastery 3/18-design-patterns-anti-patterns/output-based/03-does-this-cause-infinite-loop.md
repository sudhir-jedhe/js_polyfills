# Does This Cause an Infinite Render Loop?

```jsx
function Profile({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  });

  return <p>{fullName}</p>;
}
```

**Answer:** No infinite loop, but it does two renders where one would do: mount renders with `fullName = ""`, the effect then sets it to `"firstName lastName"` causing a second render; on that second render the effect fires again (no dependency array means it runs after every render) but computes the same string, and since `Object.is` sees no change, React bails out and no third render happens.

**Why:** It "works" but wastes a render and briefly displays an empty/wrong `fullName` on first paint — a real UX bug (visible flash) even though it's not an infinite loop. Computing `fullName` directly during render (`const fullName = \`${firstName} ${lastName}\`;`) avoids the effect, the extra render, and the flash entirely — this is the textbook case for deriving during render instead of syncing state via an effect.

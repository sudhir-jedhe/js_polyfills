# Scenario: Blanket React.memo Usage Breaks a Form With Dependent Fields

A teammate wrapped every single component in the app with `React.memo` "for performance," and now a form with dependent fields (selecting a country doesn't update the city dropdown) is broken. What's going on and how do you fix it?

**Approach:** This is the classic `memo` shallow-comparison trap combined with over-application. The city dropdown probably receives a `cities` array or an `onSelect` callback computed inline in the parent:

```jsx
// Before (broken): new array reference every render, but that's not even the bug here —
// the actual bug is usually a *missing* dependency somewhere, or memo on a component
// that legitimately needs to reflect prop changes it's not detecting.
const CityDropdown = React.memo(function CityDropdown({ cities, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {cities.map(c => <option key={c}>{c}</option>)}
    </select>
  );
});
```

Diagnosis: if `cities` is derived synchronously from `country` in the parent (`const cities = COUNTRY_CITIES[country]`), a new array is created each render, so a naive custom comparator or a bug in how `memo`'s default comparison interacts with it isn't the actual cause — `memo`'s default is correct here and *would* re-render since the array reference always differs. The likely real bug is a teammate passing a **custom `arePropsEqual`** to `memo` that only compares `value`, not `cities`. Fix: remove the faulty custom comparator, or better, remove `memo` from components that aren't leaf/list-row components with genuinely stable props — blanket `memo` usage adds comparison overhead everywhere and creates exactly this class of stale-prop bug when someone "helpfully" narrows the comparator.

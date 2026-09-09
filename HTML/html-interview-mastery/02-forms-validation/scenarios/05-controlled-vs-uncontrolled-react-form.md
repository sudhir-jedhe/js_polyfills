***  05-controlled-vs-uncontrolled-react-form.md ***

# Scenario: Choosing Controlled vs. Uncontrolled for a Large React Form

**Scenario:** You're building a 40-field settings form in React. A teammate wants every field fully controlled (`useState` + `value`/`onChange` for each), citing "it's the React way." Another teammate is concerned about re-render cost given the field count and wants to default to uncontrolled with refs, only reading values on submit. How do you reason about this trade-off, and is there a middle ground?

**Diagnosis:** Neither position is universally correct — it depends on whether any UI in the form actually needs to *react* to keystrokes live.

**When controlled is actually necessary:**
- A character counter shown next to a textarea
- A field whose validity/visibility affects another field in real time (e.g. "show a state dropdown only if country === 'US'")
- Real-time formatting (credit card number spacing, phone number formatting as you type)
- A "Save" button that should be disabled until the form is both valid and dirty

**When controlled is pure overhead:**
- A field that's only read once, on submit — a bio textarea, most text/select fields in a settings form with no live cross-field dependencies

**Middle ground: mostly uncontrolled, read via `FormData` on submit**

```jsx
function SettingsForm() {
  const formRef = useRef(null);
  const [country, setCountry] = useState('US'); // ONLY this one is controlled, because it drives conditional UI

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current); // reads all 40 fields' current values in one shot
    const payload = Object.fromEntries(formData.entries());
    saveSettings(payload);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* 38 fields left fully uncontrolled — plain <input name="..."> with no value/onChange */}
      <input name="displayName" defaultValue={initialData.displayName} />

      {/* the ONE field that needs to be controlled, because it drives conditional rendering */}
      <select name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
      {country === 'US' && <input name="state" placeholder="State" />}

      <button type="submit">Save</button>
    </form>
  );
}
```

**Why this is the right default for large forms:** each controlled field re-renders (at minimum) its own component on every keystroke; 40 controlled fields in one component means every keystroke in *any* field re-renders the *entire* form unless you've split it into per-field subcomponents — real, measurable cost at that scale, for zero UX benefit on fields nothing else depends on. Native `FormData` at submit time gives you the full payload with no per-keystroke cost at all, and it leans on `name`/`defaultValue` — the same uncontrolled-input model plain HTML forms already use — so you only pay the "React way" (controlled) cost exactly where live reactivity is genuinely required.

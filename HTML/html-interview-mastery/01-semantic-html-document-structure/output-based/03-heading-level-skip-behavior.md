***  03-heading-level-skip-behavior.md ***

# Output: What Happens When a Heading Level Is Skipped?

```html
<h1>Dashboard</h1>
<p>Welcome back.</p>
<h4>Recent Activity</h4>
<ul><li>Logged in</li></ul>
```

**Question:** Does the browser "fix" the skip from `h1` to `h4`? What actually happens?

**Answer:** Nothing is fixed or auto-corrected — the browser renders `h4` exactly as styled (smaller/lighter than `h1`, per default UA stylesheet) and the DOM/accessibility tree faithfully reports it as a level-4 heading. There is no validation error and no visual breakage. The problem is purely a **navigation/comprehension** one for screen reader users: navigating by heading level (e.g. pressing `4` in NVDA/JAWS to jump to the next `h4`, or using a rotor's heading list which shows indentation by level) presents a jump from level 1 straight to level 4, implying two or three missing intermediate sections that don't actually exist. Sighted users relying on default heading font sizes might also perceive an unintended visual hierarchy jump.

**Why:** HTML gives you full freedom over which heading level to use anywhere — there's no spec-level enforcement of continuity. The "don't skip levels going down" rule is a **convention for usability/accessibility**, not a hard parsing or validation rule, which is exactly why tools like axe/Lighthouse specifically flag it — it's a real, common, and easy-to-introduce accessibility issue precisely because nothing visibly breaks.

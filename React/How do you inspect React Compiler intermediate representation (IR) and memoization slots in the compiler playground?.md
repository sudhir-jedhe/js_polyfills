The **React Compiler Playground** (available on the official React docs at `playground.react.dev`) is an interactive development environment designed to inspect how the compiler analyzes, optimizes, and transforms your source code through its compilation pipeline.

It lets you inspect every transformation stage—from High-Level Intermediate Representation (HIR) and Static Single Assignment (SSA) down to the final JavaScript output with its runtime memoization slots (`useMemoCache`).

---

### 1. Navigating the Playground Interface

The playground layout is split into two primary panels:

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ Left Panel: Input Code               │ Right Panel: Output & IR Inspector   │
│                                      │                                      │
│ function Component(props) { ... }    │ Tabs:                                │
│                                      │ [JS Output] [HIR] [Reactive Scopes]  │
│                                      │ [SSA] [Infer Mutation Effects]       │
└──────────────────────────────────────┴──────────────────────────────────────┘

```

1. **Left Panel:** Enter your standard React component or custom hook code in TypeScript/JavaScript.
2. **Right Panel:** Use the top tab bar to switch between the final generated JavaScript and the intermediate compiler passes.

---

### 2. Inspecting Intermediate Representation (IR) Passes

The React Compiler processes your component through a multi-pass pipeline. In the playground tabs, you can view the output of each major internal pass:

* **`BuildHIR` (High-Level Intermediate Representation):**
Converts the Babel AST into an explicit Control Flow Graph (CFG) of basic blocks with labeled branches (`bb0`, `bb1`, `bb2`).
* **`SSA` (Static Single Assignment):**
Assigns every variable write a unique, immutable version (e.g., `x_0`, `x_1`). This allows the compiler to mathematically trace variable lifetimes and track mutations across branches.
* **`InferMutationEffects`:**
Annotates each instruction with mutation effects: `Read`, `Mutate`, `Freeze`, or `Capture`. This step detects if a variable mutates an external value or if it is safely frozen.
* **`BuildReactiveScopeBlocks`:**
Groups instructions that share dependency lifetimes into **Reactive Scopes** (`scope @0`, `scope @1`). These scopes correspond directly to the cached memoization blocks generated in the final code.

---

### 3. Understanding Generated Memoization Slots in JS Output

In the **JS Output** tab, look at the generated output to see how the compiler allocated its memoization cache array:

#### Source Code (Left Panel)

```tsx
export function UserBadge({ name, score }: { name: string; score: number }) {
  const formattedScore = `${score} pts`;
  return (
    <div className="badge">
      <span>{name}</span>
      <strong>{formattedScore}</strong>
    </div>
  );
}

```

#### Generated JS Output (Right Panel)

```javascript
function UserBadge(t0) {
  const $ = _c(6); // Allocates a 6-slot memoization array for this component
  const { name, score } = t0;

  // Slot block 1: Memoize `formattedScore`
  let t1;
  if ($[0] !== score) {
    t1 = `${score} pts`;
    $[0] = score;
    $[1] = t1;
  } else {
    t1 = $[1];
  }

  // Slot block 2: Memoize the entire JSX Element Tree
  let t2;
  if ($[2] !== name || $[3] !== t1) {
    t2 = (
      <div className="badge">
        <span>{name}</span>
        <strong>{t1}</strong>
      </div>
    );
    $[2] = name;
    $[3] = t1;
    $[4] = t2;
  } else {
    t2 = $[4];
  }

  return t2;
}

```

#### How to Read the Slot Mapping

* **`_c(6)` (or `useMemoCache(6)`):** Allocates 6 flat indexed slots for this component instance in React's internal fiber memory.
* **Input Dependency Check:** `$[0] !== score` checks if the dependency changed identity since the last render.
* **Cache Assignment:** If changed, computes `t1`, writes the dependency to `$[0]`, and writes the result to `$[1]`.
* **Early Cache Return:** If unchanged, returns the precomputed value stored at `$[1]`.

---

### 4. Diagnosing Bailouts in the Playground

If the compiler fails to optimize your component, the playground displays a banner or diagnostic warning in the right panel:

* **Purity Violations:** If you mutate props (e.g., `props.items.push(...)`), the right panel highlights the line with an error: *"Mutating a value that was passed as a prop"*.
* **Ref Access Violations:** Accessing `ref.current` directly in the render body marks the component as skipped/un-memoized.
* **Control Flow Bailouts:** Unsupported complex patterns or dynamic `eval` calls will produce an explicit bailout reason indicating why optimization was bypassed.

---

### 5. Local Terminal Inspection via Babel Plugin

To inspect compiler IR passes and output directly in your terminal or build logs:

```bash
# Run compiler with debug logging enabled
DEBUG=react-compiler:* npx babel src/MyComponent.tsx --plugins babel-plugin-react-compiler

```

This prints each compiler step (HIR, SSA, and Scope assignments) to `stdout`.

*** copy Explain step-by-step how JavaScript's Abstract Equality Comparison algorithm coerces types for loose equality (==)..md ***

The **Abstract Equality Comparison Algorithm** (defined in the ECMAScript specification as `IsLooselyEqual(x, y)`) defines exact step-by-step rules for how `x == y` evaluates.

When evaluating `x == y`, the JavaScript engine executes these steps in strict order:

---

**Step 1: Same Types**
If `typeof x === typeof y`, perform a **Strict Equality Comparison (`x === y`)**:

* If `x` is `NaN` or `y` is `NaN`, return `false` (even `NaN == NaN` is `false`).
* `+0 == -0` returns `true`.
* For objects, return `true` only if both point to the exact same reference in memory.

---

**Step 2: `null` and `undefined**`
If one operand is `null` and the other is `undefined`, return **`true`**.

* `null == undefined` $\rightarrow$ `true`
* `undefined == null` $\rightarrow$ `true`
* Neither coerces to any other type: `null == 0` is `false`, `null == false` is `false`.

---

**Step 3: Number vs. String**
If one operand is a `Number` and the other is a `String`, convert the string to a number using **`ToNumber(string)`** and re-evaluate:

* `x == y` becomes `x == Number(y)` (or `Number(x) == y`).
* Example: `42 == "42"` $\rightarrow$ `42 == Number("42")` $\rightarrow$ `42 == 42` $\rightarrow$ `true`.
* Example: `42 == "foo"` $\rightarrow$ `42 == Number("foo")` $\rightarrow$ `42 == NaN` $\rightarrow$ `false`.

---

**Step 4: Boolean vs. Any Non-Boolean**
If either operand is a `Boolean`, convert that boolean to a number using **`ToNumber(boolean)`** (`true` $\rightarrow$ `1`, `false` $\rightarrow$ `0`) and re-evaluate:

* `x == y` becomes `Number(x) == y` (or `x == Number(y)`).
* Example: `true == "1"` $\rightarrow$ `1 == "1"` $\rightarrow$ `1 == 1` $\rightarrow$ `true`.
* Example: `false == ""` $\rightarrow$ `0 == ""` $\rightarrow$ `0 == 0` $\rightarrow$ `true`.
* Example: `"2" == true` $\rightarrow$ `"2" == 1` $\rightarrow$ `2 == 1` $\rightarrow$ `false`.

---

**Step 5: Object vs. Primitive (String, Number, BigInt, Symbol)**
If one operand is an `Object` (including Arrays) and the other is a primitive, convert the object to a primitive using **`ToPrimitive(object, hint: 'default')`**:

1. It calls `[Symbol.toPrimitive]('default')` if present.
2. Otherwise, it calls `valueOf()`. If `valueOf()` returns a primitive, use it.
3. Otherwise, it calls `toString()`.

* Example: `[1, 2] == "1,2"`
* `[1, 2].toString()` returns `"1,2"`.
* Evaluates `"1,2" == "1,2"` $\rightarrow$ `true`.

* Example: `[0] == 0`
* `[0].toString()` returns `"0"`.
* `"0" == 0` $\rightarrow$ `Number("0") == 0` $\rightarrow$ `0 == 0` $\rightarrow$ `true`.

* Example: `[] == false`

1. Boolean conversion (Step 4): `[] == 0`
2. Object conversion (Step 5): `[].toString()` is `""` $\rightarrow$ `"" == 0`
3. String conversion (Step 3): `Number("") == 0` $\rightarrow$ `0 == 0` $\rightarrow$ `true`.

---

**Step 6: BigInt Coercion**

* If comparing a `BigInt` and a `String`, convert the string using `StringToBigInt(string)`. If parsing fails, return `false`.
* If comparing a `BigInt` and a `Number`, mathematical values are compared if neither is `NaN` or `Infinity`.

---

**Step 7: Default Fallthrough**
If none of the above conditions are matched, return **`false`**.

---

**Worked Trace: Why `[] == ![]` is `true**`

1. Evaluate right-hand side first (`!` operator has higher precedence):

* `Boolean([])` is truthy, so `![]` evaluates to **`false`**.
* Expression is now: `[] == false`.

1. Apply **Step 4** (Boolean rule):

* Convert `false` to `Number(false)` $\rightarrow$ `0`.
* Expression is now: `[] == 0`.

1. Apply **Step 5** (Object vs. Primitive rule):

* Convert `[]` using `ToPrimitive` $\rightarrow$ `[].toString()` $\rightarrow$ `""`.
* Expression is now: `"" == 0`.

1. Apply **Step 3** (String vs. Number rule):

* Convert `""` using `Number("")` $\rightarrow$ `0`.
* Expression is now: `0 == 0`.

1. Apply **Step 1** (Same type):

* `0 === 0` evaluates to **`true`**.

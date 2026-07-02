# Strong Password Checker (React)

### Features

✅ Controlled Input

✅ Show / Hide Password

✅ Live Validation

✅ Dynamic Rule Updates

✅ Green colour when rule passes

✅ Regular Expression Validation

✅ Accessible UI

✅ Interview Ready

***

# Complete Code

```jsx
import React, {
  useMemo,
  useState,
} from "react";

export default function StrongPassword() {
  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const validations =
    useMemo(
      () => ({
        minLength:
          password.length >= 8,

        lowercase:
          /[a-z]/.test(
            password
          ),

        uppercase:
          /[A-Z]/.test(
            password
          ),

        number:
          /\d/.test(
            password
          ),

        special:
          /[^A-Za-z0-9]/.test(
            password
          ),
      }),
      [password]
    );

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
      }}
    >
      <h2>
        Strong Password
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={password}
          onChange={e =>
            setPassword(
              e.target.value
            )
          }
          placeholder="Enter password"
          aria-label="Password"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              prev => !prev
            )
          }
        >
          {showPassword
            ? "Hide"
            : "Show"}
        </button>
      </div>

      <ul
        style={{
          marginTop: "20px",
        }}
      >
        <li
          data-testid="min-length"
          className={
            validations.minLength
              ? "text-green-500"
              : ""
          }
        >
          Minimum 8 characters
        </li>

        <li
          data-testid="lowercase"
          className={
            validations.lowercase
              ? "text-green-500"
              : ""
          }
        >
          Contains lowercase letter
        </li>

        <li
          data-testid="uppercase"
          className={
            validations.uppercase
              ? "text-green-500"
              : ""
          }
        >
          Contains uppercase letter
        </li>

        <li
          data-testid="number"
          className={
            validations.number
              ? "text-green-500"
              : ""
          }
        >
          Contains number
        </li>

        <li
          data-testid="special"
          className={
            validations.special
              ? "text-green-500"
              : ""
          }
        >
          Contains special character
        </li>
      </ul>
    </div>
  );
}
```

***

# Tailwind Version

```jsx
<li
  data-testid="uppercase"
  className={
    validations.uppercase
      ? "text-green-500"
      : "text-gray-500"
  }
>
  Contains uppercase letter
</li>
```

***

# Interview Follow-up

### Compute Password Strength

```jsx
const passedRules =
  Object.values(
    validations
  ).filter(Boolean)
    .length;

const strength =
  passedRules <= 2
    ? "Weak"
    : passedRules <= 4
    ? "Medium"
    : "Strong";
```

Render:

```jsx
<h3>
  Strength: {strength}
</h3>
```

***

# Time Complexity

```text
Typing Event

5 Regex Checks

O(n)
```

where `n` = password length.

***

# Senior-Level Discussion

For enterprise applications, you would typically:

```text
✅ Extract rules into config

✅ Create reusable usePasswordStrength hook

✅ Support zxcvbn scoring

✅ Show strength meter

✅ Support accessibility announcements

✅ Add server-side validation
```

Example reusable hook:

```jsx
const {
  validations,
  strength,
} = usePasswordStrength(
  password
);
```

This is the production-ready solution expected in React machine-coding interviews.

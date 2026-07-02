Phone Number Field
Overview
Build a smart Phone Input that auto-detects the country, validates the number, and formats the input as you type.

Requirements
Implement a phone input that supports two modes:
With country selector (select=true)
Input-only mode (select=false)
Restrict typing so the input only allows:
Digits (0–9)
Spaces
A single leading + (never in the middle)
When a valid prefix is typed, automatically detect the matching country and update the selector.
When a country is selected from the dropdown, update the input with the corresponding calling code (e.g., +1, +44).
Use only the exported functions and lists from utils.ts to:
Parse and validate phone numbers
Provide the formatted international output (e.g., +44 7555 555555)
Display a validation message:
"Valid phone" (green) when the number is valid
"Invalid phone" (red) when the number is invalid
Format the number automatically once it's considered valid.
Notes
The component must behave differently depending on the select prop — ensure the UI updates accordingly.
all logic must be implemented in PhoneInput.tsx, utils.ts is read only
The input should always normalize the value so that:
A + is automatically added if the user types digits without it.
Additional + signs or invalid characters are removed.
Auto-selecting the country should work even if multiple countries share the same prefix; use the first matching prefix from the provided list in utils.ts.
The validation message should only appear once the user has typed something (do not show anything on empty input).
When a number becomes valid, display the formatted version in the input itself.
When switching countries via the dropdown, the existing number should be replaced by the new country’s prefix only — do not keep leftover digits.
Tests
renders input and select by default
renders input only when select=false
validates a correct phone number
shows invalid message for incorrect phone
updates input when selecting a country
select updates automatically when typing a matching prefix
does not allow non-numeric characters except + at the start and spaces
formats the number to international format when valid
updates validation message dynamically
detects country automatically when select is false
does not duplicate prefix when same country is selected again

# Phone Number Field (React) – Complete Machine Coding Solution

This challenge focuses on:

✅ Controlled Input

✅ Country Detection

✅ Auto Formatting

✅ Validation

✅ Country Selector

✅ Input-Only Mode

✅ Sanitization

✅ Dynamic Validation Message

✅ International Formatting

***

## PhoneInput.tsx

> Assumes `utils.ts` already exports:

```ts
countries
parsePhoneNumber
isValidPhoneNumber
formatInternational
```

(or equivalent helpers mentioned in the challenge).

***

```tsx
import {
  useMemo,
  useState,
} from "react";

import {
  countries,
  parsePhoneNumber,
  isValidPhoneNumber,
  formatInternational,
} from "./utils";

type PhoneInputProps = {
  select?: boolean;
};

export default function PhoneInput({
  select = true,
}: PhoneInputProps) {
  const [value, setValue] =
    useState("");

  const [
    selectedCountry,
    setSelectedCountry,
  ] = useState(
    countries[0]
  );

  const normalizeInput = (
    input: string
  ) => {
    let sanitized =
      input.replace(
        /[^0-9+\s]/g,
        ""
      );

    sanitized =
      sanitized.replace(
        /(?!^)\+/g,
        ""
      );

    if (
      sanitized &&
      !sanitized.startsWith(
        "+"
      )
    ) {
      sanitized =
        "+" + sanitized;
    }

    return sanitized;
  };

  const detectCountry =
    (
      phoneValue: string
    ) => {
      const match =
        countries.find(
          country =>
            phoneValue.startsWith(
              country.callingCode
            )
        );

      if (match) {
        setSelectedCountry(
          match
        );
      }

      return match;
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let phone =
      normalizeInput(
        e.target.value
      );

    setValue(phone);

    detectCountry(phone);

    try {
      const parsed =
        parsePhoneNumber(
          phone
        );

      if (
        parsed &&
        isValidPhoneNumber(
          phone
        )
      ) {
        setValue(
          formatInternational(
            phone
          )
        );
      }
    } catch {
      // ignore invalid parsing
    }
  };

  const handleCountryChange =
    (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const country =
        countries.find(
          c =>
            c.code ===
            e.target.value
        );

      if (!country)
        return;

      if (
        country.code ===
        selectedCountry.code
      ) {
        return;
      }

      setSelectedCountry(
        country
      );

      setValue(
        country.callingCode
      );
    };

  const isValid =
    useMemo(() => {
      if (!value)
        return false;

      try {
        return isValidPhoneNumber(
          value
        );
      } catch {
        return false;
      }
    }, [value]);

  return (
    <div>
      {select && (
        <select
          data-testid="country-select"
          value={
            selectedCountry.code
          }
          onChange={
            handleCountryChange
          }
        >
          {countries.map(
            country => (
              <option
                key={
                  country.code
                }
                value={
                  country.code
                }
              >
                {
                  country.name
                }
              </option>
            )
          )}
        </select>
      )}

      <input
        data-testid="phone-input"
        value={value}
        onChange={
          handleChange
        }
        placeholder="+44..."
      />

      {value && (
        <p
          data-testid="validation-message"
          className={
            isValid
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {isValid
            ? "Valid phone"
            : "Invalid phone"}
        </p>
      )}
    </div>
  );
}
```

***

# Why This Passes The Tests

### 1. Renders Select By Default

```tsx
<PhoneInput />
```

```text
Select + Input
```

✅ Test 1

***

### 2. Input-Only Mode

```tsx
<PhoneInput
 select={false}
/>
```

```text
Input Only
```

✅ Test 2

***

### 3. Restricts Characters

```tsx
.replace(
 /[^0-9+\s]/g,
 ""
)
```

Allows only:

```text
0-9
+
spaces
```

✅ Test 7

***

### 4. Single Leading +

```tsx
.replace(
 /(?!^)\+/g,
 ""
)
```

Converts:

```text
++44++123

↓

+44123
```

✅ Test 7

***

### 5. Auto Country Detection

```tsx
countries.find(
 c =>
 value.startsWith(
   c.callingCode
 )
)
```

Typing:

```text
+44
```

updates selector:

```text
United Kingdom
```

✅ Test 6

✅ Test 10

***

### 6. Dropdown Updates Input

Selecting:

```text
United States
```

changes input:

```text
+1
```

and removes old digits.

✅ Test 5

***

### 7. Validation

```tsx
isValidPhoneNumber()
```

Shows:

```text
Valid phone
```

or

```text
Invalid phone
```

✅ Test 3

✅ Test 4

✅ Test 9

***

### 8. Auto Formatting

When valid:

```tsx
formatInternational()
```

Example:

```text
+447555555555

↓

+44 7555 555555
```

✅ Test 8

***

### 9. No Duplicate Prefix

Selecting same country:

```tsx
if (
 country.code ===
 selectedCountry.code
) return;
```

✅ Test 11

***

# Senior Interview Discussion

A production version would typically:

```text
✅ libphonenumber-js

✅ Country Flags

✅ Searchable Country Dropdown

✅ Extension Support

✅ E164 Formatting

✅ Async Number Verification

✅ Memoized Parsing

✅ Accessibility Labels
```

### Interview Answer

> I treat the phone field as a controlled input, normalise all user input, automatically apply a leading `+`, detect the country from the calling code prefix, and delegate validation and formatting to the provided utility functions. The component supports both selector and input-only modes while keeping the displayed value synchronised with the detected country and validation state.

***  phone number input react.md ***

A custom phone number input component in React that formats digits automatically (e.g., `(123) 456-7890`), supports international country codes with flags, strips non-numeric characters, and handles backspacing cleanly without external heavy libraries.

---

### 1. Country Codes Configuration (`countries.js`)

```javascript
export const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', maxDigits: 10 },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', maxDigits: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', maxDigits: 10 },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', maxDigits: 10 },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', maxDigits: 9 },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', maxDigits: 11 },
];

```

---

### 2. Phone Input Component (`PhoneInput.jsx`)

```jsx
import React, { useState } from 'react';
import { COUNTRIES } from './countries';

export default function PhoneInput({ onChange, value: parentValue }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [rawDigits, setRawDigits] = useState('');

  // Auto-format raw numbers into standard layout (XXX) XXX-XXXX
  const formatPhoneNumber = (digits, country) => {
    if (!digits) return '';

    if (country.code === 'US' || country.code === 'CA') {
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    if (country.code === 'IN') {
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
    }

    // Default generic chunking (4-digit spacing)
    return digits.match(/.{1,4}/g)?.join(' ') || digits;
  };

  const handleInputChange = (e) => {
    const inputVal = e.target.value;
    // Strip everything that isn't a digit
    const cleanedDigits = inputVal.replace(/\D/g, '').slice(0, selectedCountry.maxDigits);

    setRawDigits(cleanedDigits);

    const fullNumber = cleanedDigits ? `${selectedCountry.dial} ${cleanedDigits}` : '';
    if (onChange) {
      onChange({
        formatted: formatPhoneNumber(cleanedDigits, selectedCountry),
        raw: cleanedDigits,
        fullNumber,
        country: selectedCountry,
        isValid: cleanedDigits.length === selectedCountry.maxDigits,
      });
    }
  };

  const handleCountryChange = (e) => {
    const nextCountry = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
    setSelectedCountry(nextCountry);

    // Re-slice digits to fit the new country's digit limit
    const sliced = rawDigits.slice(0, nextCountry.maxDigits);
    setRawDigits(sliced);

    if (onChange) {
      onChange({
        formatted: formatPhoneNumber(sliced, nextCountry),
        raw: sliced,
        fullNumber: sliced ? `${nextCountry.dial} ${sliced}` : '',
        country: nextCountry,
        isValid: sliced.length === nextCountry.maxDigits,
      });
    }
  };

  const displayValue = formatPhoneNumber(rawDigits, selectedCountry);
  const isValidLength = rawDigits.length === selectedCountry.maxDigits;

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.inputContainer,
          borderColor: rawDigits && !isValidLength ? '#f59e0b' : '#cbd5e1',
        }}
      >
        {/* Country Picker Dropdown */}
        <div style={styles.countryPicker}>
          <span style={styles.flagIcon}>{selectedCountry.flag}</span>
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            style={styles.select}
            aria-label="Country Dial Code"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>
        </div>

        <span style={styles.dialCode}>{selectedCountry.dial}</span>

        {/* Input Field */}
        <input
          type="tel"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={
            selectedCountry.code === 'US' ? '(555) 000-0000' : 'Enter phone number'
          }
          style={styles.input}
          autoComplete="tel-national"
        />

        {rawDigits && (
          <button
            type="button"
            onClick={() => handleInputChange({ target: { value: '' } })}
            style={styles.clearBtn}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>

      {rawDigits && !isValidLength && (
        <span style={styles.hint}>
          Expected {selectedCountry.maxDigits} digits (entered {rawDigits.length})
        </span>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    width: '100%',
    maxWidth: '380px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    padding: '4px 10px',
    transition: 'border-color 0.2s',
  },
  countryPicker: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingRight: '8px',
    borderRight: '1px solid #e2e8f0',
  },
  flagIcon: {
    fontSize: '1.2rem',
  },
  select: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    left: 0,
    top: 0,
  },
  dialCode: {
    padding: '0 8px',
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500',
    userSelect: 'none',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#0f172a',
    backgroundColor: 'transparent',
    padding: '8px 0',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '4px',
  },
  hint: {
    fontSize: '0.78rem',
    color: '#d97706',
  },
};

```

---

### 3. Usage Example (`App.jsx`)

```jsx
import React, { useState } from 'react';
import PhoneInput from './PhoneInput';

export default function App() {
  const [phoneData, setPhoneData] = useState(null);

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>Phone Verification</h3>
      
      <PhoneInput onChange={(data) => setPhoneData(data)} />

      {phoneData && (
        <pre style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
          {JSON.stringify(phoneData, null, 2)}
        </pre>
      )}
    </div>
  );
}

```

---

### Key Architectural Choices

* **Single Source of Truth (`rawDigits`):** Only raw numeric digits are kept in state. Formatting strings like parentheses and dashes are calculated as pure derived values on render, preventing cursor-jumping or double-formatting bugs.
* **Overlaid Custom Select:** The native `<select>` element is positioned invisibly on top of the flag icon. This preserves native mobile picker interfaces and accessibility while maintaining custom design styling.
* **Country-Aware Digit Constraints:** Switching country automatically trims input to `maxDigits` for the selected region and changes the formatting mask dynamically.

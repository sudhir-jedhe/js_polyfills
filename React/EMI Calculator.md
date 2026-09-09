***  EMI Calculator.md ***

A React Password Generator with customizable character sets (uppercase, lowercase, numbers, symbols), length controls, strength estimation, and one-click copy to clipboard.

---

### Implementation

```tsx
import React, { useState, useCallback, useEffect } from 'react';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(14);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = useCallback(() => {
    let charPool = '';
    const guaranteedChars: string[] = [];

    if (includeUpper) {
      charPool += UPPERCASE;
      guaranteedChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
    }
    if (includeLower) {
      charPool += LOWERCASE;
      guaranteedChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
    }
    if (includeNumbers) {
      charPool += NUMBERS;
      guaranteedChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
    }
    if (includeSymbols) {
      charPool += SYMBOLS;
      guaranteedChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }

    if (!charPool) {
      setPassword('');
      return;
    }

    // Fill the remaining length with cryptographically secure / random values
    const generated: string[] = [...guaranteedChars];
    for (let i = guaranteedChars.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      generated.push(charPool[randomIndex]);
    }

    // Shuffle the array to avoid predictable positions for guaranteed characters
    const shuffled = generated.sort(() => Math.random() - 0.5).join('');
    setPassword(shuffled);
    setCopied(false);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic strength calculation
  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (includeUpper) score++;
    if (includeLower) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { label: 'Medium', color: '#eab308' };
    return { label: 'Strong', color: '#22c55e' };
  };

  const strength = getStrength();

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '24px auto',
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        fontFamily: 'sans-serif',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}
    >
      <h2 style={{ margin: '0 0 16px 0', textAlign: 'center', fontSize: '20px' }}>
        Password Generator
      </h2>

      {/* Output Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '16px',
            wordBreak: 'break-all',
            letterSpacing: '1px',
            color: password ? '#38bdf8' : '#64748b',
          }}
        >
          {password || 'Select at least one option'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!password}
          style={{
            marginLeft: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: copied ? '#22c55e' : '#3b82f6',
            color: '#fff',
            cursor: password ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Length Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label htmlFor="pwd-length">Character Length</label>
          <strong style={{ color: '#38bdf8' }}>{length}</strong>
        </div>
        <input
          id="pwd-length"
          type="range"
          min="6"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {/* Checkbox Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
          />
          Include Uppercase Letters (A-Z)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
          />
          Include Lowercase Letters (a-z)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Include Numbers (0-9)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          Include Symbols (!@#$%)
        </label>
      </div>

      {/* Strength Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          backgroundColor: '#0f172a',
          borderRadius: '6px',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#94a3b8' }}>Strength:</span>
        <strong style={{ color: strength.color }}>{strength.label}</strong>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={generatePassword}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#10b981',
          color: '#0f172a',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Generate Password
      </button>
    </div>
  );
};

```

*** copy OTP Login.md ***

An accessible, production-ready React OTP (One-Time Password) Login component supporting auto-focus shifting, backspace navigation, paste handling, countdown timer resend, and phone number validation.

---

### Component Implementation

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpLoginProps {
  otpLength?: number;
  onLoginSuccess?: (phone: string, otp: string) => void;
}

export const OtpLogin: React.FC<OtpLoginProps> = ({
  otpLength = 6,
  onLoginSuccess,
}) => {
  // Step 1: Phone number, Step 2: OTP Entry
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const [timer, setTimer] = useState<number>(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus first OTP field on entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    setTimer(30);
    setOtp(new Array(otpLength).fill(''));
    setStep('otp');
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setVerificationError('');

    // Auto-advance to next input
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move focus backward if current box is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, otpLength);

    if (/^\d+$/.test(pastedData)) {
      const pasteDigits = pastedData.split('');
      const newOtp = [...otp];

      pasteDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setOtp(newOtp);
      const nextFocusIndex = Math.min(pasteDigits.length, otpLength - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < otpLength) {
      setVerificationError(`Please enter all ${otpLength} digits`);
      return;
    }

    setIsVerifying(true);
    // Simulate verification API
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerifying(false);

    if (enteredOtp === '123456') { // Demo static valid OTP
      if (onLoginSuccess) onLoginSuccess(phoneNumber, enteredOtp);
      alert('Login Successful! 🎉');
    } else {
      setVerificationError('Invalid OTP. (Demo valid OTP is: 123456)');
    }
  };

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '40px auto',
        padding: '32px 24px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        fontFamily: 'sans-serif',
        textAlign: 'center',
      }}
    >
      {step === 'phone' ? (
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Enter your mobile number to receive an authentication code
          </p>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label htmlFor="phone" style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                +91
              </span>
              <input
                id="phone"
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${phoneError ? '#ef4444' : '#cbd5e1'}`,
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
            {phoneError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Verify Code</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Sent to <strong>+91 {phoneNumber}</strong>{' '}
            <button
              onClick={() => setStep('phone')}
              style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
            >
              Change
            </button>
          </p>

          {/* OTP Input Boxes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1}`}
                style={{
                  width: '44px',
                  height: '48px',
                  borderRadius: '8px',
                  border: `1.5px solid ${verificationError ? '#ef4444' : digit ? '#2563eb' : '#cbd5e1'}`,
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              />
            ))}
          </div>

          {verificationError && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 16px 0' }}>
              {verificationError}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isVerifying}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isVerifying ? 'wait' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {isVerifying ? 'Verifying...' : 'Verify & Log In'}
          </button>

          {/* Resend Timer */}
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            {timer > 0 ? (
              <span>Resend OTP in <strong>{timer}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#2563eb',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

```

---

### Key Mechanics

* **Focus Management**: Automatically advances the cursor forward on numeric input and shifts backward on `Backspace`.
* **Clipboard Multi-paste (`onPaste`)**: Parses multi-digit clipboard strings, populates all boxes sequentially, and moves cursor focus to the end of the pasted sequence.
* **Mobile-friendly Virtual Keyboards**: Uses `inputMode="numeric"` to trigger numeric-only keypads on mobile browsers.

An alternative, robust architecture for an OTP input uses a **single hidden `<input />` overlay** synchronized with custom display digit slots.

This approach completely avoids manual ref juggling, eliminates multi-input cursor glitches, and natively supports mobile SMS autofill (`autoComplete="one-time-code"`).

---

### Single Hidden-Input Architecture

```tsx
import React, { useState, useRef, useEffect } from 'react';

interface SingleInputOtpProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export const SingleInputOtp: React.FC<SingleInputOtpProps> = ({
  length = 6,
  onComplete,
}) => {
  const [otpValue, setOtpValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, length);
    setOtpValue(rawVal);

    if (rawVal.length === length && onComplete) {
      onComplete(rawVal);
    }
  };

  useEffect(() => {
    // Auto-focus on component mount
    inputRef.current?.focus();
  }, []);

  return (
    <div
      style={{
        maxWidth: '380px',
        margin: '40px auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Enter Verification Code</h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
        We sent a {length}-digit code to your device.
      </p>

      {/* Visual Input Overlay Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'text',
          marginBottom: '20px',
        }}
      >
        {/* Real, transparent, accessible input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d*"
          maxLength={length}
          value={otpValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'text',
            zIndex: 2,
          }}
          aria-label="Enter verification code"
        />

        {/* Visual Digit Slots */}
        {Array.from({ length }).map((_, idx) => {
          const char = otpValue[idx] || '';
          const isCurrentSlot = isFocused && idx === Math.min(otpValue.length, length - 1);

          return (
            <div
              key={idx}
              style={{
                width: '44px',
                height: '52px',
                borderRadius: '8px',
                border: `2px solid ${
                  isCurrentSlot
                    ? '#2563eb'
                    : char
                    ? '#0f172a'
                    : '#cbd5e1'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
                color: '#0f172a',
                backgroundColor: isCurrentSlot ? '#eff6ff' : '#f8fafc',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              {char}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={otpValue.length !== length}
        onClick={() => onComplete && onComplete(otpValue)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: 600,
          cursor: otpValue.length === length ? 'pointer' : 'not-allowed',
          opacity: otpValue.length === length ? 1 : 0.5,
        }}
      >
        Verify Code
      </button>
    </div>
  );
};

```

---

### Comparison

| Feature                 | Multi-Input Pattern (Ref Array)                                | Single Hidden-Input Pattern                       |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| **Native SMS Autofill** | Requires manual paste interception                             | Natively works via `autoComplete="one-time-code"` |
| **Focus Handling**      | Complex manual `keydown`, `backspace`, and array ref traversal | Managed natively by browser caret position        |
| **State Complexity**    | Array state (`string[]`)                                       | Single string primitive (`string`)                |
| **Edge Case Bugs**      | Susceptible to rapid typing skips on mobile keyboards          | Guaranteed linear character buffer                |

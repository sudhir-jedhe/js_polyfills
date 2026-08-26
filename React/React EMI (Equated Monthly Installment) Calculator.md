*** copy React EMI (Equated Monthly Installment) Calculator.md ***

A responsive React EMI (Equated Monthly Installment) Calculator with interactive input sliders, dynamic monthly interest computation, and visual split breakdown.

---

### Formula

$$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$

Where:

* $P$ = Principal Loan Amount
* $r$ = Monthly interest rate ($\frac{\text{Annual Rate}}{12 \times 100}$)
* $n$ = Loan tenure in months ($\text{Years} \times 12$)

---

### Implementation

```tsx
import React, { useState, useMemo } from 'react';

export const EmiCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000000); // 10 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const p = Number(principal);
    const monthlyRate = Number(interestRate) / (12 * 100);
    const months = Number(tenureYears) * 12;

    if (p <= 0 || months <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    if (monthlyRate === 0) {
      const flatEmi = Math.round(p / months);
      return { emi: flatEmi, totalPayment: p, totalInterest: 0 };
    }

    const emiCalc =
      (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const roundedEmi = Math.round(emiCalc);
    const totalPay = roundedEmi * months;
    const totalInt = totalPay - p;

    return {
      emi: roundedEmi,
      totalPayment: totalPay,
      totalInterest: Math.max(0, totalInt),
    };
  }, [principal, interestRate, tenureYears]);

  const principalRatio = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '20px auto',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#1e293b' }}>
        EMI Calculator
      </h2>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Principal */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor="principal">Loan Amount</label>
            <strong>{formatCurrency(principal)}</strong>
          </div>
          <input
            id="principal"
            type="range"
            min="100000"
            max="10000000"
            step="50000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor="rate">Interest Rate (p.a.)</label>
            <strong>{interestRate}%</strong>
          </div>
          <input
            id="rate"
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Tenure */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor="tenure">Tenure (Years)</label>
            <strong>{tenureYears} Yr ({tenureYears * 12} Mos)</strong>
          </div>
          <input
            id="tenure"
            type="range"
            min="1"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Monthly EMI</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
            {formatCurrency(emi)}
          </div>
        </div>

        {/* Visual Progress Ratio */}
        <div
          style={{
            height: '10px',
            width: '100%',
            backgroundColor: '#ef4444',
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            marginBottom: '16px',
          }}
          aria-hidden="true"
        >
          <div style={{ width: `${principalRatio}%`, backgroundColor: '#3b82f6' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }} />
            Principal Amount:
          </span>
          <strong>{formatCurrency(principal)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }} />
            Total Interest:
          </span>
          <strong>{formatCurrency(totalInterest)}</strong>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '15px',
            borderTop: '1px dashed #cbd5e1',
            paddingTop: '8px',
            marginTop: '8px',
          }}
        >
          <span>Total Payment:</span>
          <strong>{formatCurrency(totalPayment)}</strong>
        </div>
      </div>
    </div>
  );
};

```

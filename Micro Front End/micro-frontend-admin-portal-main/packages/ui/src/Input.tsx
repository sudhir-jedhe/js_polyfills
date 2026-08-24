"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** Labelled text input with optional inline error. */
export function Input({ label, error, id, className = "", ...rest }: InputProps) {
  return (
    <div className="field">
      {label ? (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input id={id} className={`input ${className}`} {...rest} />
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

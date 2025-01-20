import React, { useState, useEffect, useRef } from 'react';
import { Input } from "./ui/input"

interface CellProps {
  value: string;
  formula: string;
  isActive: boolean;
  onClick: () => void;
  onChange: (value: string) => void;
}

const Cell: React.FC<CellProps> = ({ value, formula, isActive, onClick, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
    setLocalValue(formula);
  };

  const handleBlur = () => {
    setEditing(false);
    onChange(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onChange(localValue);
    }
  };

  return (
    <td
      className={`w-24 h-10 border border-border ${isActive ? 'bg-accent' : ''}`}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <Input
          ref={inputRef}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full border-none bg-transparent"
        />
      ) : (
        <div className="w-full h-full p-1 overflow-hidden">{value}</div>
      )}
    </td>
  );
};

export default Cell;


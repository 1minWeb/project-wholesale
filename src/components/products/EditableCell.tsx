import React, { useState, useEffect } from 'react';
import type { Column } from '../../types';

interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  column: Column;
}

export function EditableCell({ value, onChange, column }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return column.type === 'formula' || column.type === 'number'
        ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : val.toLocaleString();
    }
    return val;
  };

  if (!column.isEditable || column.type === 'formula') {
    return (
      <div className="px-6 py-4">
        {formatValue(value)}
      </div>
    );
  }

  if (editing) {
    return (
      <div className="px-6 py-4">
        <input
          type={column.type === 'number' ? 'number' : 'text'}
          value={currentValue}
          onChange={(e) => {
            const val = column.type === 'number' ? Number(e.target.value) : e.target.value;
            setCurrentValue(val);
          }}
          onBlur={() => {
            setEditing(false);
            onChange(currentValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditing(false);
              onChange(currentValue);
            }
          }}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          step={column.type === 'number' ? '0.01' : undefined}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
    >
      {formatValue(value)}
    </div>
  );
}
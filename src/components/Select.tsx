import React, { ChangeEvent, useMemo } from 'react';
import './Select.css';

export type Option = {
  text: string;
  value: string;
}

export type SelectProps = {
  options: (string | Option)[];
  id?: string;
  name?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ options, value, ...rest }: SelectProps) {
  const selectedValue = useMemo(() => {
    const option = options.find(option => {
      if (typeof option === 'string') {
        return option === value;
      }

      return option.value === value;
    });

    if (!option) {
      return '';
    }

    if (typeof option === 'string') {
      return option;
    }

    return option.text;
  }, [value, options]);
  return (
    <div className="Select-container">
      <select className="Select" value={value} {...rest}>
        {options.map(option => {
          if (typeof option === 'string') {
            return <option>{option}</option>;
          }

          return <option value={option.value}>{option.text}</option>
        })}
      </select>
      <span className="Select-value" aria-hidden="true">
        <span>
          <span>{selectedValue}</span>
        </span>
      </span>
      <span className="Select-arrow" aria-hidden="true">&#8250;</span>
    </div>
  )  
}

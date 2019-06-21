import React, { ChangeEvent } from 'react';
import './Select.css';

export type SelectProps = {
  options: string[];
  id?: string;
  name?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ options, value, ...rest }: SelectProps) {
  return (
    <div className="Select-container">
      <select className="Select" value={value} {...rest}>
        {options.map(option => (
          <option>{option}</option>
        ))}
      </select>
      <span className="Select-value" aria-hidden="true">
        <span>
          <span>{value}</span>
        </span>
      </span>
      <span className="Select-arrow" aria-hidden="true">&#8250;</span>
    </div>
  )  
}

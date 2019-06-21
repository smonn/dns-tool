import React, { ChangeEvent } from 'react';
import './Input.css';

export type InputProps = {
  disabled?: boolean;
  id?: string;
  name?: string;
  value: string;
  type: 'text';
  pattern?: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <input className="Input" autoCapitalize="none" autoComplete="off" {...props} />
  );
}

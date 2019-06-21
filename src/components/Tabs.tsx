import React from 'react';
import Tab from './Tab';
import './Tabs.css';

export type TabItem = {
  value: string;
  label: string;
}

export type TabsProps = {
  onChange: (tab: string) => void;
  current: string;
  items: TabItem[];
}

export default function Tabs({ onChange, current, items }: TabsProps) {
  return (
    <div className="Tabs">
      {items.map(item => (
        <Tab active={current === item.value} onClick={onChange} value={item.value} label={item.label} />
      ))}
    </div>
  )
}

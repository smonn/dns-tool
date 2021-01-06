import React, { MouseEvent, useMemo } from "react"

export type TabProps = {
  onClick: (value: string) => void
  value: string
  label: string
  active?: boolean
}

export default function Tab({ onClick, active, value, label }: TabProps) {
  const handleClick = useMemo(() => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      onClick(value)
    }
  }, [onClick, value])
  return (
    <button
      type="button"
      className={`Tab ${active ? "Tab-active" : ""}`}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

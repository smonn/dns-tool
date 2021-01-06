import React, { MouseEvent, ReactNode } from "react"
import "./Button.css"

export type ButtonProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
  disabled?: boolean
  type: "submit"
}

export default function Button({ children, ...rest }: ButtonProps) {
  return (
    <button className="Button" {...rest}>
      {children}
    </button>
  )
}

import React, { ReactNode } from "react"
import "./Label.css"

export type LabelProps = {
  children: ReactNode
  htmlFor: string
  hint?: string
}

export default function Label({ htmlFor, children, hint }: LabelProps) {
  return (
    <label className="Label" htmlFor={htmlFor}>
      {children} {hint && <small className="Label-hint">{hint}</small>}
    </label>
  )
}

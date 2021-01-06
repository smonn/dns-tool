import React, { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { serverOptions, typeOptions } from "../config"
import Button from "./Button"
import Input from "./Input"
import Label from "./Label"
import Select from "./Select"

export type LookupData = {
  type: string
  server: string
  hostname: string
}

export type LookupFormProps = {
  onSubmit: (data: LookupData) => Promise<void>
}

export default function LookupForm({ onSubmit }: LookupFormProps) {
  const [hostname, setHostname] = useState("")
  const [type, setType] = useState("A")
  const [server, setServer] = useState("Cloudflare")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useMemo(() => {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setSubmitting(true)
      await onSubmit({ hostname, type, server })
      setSubmitting(false)
    }
  }, [hostname, onSubmit, server, type])

  const handleChange = useMemo(() => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.target.name === "hostname") {
        setHostname(event.target.value)
      }
      if (event.target.name === "type") {
        setType(event.target.value)
      }
      if (event.target.name === "server") {
        setServer(event.target.value)
      }
    }
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="server">Public DNS Server</Label>
        <Select
          disabled={submitting}
          options={serverOptions}
          value={server}
          onChange={handleChange}
          id="server"
          name="server"
        />
      </div>
      <div>
        <Label htmlFor="hostname" hint="e.g. www.example.com">
          Hostname
        </Label>
        <Input
          disabled={submitting}
          id="hostname"
          name="hostname"
          type="text"
          pattern="^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$"
          required
          value={hostname}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="type">DNS record type</Label>
        <Select
          disabled={submitting}
          options={typeOptions}
          value={type}
          onChange={handleChange}
          id="type"
          name="type"
        />
      </div>
      <div>
        <Button disabled={submitting} type="submit">
          Lookup
        </Button>
      </div>
    </form>
  )
}

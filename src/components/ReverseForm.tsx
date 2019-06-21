import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { serverOptions } from "../config";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import Select from "./Select";

export type ReverseData = {
  server: string;
  ip: string;
}

export type ReverseFormProps = {
  onSubmit: (data: ReverseData) => Promise<void>;
};

export default function ReverseForm({ onSubmit }: ReverseFormProps) {
  const [ip, setIP] = useState('');
  const [server, setServer] = useState('Cloudflare');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useMemo(() => {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      await onSubmit({ ip, server });
      setSubmitting(false);
    };
  }, [ip, onSubmit, server]);
  
  const handleChange = useMemo(() => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.target.name === 'ip') {
        setIP(event.target.value);
      }
      if (event.target.name === 'server') {
        setServer(event.target.value);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="server">Public DNS Server</Label>
        <Select disabled={submitting} options={serverOptions} value={server} onChange={handleChange} id="server" name="server" />
      </div>
      <div>
        <Label htmlFor="ip" hint="e.g. 1.2.3.4">IPv4</Label>
        <Input disabled={submitting} id="ip" name="ip" type="text" pattern="^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[1-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$" required value={ip} onChange={handleChange} />
      </div>
      <div>
        <Button disabled={submitting} type="submit">Reverse</Button>
      </div>
    </form>
  );
}

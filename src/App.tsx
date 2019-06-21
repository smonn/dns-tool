import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';
import Select, { Option } from './components/Select';
import Input from './components/Input';
import Button from './components/Button';
import Label from './components/Label';

type ServerMap = {
  [key: string]: string[];
  Cloudflare: string[];
  Google: string[];
  Verisign: string[];
  'DNS.Watch': string[];
}

const servers: ServerMap = {
  Cloudflare: ['1.1.1.1','1.0.0.1'],
  Google: ['8.8.8.8','8.8.4.4'],
  Verisign: ['64.6.64.6','64.6.65.6'],
  'DNS.Watch': ['84.200.69.80', '84.200.70.40'],
};

const typeOptions: Option[] = [
  { value: 'A', text: 'A - IPv4 addresses' },
  { value: 'AAAA', text: 'AAAA - IPv6 addresses' },
  { value: 'CNAME', text: 'CNAME - Canonical Name records' },
  { value: 'MX', text: 'MX - Mail Exchange records' },
  { value: 'NAPTR', text: 'NAPTR - Name Authority Pointer records' },
  { value: 'NS', text: 'NS - Name Server records' },
  { value: 'PTR', text: 'PTR - Pointer records' },
  { value: 'SOA', text: 'SOA - Start of Authority records' },
  { value: 'SRV', text: 'SRV - Service records' },
  { value: 'TXT', text: 'TXT - Text records' },
];

const serverOptions: Option[] = Object.keys(servers).map(server => ({
  value: server,
  text: `${server} - ${servers[server].join(', ')}`
}));

function App() {
  const [hostname, setHostname] = useState('');
  const [type, setType] = useState('A');
  const [server, setServer] = useState('Cloudflare');
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useMemo(() => {
    return async (event: FormEvent<HTMLFormElement>) => {
      try {
        setSubmitting(true);
        event.preventDefault();
        const res = await fetch('/.netlify/functions/lookup', {
          method: 'POST',
          body: JSON.stringify({ servers: servers[server], hostname, type })
        });

        const json = await res.json();
        setResult(json);
      } catch (err) {
        setResult(err.message);
      } finally {
        setSubmitting(false);
      }
    };
  }, [hostname, server, type]);

  const handleChange = useMemo(() => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.target.name === 'hostname') {
        setHostname(event.target.value);
      }
      if (event.target.name === 'type') {
        setType(event.target.value);
      }
      if (event.target.name === 'server') {
        setServer(event.target.value);
      }
    };
  }, []);

  return (
    <div>
      <p>DNS lookup using public DNS servers. More options and reverse lookup to be added...</p>
      <p><a href="https://github.com/smonn/dns-tool">Source code on GitHub</a></p>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="server">Public DNS Server</Label>
          <Select disabled={submitting} options={serverOptions} value={server} onChange={handleChange} id="server" name="server" />
        </div>
        <div>
          <Label htmlFor="hostname" hint="e.g. www.example.com">Hostname</Label>
          <Input disabled={submitting} id="hostname" name="hostname" type="text" pattern="^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$" required value={hostname} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="type" hint="DNS record type">Type</Label>
          <Select disabled={submitting} options={typeOptions} value={type} onChange={handleChange} id="type" name="type" />
        </div>
        <div>
          <Button disabled={submitting} type="submit">Lookup</Button>
        </div>
      </form>
      <pre>{result ? JSON.stringify(result, null, 2) : '--- result will be displayed here'}</pre>
    </div>
  );
}

export default App;

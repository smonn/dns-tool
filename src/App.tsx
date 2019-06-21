import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';
import Select from './components/Select';

const typeOptions = [
  'A',
  'AAAA',
  'CNAME',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TXT',
];

function App() {
  const [hostname, setHostname] = useState('');
  const [type, setType] = useState('A');
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useMemo(() => {
    return async (event: FormEvent<HTMLFormElement>) => {
      try {
        setSubmitting(true);
        event.preventDefault();
        const res = await fetch('/.netlify/functions/lookup', {
          method: 'POST',
          body: JSON.stringify({ servers: ['1.1.1.1', '1.0.0.1'], hostname, type })
        });

        const json = await res.json();
        setResult(json);
      } catch (err) {
        setResult(err.message);
      } finally {
        setSubmitting(false);
      }
    };
  }, [hostname, type]);

  const handleChange = useMemo(() => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.target.name === 'hostname') {
        setHostname(event.target.value);
      }
      if (event.target.name === 'type') {
        setType(event.target.value);
      }
    };
  }, []);

  return (
    <div>
      <p>DNS lookup using Cloudflare's DNS servers (<code>1.1.1.1</code> and <code>1.0.0.1</code>). More options and reverse lookup to be added...</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="hostname">Hostname <small>e.g. www.example.com</small></label>
          <input autoCapitalize="none" autoCorrect="off" disabled={submitting} id="hostname" name="hostname" type="text" pattern="^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$" required value={hostname} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="type">Type <small>DNS record type</small></label>
          <Select options={typeOptions} value={type} onChange={handleChange} id="type" name="type" />
        </div>
        <div>
          <button disabled={submitting} type="submit">Lookup</button>
        </div>
      </form>
      <pre>{result ? JSON.stringify(result, null, 2) : '--- result will be displayed here'}</pre>
    </div>
  );
}

export default App;

import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';

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
        <label htmlFor="hostname">Hostname</label>
        <input disabled={submitting} id="hostname" name="hostname" type="url" required value={hostname} onChange={handleChange} />
        <label htmlFor="type">Type</label>
        <select id="type" name="type" value={type} onChange={handleChange}>
          <option>A</option>
          <option>AAAA</option>
          <option>CNAME</option>
          <option>MX</option>
          <option>NAPTR</option>
          <option>NS</option>
          <option>PTR</option>
          <option>SOA</option>
          <option>SRV</option>
          <option>TXT</option>
        </select>
        <button disabled={submitting} type="submit">Lookup</button>
      </form>
      <pre>{result ? JSON.stringify(result, null, 2) : '--- result will be displayed here'}</pre>
    </div>
  );
}

export default App;

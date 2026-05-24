import { useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { BaseNode } from './BaseNode';

const METHOD_COLORS = { GET: 'var(--node-green)', POST: 'var(--node-blue)', PUT: 'var(--node-amber)', DELETE: 'var(--node-red)', PATCH: 'var(--node-cyan)' };

export const APINode = ({ id, data }) => {
  const [url, setUrl]         = useState(data?.url || '');
  const [method, setMethod]   = useState(data?.method || 'GET');
  const [headers, setHeaders] = useState(data?.headers || []);
  const [auth, setAuth]       = useState(data?.auth || 'None');

  const addHeader = () => setHeaders(h => [...h, { key: '', value: '' }]);
  const removeHeader = (i) => setHeaders(h => h.filter((_, idx) => idx !== i));
  const updateHeader = (i, field, val) => setHeaders(h => h.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  return (
    <BaseNode id={id} title="API Call" accentColor="var(--node-cyan)" Icon={Globe}
      inputs={[{ id: 'body', label: 'body' }, { id: 'url_param', label: 'url' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <select className="node-input" value={method} onChange={e => setMethod(e.target.value)}
          style={{ width: 80, flexShrink: 0, color: METHOD_COLORS[method], fontWeight: 600 }}>
          {Object.keys(METHOD_COLORS).map(m => <option key={m}>{m}</option>)}
        </select>
        <input className="node-input" placeholder="https://api.example.com/endpoint"
          value={url} onChange={e => setUrl(e.target.value)} />
      </div>

      <label className="node-label">Auth
        <select className="node-input" value={auth} onChange={e => setAuth(e.target.value)}>
          {['None', 'Bearer Token', 'API Key', 'Basic Auth'].map(a => <option key={a}>{a}</option>)}
        </select>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headers</span>
        <button onClick={addHeader} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', gap: 3, fontSize: 10, alignItems: 'center' }}>
          <Plus size={10} /> Add
        </button>
      </div>
      {headers.map((h, i) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input className="node-input" placeholder="Key"   value={h.key}   onChange={e => updateHeader(i, 'key', e.target.value)}   style={{ flex: 1 }} />
          <input className="node-input" placeholder="Value" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} style={{ flex: 1 }} />
          <button onClick={() => removeHeader(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Trash2 size={10} />
          </button>
        </div>
      ))}
    </BaseNode>
  );
};
import { useState } from 'react';
import { ArrowRightFromLine } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [name, setName]         = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType]         = useState(data?.inputType || 'Text');
  const [required, setRequired] = useState(data?.required ?? true);
  const [description, setDesc]  = useState(data?.description || '');

  return (
    <BaseNode id={id} title="Input" accentColor="var(--node-green)" Icon={ArrowRightFromLine}
      outputs={[{ id: 'value', label: 'value' }]}>
      <label className="node-label">Name
        <input className="node-input" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <label className="node-label" style={{ flex: 1, marginBottom: 0 }}>Type
          <select className="node-input" value={type} onChange={e => setType(e.target.value)}>
            {['Text', 'File', 'Number', 'Boolean', 'JSON'].map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="node-label" style={{ flexShrink: 0, marginBottom: 0 }}>Required
          <div style={{ paddingTop: 6, display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)}
              style={{ accentColor: 'var(--node-green)', width: 13, height: 13 }} />
          </div>
        </label>
      </div>
      <label className="node-label">Description
        <input className="node-input" placeholder="What this input represents…"
          value={description} onChange={e => setDesc(e.target.value)} />
      </label>
    </BaseNode>
  );
};
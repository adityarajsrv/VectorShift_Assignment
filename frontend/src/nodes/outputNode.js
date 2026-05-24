import { useState } from 'react';
import { ArrowLeftToLine } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [name, setName]       = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType]       = useState(data?.outputType || 'Text');
  const [format, setFormat]   = useState(data?.format || 'Raw');

  return (
    <BaseNode id={id} title="Output" accentColor="var(--node-amber)" Icon={ArrowLeftToLine}
      inputs={[{ id: 'value', label: 'value' }]}>
      <label className="node-label">Name
        <input className="node-input" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        <label className="node-label" style={{ flex: 1, marginBottom: 0 }}>Type
          <select className="node-input" value={type} onChange={e => setType(e.target.value)}>
            {['Text', 'Image', 'JSON', 'File', 'Number'].map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="node-label" style={{ flex: 1, marginBottom: 0 }}>Format
          <select className="node-input" value={format} onChange={e => setFormat(e.target.value)}>
            {['Raw', 'Markdown', 'HTML', 'CSV'].map(f => <option key={f}>{f}</option>)}
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
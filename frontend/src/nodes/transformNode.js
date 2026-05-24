import { useState } from 'react';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';

const PRESETS = {
  'Custom': '',
  'Uppercase': 'input.toUpperCase()',
  'Lowercase': 'input.toLowerCase()',
  'Trim': 'input.trim()',
  'Parse JSON': 'JSON.parse(input)',
  'Stringify': 'JSON.stringify(input, null, 2)',
  'Split lines': 'input.split("\\n")',
  'Word count': 'input.split(" ").length',
};

export const TransformNode = ({ id, data }) => {
  const [preset, setPreset] = useState(data?.preset || 'Custom');
  const [expr, setExpr]     = useState(data?.expr || '');

  const handlePreset = (p) => {
    setPreset(p);
    if (p !== 'Custom') setExpr(PRESETS[p]);
  };

  return (
    <BaseNode id={id} title="Transform" accentColor="var(--node-purple)" Icon={Zap}
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}>
      <label className="node-label">Preset
        <select className="node-input" value={preset} onChange={e => handlePreset(e.target.value)}>
          {Object.keys(PRESETS).map(p => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="node-label">Expression
        <input className="node-input" placeholder="input.toUpperCase()" value={expr}
          onChange={e => { setExpr(e.target.value); setPreset('Custom'); }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
      </label>
    </BaseNode>
  );
};
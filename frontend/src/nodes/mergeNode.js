import { useState } from 'react';
import { Merge } from 'lucide-react';
import { BaseNode } from './BaseNode';

const STRATEGIES = ['Concat', 'JSON Array', 'First non-empty', 'Join with separator'];

export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy]   = useState(data?.strategy || 'Concat');
  const [separator, setSeparator] = useState(data?.separator || '\\n');

  return (
    <BaseNode id={id} title="Merge" accentColor="var(--node-teal)" Icon={Merge}
      inputs={[{ id: 'a', label: 'input a' }, { id: 'b', label: 'input b' }]}
      outputs={[{ id: 'merged', label: 'merged' }]}>
      <label className="node-label">Strategy
        <select className="node-input" value={strategy} onChange={e => setStrategy(e.target.value)}>
          {STRATEGIES.map(s => <option key={s}>{s}</option>)}
        </select>
      </label>
      {strategy === 'Join with separator' && (
        <label className="node-label">Separator
          <input className="node-input" value={separator} onChange={e => setSeparator(e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
        </label>
      )}
    </BaseNode>
  );
};
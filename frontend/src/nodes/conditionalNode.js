/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const OPERATORS = ['>', '<', '>=', '<=', '===', '!==', 'includes', 'startsWith', 'endsWith'];

export const ConditionalNode = ({ id, data }) => {
  const [mode, setMode]         = useState(data?.mode || 'expression');
  const [condition, setCondition] = useState(data?.condition || '');
  const [lhs, setLhs]           = useState(data?.lhs || 'value');
  const [op, setOp]             = useState(data?.op || '>');
  const [rhs, setRhs]           = useState(data?.rhs || '0');

  const builtExpr = `${lhs} ${op} ${rhs}`;

  return (
    <BaseNode id={id} title="Conditional" accentColor="var(--node-red)" Icon={GitBranch}
      inputs={[{ id: 'input', label: 'input' }]}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['builder', 'expression'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '3px 0', borderRadius: 4, border: '1px solid var(--border)',
            background: mode === m ? 'var(--accent)' : 'transparent',
            color: mode === m ? '#fff' : 'var(--text-muted)',
            fontSize: 10, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>{m}</button>
        ))}
      </div>
      {mode === 'builder' ? (
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <input className="node-input" value={lhs} onChange={e => setLhs(e.target.value)} placeholder="value" style={{ flex: 2 }} />
          <select className="node-input" value={op} onChange={e => setOp(e.target.value)} style={{ flex: 2 }}>
            {OPERATORS.map(o => <option key={o}>{o}</option>)}
          </select>
          <input className="node-input" value={rhs} onChange={e => setRhs(e.target.value)} placeholder="0" style={{ flex: 2 }} />
        </div>
      ) : (
        <label className="node-label" style={{ marginBottom: 8 }}>Expression
          <input className="node-input" placeholder="e.g. value.length > 10" value={condition}
            onChange={e => setCondition(e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[{ id: 'true', label: 'True', color: 'var(--node-green)' }, { id: 'false', label: 'False', color: 'var(--node-red)' }].map(branch => (
          <div key={branch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', paddingRight: 16 }}>
            <span style={{
              fontSize: 10, fontWeight: 500, color: branch.color,
              padding: '1px 7px', borderRadius: 3,
              background: `color-mix(in srgb, ${branch.color} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${branch.color} 22%, transparent)`,
            }}>{branch.label}</span>
            <Handle type="source" position={Position.Right} id={`${id}-${branch.id}`}
              style={{ right: -4, top: '50%', transform: 'translateY(-50%)', position: 'absolute', background: branch.color, border: '1.5px solid var(--bg-node)' }} />
          </div>
        ))}
      </div>
    </BaseNode>
  );
};
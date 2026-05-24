import { useState } from 'react';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { BaseNode } from './BaseNode';

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'claude-3.5-sonnet', 'claude-3-haiku', 'gemini-1.5-pro', 'gemini-flash'];

export const LLMNode = ({ id, data }) => {
  const [model, setModel]           = useState(data?.model || 'gpt-4o');
  const [temperature, setTemp]      = useState(data?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens]   = useState(data?.maxTokens || 1024);
  const [expanded, setExpanded]     = useState(false);

  return (
    <BaseNode id={id} title="LLM" accentColor="var(--node-purple)" Icon={Bot}
      inputs={[{ id: 'system', label: 'system' }, { id: 'prompt', label: 'prompt' }]}
      outputs={[{ id: 'response', label: 'response' }]}>

      <label className="node-label">Model
        <select className="node-input" value={model} onChange={e => setModel(e.target.value)}>
          {MODELS.map(m => <option key={m}>{m}</option>)}
        </select>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded ? 8 : 0 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Temperature: <span style={{ color: 'var(--node-purple)', fontWeight: 600 }}>{temperature}</span>
        </span>
        <button onClick={() => setExpanded(e => !e)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', padding: 2,
        }}>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {expanded && (
        <>
          <input type="range" min={0} max={2} step={0.1} value={temperature}
            onChange={e => setTemp(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--node-purple)', marginBottom: 8 }} />
          <label className="node-label">Max Tokens
            <input className="node-input" type="number" value={maxTokens} min={1} max={8192}
              onChange={e => setMaxTokens(parseInt(e.target.value))} />
          </label>
        </>
      )}
    </BaseNode>
  );
};
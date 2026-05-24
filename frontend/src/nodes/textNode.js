import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const vars = [...new Set([...text.matchAll(/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g)].map(m => m[1]))];
    setVariables(vars);
    if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = ref.current.scrollHeight + 'px'; }
  }, [text]);

  return (
    <BaseNode id={id} title="Text" accentColor="var(--node-blue)" Icon={Type}
      outputs={[{ id: 'output', label: 'output' }]}>
      <label className="node-label">Content
        <textarea ref={ref} className="node-input" value={text} onChange={e => setText(e.target.value)}
          style={{ minHeight: 52, resize: 'horizontal', lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} />
      </label>
      {variables.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
          {variables.map(v => (
            <span key={v} style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 3,
              background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
              color: 'var(--node-blue)', fontFamily: "'JetBrains Mono', monospace",
            }}>{v}</span>
          ))}
        </div>
      )}
      {variables.map((v, i) => (
        <Handle key={v} type="target" position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%`, background: 'var(--node-blue)', border: '1.5px solid var(--bg-node)' }}
          title={v}
        />
      ))}
    </BaseNode>
  );
};
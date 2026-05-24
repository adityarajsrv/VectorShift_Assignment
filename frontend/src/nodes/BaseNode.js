import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { X } from 'lucide-react';

export const BaseNode = ({ id, title, inputs = [], outputs = [], children, accentColor = 'var(--accent)', Icon }) => {
  const onNodesChange = useStore((s) => s.onNodesChange);

  const handleDelete = (e) => {
    e.stopPropagation();
    onNodesChange([{ type: 'remove', id }]);
  };

  return (
    <div style={{
      minWidth: 200, maxWidth: 280,
      background: 'var(--bg-node)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-node)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-node-header)',
        borderBottom: '1px solid var(--border-subtle)',
        borderRadius: '8px 8px 0 0',
        padding: '7px 10px',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        {Icon && (
          <div style={{
            width: 20, height: 20, borderRadius: 4,
            background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={11} color={accentColor} />
          </div>
        )}
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: accentColor, opacity: 0.7,
          }} />
          <button
            onClick={handleDelete}
            title="Delete node"
            className="nodrag"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 16, height: 16, borderRadius: 3,
              background: 'transparent',
              border: '1px solid transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.12s',
              lineHeight: 1,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.15)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)';
              e.currentTarget.style.color = 'var(--node-red)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X size={10} />
          </button>
        </div>
      </div>
      <div style={{ padding: '10px 10px 10px' }}>
        {children}
      </div>
      {inputs.map((inp, i) => {
        const top = `${((i + 1) / (inputs.length + 1)) * 100}%`;
        return (
          <div key={inp.id} style={{ position: 'absolute', top, left: 0, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <span style={{
              position: 'absolute',
              right: 'calc(100% + 8px)', 
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 9,
              fontFamily: 'Inter, sans-serif',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              {inp.label}
            </span>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${inp.id}`}
              style={{
                position: 'relative', top: 'auto', left: 'auto', transform: 'none',
                background: accentColor, border: '1.5px solid var(--bg-node)',
                pointerEvents: 'all', flexShrink: 0,
              }}
            />
          </div>
        );
      })}
      {outputs.map((out, i) => {
        const top = `${((i + 1) / (outputs.length + 1)) * 100}%`;
        return (
          <div key={out.id} style={{ position: 'absolute', top, right: 0, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <span style={{
              position: 'absolute',
              left: 'calc(100% + 8px)',  
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 9,
              fontFamily: 'Inter, sans-serif',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              {out.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${out.id}`}
              style={{
                position: 'relative', top: 'auto', right: 'auto', transform: 'none',
                background: accentColor, border: '1.5px solid var(--bg-node)',
                pointerEvents: 'all', flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
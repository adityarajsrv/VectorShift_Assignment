import {
  ArrowRightFromLine, ArrowLeftToLine, Bot, Type,
  GitBranch, Globe, Merge, StickyNote, Zap,
  Undo2, Redo2, Trash2, Sun, Moon, PlayCircle, X,
} from 'lucide-react';
import { useStore } from './store';
import { useTheme } from './App';

const NODES = [
  { type: 'customInput', label: 'Input', color: 'var(--node-green)', Icon: ArrowRightFromLine },
  { type: 'llm', label: 'LLM', color: 'var(--node-purple)', Icon: Bot },
  { type: 'customOutput', label: 'Output', color: 'var(--node-amber)', Icon: ArrowLeftToLine },
  { type: 'text', label: 'Text', color: 'var(--node-blue)', Icon: Type },
  { type: 'conditional', label: 'Conditional', color: 'var(--node-red)', Icon: GitBranch },
  { type: 'api', label: 'API Call', color: 'var(--node-cyan)', Icon: Globe },
  { type: 'merge', label: 'Merge', color: 'var(--node-teal)', Icon: Merge },
  { type: 'note', label: 'Note', color: 'var(--node-orange)', Icon: StickyNote },
  { type: 'transform', label: 'Transform', color: 'var(--node-purple)', Icon: Zap },
];

const NodePill = ({ type, label, color, Icon }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div draggable onDragStart={onDragStart}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 10px 5px 8px', borderRadius: 6,
        border: '1px solid var(--border)', background: 'var(--bg-node)',
        color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
        cursor: 'grab', userSelect: 'none',
        transition: 'border-color 0.12s, color 0.12s, background 0.12s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-node-header)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-node)'; }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: color, opacity: 0.7 }} />
      <Icon size={12} color={color} />
      {label}
    </div>
  );
};

const IconBtn = ({ onClick, disabled, title, icon: BtnIcon, label, danger = false }) => (
  <button onClick={onClick} disabled={disabled} title={title} style={{
    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px',
    borderRadius: 6, border: '1px solid var(--border)', background: 'transparent',
    color: danger ? 'var(--node-red)' : 'var(--text-secondary)',
    fontSize: 12, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, transition: 'all 0.12s', whiteSpace: 'nowrap', flexShrink: 0,
  }}
    onMouseEnter={e => { if (disabled) return; e.currentTarget.style.background = danger ? 'rgba(248,113,113,0.08)' : 'var(--bg-node-header)'; e.currentTarget.style.borderColor = danger ? 'rgba(248,113,113,0.4)' : 'var(--accent)'; e.currentTarget.style.color = danger ? 'var(--node-red)' : 'var(--text-primary)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = danger ? 'var(--node-red)' : 'var(--text-secondary)'; }}
  >
    <BtnIcon size={13} />{label}
  </button>
);

const Divider = () => <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0, margin: '0 2px' }} />;

export const PipelineToolbar = ({ onLoadDemo, onClearDemo, isDemoActive }) => {
  const clearNodes = useStore(s => s.clearNodes);
  const undo = useStore(s => s.undo);
  const redo = useStore(s => s.redo);
  const history = useStore(s => s.history);
  const future = useStore(s => s.future);
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      background: 'var(--bg-toolbar)', borderBottom: '1px solid var(--border)',
      padding: '0 14px', display: 'flex', alignItems: 'center', gap: 6,
      height: 52, flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 6, flexShrink: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          VectorShift
        </span>
      </div>

      <Divider />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <IconBtn onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)" icon={Undo2} label="Undo" />
        <IconBtn onClick={redo} disabled={future.length === 0} title="Redo" icon={Redo2} label="Redo" />
        <IconBtn onClick={clearNodes} title="Clear canvas" icon={Trash2} label="Clear" danger />
      </div>

      <Divider />

      <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap', flex: 1, alignItems: 'center', overflowX: 'auto', padding: '2px 0' }}>
        {NODES.map(n => <NodePill key={n.type} {...n} />)}
      </div>

      <Divider />

      {isDemoActive ? (
        <button onClick={onClearDemo} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
          borderRadius: 6, border: '1px solid rgba(248,113,113,0.35)',
          background: 'rgba(248,113,113,0.08)', color: 'var(--node-red)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          transition: 'all 0.12s',
        }}>
          <X size={12} /> Close Demo
        </button>
      ) : (
        <button onClick={onLoadDemo} style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
          borderRadius: 6, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-secondary)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          transition: 'all 0.12s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <PlayCircle size={12} /> Demo
        </button>
      )}

      <Divider />

      <button onClick={toggleTheme} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)',
        background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-node-header)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
};
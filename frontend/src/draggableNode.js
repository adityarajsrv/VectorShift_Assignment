export const DraggableNode = ({ type, label, color, Icon }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        background: 'var(--bg-node)',
        color: 'var(--text-secondary)',
        fontSize: 12, fontWeight: 500,
        cursor: 'grab', userSelect: 'none',
        transition: 'border-color 0.12s, color 0.12s, background 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'var(--bg-node-header)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'var(--bg-node)';
      }}
    >
      {Icon && <Icon size={12} color={color} />}
      {label}
    </div>
  );
};
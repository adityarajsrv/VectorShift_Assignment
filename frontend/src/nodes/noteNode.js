import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { BaseNode } from './BaseNode';

const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'];

export const NoteNode = ({ id, data }) => {
  const [note, setNote]     = useState(data?.note || '');
  const [color, setColor]   = useState(data?.color || '#fbbf24');

  return (
    <BaseNode id={id} title="Note" accentColor={color} Icon={StickyNote}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: 14, height: 14, borderRadius: '50%', background: c, border: 'none',
            cursor: 'pointer', outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 1,
          }} />
        ))}
      </div>
      <textarea className="node-input" value={note} onChange={e => setNote(e.target.value)}
        placeholder="Add a note…"
        style={{ minHeight: 64, resize: 'vertical', lineHeight: 1.6 }} />
    </BaseNode>
  );
};
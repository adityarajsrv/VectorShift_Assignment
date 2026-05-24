import { useState } from 'react';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle2, XCircle, X, AlertTriangle, Unplug } from 'lucide-react';

const REASON_META = {
  valid:          { Icon: CheckCircle2, color: 'var(--node-green)', title: 'Valid DAG',       body: 'No cycles detected — pipeline is ready to run.' },
  cycle:          { Icon: XCircle,      color: 'var(--node-red)',   title: 'Cycle Detected',  body: 'Fix cycles before executing this pipeline.' },
  no_connections: { Icon: Unplug,       color: 'var(--node-amber)', title: 'Not Connected',   body: 'Connect nodes with edges to form a pipeline.' },
  empty:          { Icon: AlertTriangle,color: 'var(--text-muted)', title: 'Empty Canvas',    body: 'Add at least one node before submitting.' },
  dangling_edge:  { Icon: AlertTriangle,color: 'var(--node-amber)', title: 'Dangling Edge',   body: 'An edge references a node that no longer exists.' },
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(useShallow(s => ({ nodes: s.nodes, edges: s.edges })));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nodes.length) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      setResult(await res.json());
    } catch { setResult({ error: true }); }
    setLoading(false);
  };

  const meta = result ? (REASON_META[result.reason] ?? REASON_META.valid) : null;

  return (
    <>
      {result && (
        <div className="modal-overlay" onClick={() => setResult(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Pipeline Analysis
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  {result.error ? 'Request failed' : `${result.num_nodes} node${result.num_nodes !== 1 ? 's' : ''} · ${result.num_edges} edge${result.num_edges !== 1 ? 's' : ''}`}
                </div>
              </div>
              <button onClick={() => setResult(null)} style={{
                width: 24, height: 24, borderRadius: 4, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>

            {result.error ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--node-red)', fontSize: 12, padding: '10px 12px', background: 'rgba(224,85,85,0.06)', border: '1px solid rgba(224,85,85,0.2)', borderRadius: 6 }}>
                <XCircle size={13} /> Could not reach backend on port 8000.
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {[
                    { label: 'Nodes', value: result.num_nodes, color: 'var(--node-purple)' },
                    { label: 'Edges', value: result.num_edges, color: 'var(--node-cyan)' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: 'var(--bg-input)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '11px 13px',
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
                      <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {meta && (() => {
                  const { Icon: StatusIcon, color, title, body } = meta;
                  return (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 12px', borderRadius: 6,
                      background: `${color}08`,
                      border: `1px solid ${color}28`,
                    }}>
                      <StatusIcon size={14} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '-0.01em' }}>{title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{body}</div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
      <div style={{
        height: 44, background: 'var(--bg-toolbar)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, flexShrink: 0, padding: '0 16px',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading || !nodes.length}
          style={{
            padding: '5px 18px',
            background: !nodes.length ? 'transparent' : 'var(--accent)',
            color: !nodes.length ? 'var(--text-disabled)' : '#fff',
            border: `1px solid ${!nodes.length ? 'var(--border)' : 'transparent'}`,
            borderRadius: 5, fontSize: 12, fontWeight: 500,
            cursor: !nodes.length ? 'not-allowed' : 'pointer',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => { if (!nodes.length || loading) return; e.currentTarget.style.background = '#4d6af5'; }}
          onMouseLeave={e => { if (!nodes.length || loading) return; e.currentTarget.style.background = 'var(--accent)'; }}
        >
          {loading ? 'Analyzing…' : 'Submit Pipeline'}
        </button>
      </div>
    </>
  );
};
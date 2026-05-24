import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

const snap = (state) => ({
  nodes: JSON.parse(JSON.stringify(state.nodes)),
  edges: JSON.parse(JSON.stringify(state.edges)),
});

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  history: [],
  future: [],

  _save: () => {
    const s = get();
    set({ history: [...s.history, snap(s)], future: [] });
  },

  undo: () => {
    const { history, future, nodes, edges } = get();
    if (!history.length) return;
    const prev = history[history.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      history: history.slice(0, -1),
      future: [snap({ nodes, edges }), ...future],
    });
  },

  redo: () => {
    const { history, future, nodes, edges } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      history: [...history, snap({ nodes, edges })],
    });
  },

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] == null) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    get()._save();
    set((s) => ({ nodes: [...s.nodes, node] }));
  },

  clearNodes: () => {
    get()._save();
    set({ nodes: [], edges: [] });
  },

  onNodesChange: (changes) => {
    const meaningful = changes.some(c =>
      c.type === 'remove' ||
      (c.type === 'position' && c.dragging === false)
    );
    if (meaningful) get()._save();
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) }));
  },

  onEdgesChange: (changes) => {
    const meaningful = changes.some(c => c.type === 'remove');
    if (meaningful) get()._save();
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) }));
  },

  onConnect: (connection) => {
    get()._save();
    set((s) => ({
      edges: addEdge({
        ...connection, type: 'smoothstep', animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: '#2e3a52' },
        style: { stroke: '#2e3a52' },
      }, s.edges),
    }));
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set((s) => ({
      nodes: s.nodes.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, [fieldName]: fieldValue } } : n
      ),
    }));
  },
}));
# Frontend - Pipeline Builder

React + ReactFlow visual pipeline builder. Drag, connect, and submit node graphs for backend validation.

## Stack

- **React 18** - UI
- **ReactFlow** - canvas, nodes, edges
- **Zustand** - global state + undo/redo history
- **Lucide React** - icons
- **Inter + JetBrains Mono** - typography (Google Fonts)

## Running

```bash
npm install
npm start
# → http://localhost:3000
```

## Architecture

### Node Abstraction (`src/nodes/BaseNode.js`)

All nodes share a single `BaseNode` component that handles:
- Consistent header (icon, title, status dot, delete button)
- Positioned input/output handles with floating labels
- Theming via CSS variables

Adding a new node = one new file, no shared code changes:

```js
export const MyNode = ({ id }) => (
  <BaseNode id={id} title="My Node" accentColor="var(--node-green)" Icon={SomeIcon}
    inputs={[{ id: 'in', label: 'input' }]}
    outputs={[{ id: 'out', label: 'output' }]}>
    {/* fields */}
  </BaseNode>
);
```

### Node Types

| Node | Purpose | Handles |
|------|---------|---------|
| Input | Pipeline entry point - name, type, required flag | → value |
| Output | Pipeline exit - name, type, format | value → |
| LLM | Model selector, temperature slider, max tokens | system, prompt → response |
| Text | Auto-resizing textarea, dynamic `{{variable}}` handles | variables → output |
| Conditional | Builder or expression mode, True/False outputs | input → true, false |
| API Call | Method, URL, auth, dynamic headers | body, url → response, status |
| Merge | Combine two inputs with configurable strategy | a, b → merged |
| Transform | Preset or custom JS expression on input | input → output |
| Note | Color-coded annotation, no connections | - |

### Text Node - Dynamic Variables

The Text node parses `{{variableName}}` patterns from the textarea content and creates a corresponding input handle for each unique variable name. This uses:

```js
const vars = [...new Set(
  [...text.matchAll(/\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g)]
    .map(m => m[1])
)];
```

Height auto-resizes via `scrollHeight`. Width resizes via CSS `resize: horizontal`.

### State Management (`src/store.js`)

Zustand store manages:
- `nodes` / `edges` - ReactFlow state
- `history` / `future` - undo/redo snapshot stacks
- `nodeIDs` - per-type ID counters

**Undo/Redo strategy:** immutable snapshots (`JSON.parse(JSON.stringify(...))`) saved before every meaningful mutation. Meaningful mutations: add node, delete node, connect edge, delete edge, finish dragging node. Field edits are intentionally excluded (too granular).

```
Action        → _save() snapshots current → apply mutation
Undo          → pop history → push current to future → restore snapshot
Redo          → shift future → push current to history → restore snapshot
```

### Demo Pipeline

`App.js` holds a hardcoded 6-node demo (Input → Text → LLM → Conditional → Transform → Output). On load:
1. Current canvas is saved to component state
2. Demo nodes/edges replace the store
3. On "Close Demo", the saved canvas is restored

### Theming

CSS custom properties on `:root` (dark) and `[data-theme="light"]`. Toggle managed via `ThemeContext` in `App.js`. All node colors, backgrounds, borders, and shadows are tokenised - changing a theme only requires updating the root variables.

## File Map

```
src/
├── App.js              # Root, ThemeContext, demo state
├── ui.js               # ReactFlow canvas, keyboard shortcuts
├── toolbar.js          # Node palette, undo/redo, demo button, theme toggle
├── submit.js           # Submit + analysis modal
├── store.js            # Zustand - nodes, edges, history
├── draggableNode.js    # Drag source (toolbar pills)
├── index.css           # CSS variables, ReactFlow overrides, shared classes
└── nodes/
    ├── BaseNode.js     # Shared node shell
    ├── inputNode.js
    ├── outputNode.js
    ├── llmNode.js
    ├── textNode.js
    ├── conditionalNode.js
    ├── apiNode.js
    ├── mergeNode.js
    ├── noteNode.js
    └── transformNode.js
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Backspace` / `Delete` | Delete selected node/edge (ReactFlow default) |
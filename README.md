# VectorShift - Frontend Technical Assessment

A visual pipeline builder with a React/ReactFlow frontend and FastAPI backend. Build, connect, and validate AI workflows through an interactive node-based canvas.

## Project Structure

```
VectorShift_Assignment/
├── frontend/          # React application
│   └── src/
│       ├── nodes/     # Node components (BaseNode + 9 node types)
│       ├── App.js     # Root - theme context, demo pipeline state
│       ├── ui.js      # ReactFlow canvas
│       ├── toolbar.js # Top bar - node palette, undo/redo, demo
│       ├── submit.js  # Submit button + analysis modal
│       └── store.js   # Zustand state - nodes, edges, history
└── backend/
    └── main.py        # FastAPI - pipeline parse + DAG validation
```

## Quick Start

**Backend** (Terminal 1):
```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
# → http://localhost:8000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

## What's Built

| Part | Description | Status |
|------|-------------|--------|
| Node Abstraction | `BaseNode` component + 9 node types | ✅ |
| Styling | Dark/light theme, production-grade UI | ✅ |
| Text Node Logic | Auto-resize + dynamic `{{variable}}` handles | ✅ |
| Backend Integration | DAG validation + typed response modal | ✅ |

## Key Design Decisions

**Config-driven nodes** - Every node is a thin wrapper around `BaseNode`. Adding a new node type requires one file with zero changes to shared infrastructure.

**Typed DAG validation** - The backend returns a `reason` field (`valid`, `cycle`, `empty`, `no_connections`, `dangling_edge`) beyond the spec's `is_dag: bool`, enabling specific actionable feedback in the UI.

**Immutable undo/redo** - Snapshot-based history stack in Zustand. Captures state before every meaningful mutation: add, delete, connect, and drag-to-reposition.

**Demo pipeline** - Loads a pre-built 6-node pipeline (Input → Text → LLM → Conditional → Transform → Output) demonstrating the full node ecosystem. User's existing work is saved and restored on close.
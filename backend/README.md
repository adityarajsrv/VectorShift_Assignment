# Backend - Pipeline Parser

FastAPI service that receives a pipeline graph and validates its structure.

## Stack

- **Python 3.9+**
- **FastAPI** - REST API
- **Pydantic** - request validation
- **Uvicorn** - ASGI server

## Running

```bash
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

## API

### `POST /pipelines/parse`

Accepts a pipeline graph and returns node/edge counts plus DAG validation.

**Request**
```json
{
  "nodes": [{ "id": "customInput-1", "type": "customInput", "...": "..." }],
  "edges": [{ "id": "e1", "source": "customInput-1", "target": "llm-1", "...": "..." }]
}
```

**Response**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true,
  "reason": "valid"
}
```

### Response `reason` values

| Value | Meaning |
|-------|---------|
| `valid` | No cycles, all nodes connected - pipeline can execute |
| `cycle` | Graph contains a cycle - Kahn's algorithm detected unprocessed nodes |
| `empty` | Zero nodes submitted |
| `no_connections` | Nodes exist but no edges |
| `dangling_edge` | An edge references a node ID not present in the graph |

## DAG Validation - Kahn's Algorithm

```python
# Build adjacency list + indegree map
adj = {id: [] for id in node_ids}
indegree = {id: 0 for id in node_ids}
for edge in edges:
    adj[edge.source].append(edge.target)
    indegree[edge.target] += 1

# Process nodes with no incoming edges
queue = deque([n for n in node_ids if indegree[n] == 0])
count = 0
while queue:
    node = queue.popleft()
    count += 1
    for neighbor in adj[node]:
        indegree[neighbor] -= 1
        if indegree[neighbor] == 0:
            queue.append(neighbor)

# If not all nodes processed → cycle exists
is_dag = count == len(node_ids)
```

**Why Kahn's?** O(V + E) time complexity, naturally handles disconnected components, and produces a clear cycle signal without DFS recursion depth concerns.

## CORS

Configured to accept all origins (`*`) for local development. Restrict `allow_origins` before any production deployment.
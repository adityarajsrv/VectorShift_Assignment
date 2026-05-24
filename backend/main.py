from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import deque

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

def analyze_pipeline(nodes, edges):
    """
    Returns (is_dag: bool, reason: str)

    Rules:
      - Empty pipeline (no nodes)         → invalid, reason: 'empty'
      - Nodes exist but no edges          → invalid, reason: 'no_connections'
      - Dangling edge (unknown node ref)  → invalid, reason: 'dangling_edge'
      - Has a cycle                       → invalid, reason: 'cycle'
      - Passes all checks                 → valid DAG
    """
    if len(nodes) == 0:
        return False, 'empty'

    if len(edges) == 0:
        return False, 'no_connections'

    ids = {n['id'] for n in nodes}

    for e in edges:
        if e['source'] not in ids or e['target'] not in ids:
            return False, 'dangling_edge'

    # Kahn's algorithm — cycle detection
    adj = {id: [] for id in ids}
    indegree = {id: 0 for id in ids}
    for e in edges:
        adj[e['source']].append(e['target'])
        indegree[e['target']] += 1

    q = deque([n for n in ids if indegree[n] == 0])
    count = 0
    while q:
        node = q.popleft()
        count += 1
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                q.append(neighbor)

    if count != len(ids):
        return False, 'cycle'

    return True, 'valid'


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    is_dag, reason = analyze_pipeline(pipeline.nodes, pipeline.edges)
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_dag,
        'reason': reason,
    }
import { useState, createContext, useContext } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';
import './index.css';
import { PlayCircle } from 'lucide-react';

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const DEMO_PIPELINE = {
  nodes: [
    { id: 'customInput-1',  type: 'customInput',  position: { x: 60,   y: 200 }, data: { id: 'customInput-1',  nodeType: 'customInput',  inputName: 'user_query', inputType: 'Text' } },
    { id: 'text-1',         type: 'text',         position: { x: 300,  y: 80  }, data: { id: 'text-1',         nodeType: 'text',         text: 'You are a helpful assistant.\n\nUser: {{user_query}}' } },
    { id: 'llm-1',          type: 'llm',          position: { x: 580,  y: 180 }, data: { id: 'llm-1',          nodeType: 'llm',          model: 'gpt-4o', temperature: 0.7 } },
    { id: 'conditional-1',  type: 'conditional',  position: { x: 840,  y: 180 }, data: { id: 'conditional-1',  nodeType: 'conditional',  condition: 'response.length > 100' } },
    { id: 'transform-1',    type: 'transform',    position: { x: 1080, y: 60  }, data: { id: 'transform-1',    nodeType: 'transform',    expr: 'input.slice(0,100) + "…"' } },
    { id: 'customOutput-1', type: 'customOutput', position: { x: 1320, y: 180 }, data: { id: 'customOutput-1', nodeType: 'customOutput', outputName: 'final_response', outputType: 'Text' } },
  ],
  edges: [
    { id: 'e1', source: 'customInput-1', sourceHandle: 'customInput-1-value',    target: 'text-1',        targetHandle: 'text-1-user_query',       type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
    { id: 'e2', source: 'text-1',        sourceHandle: 'text-1-output',           target: 'llm-1',         targetHandle: 'llm-1-prompt',            type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
    { id: 'e3', source: 'llm-1',         sourceHandle: 'llm-1-response',          target: 'conditional-1', targetHandle: 'conditional-1-input',     type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
    { id: 'e4', source: 'conditional-1', sourceHandle: 'conditional-1-true',      target: 'transform-1',   targetHandle: 'transform-1-input',       type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
    { id: 'e5', source: 'conditional-1', sourceHandle: 'conditional-1-false',     target: 'customOutput-1',targetHandle: 'customOutput-1-value',    type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
    { id: 'e6', source: 'transform-1',   sourceHandle: 'transform-1-output',      target: 'customOutput-1',targetHandle: 'customOutput-1-value',    type: 'smoothstep', animated: true, style: { stroke: '#2e3a52' } },
  ],
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [savedPipeline, setSavedPipeline] = useState(null);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleLoadDemo = () => {
    const state = useStore.getState();
    setSavedPipeline({ nodes: state.nodes, edges: state.edges });
    useStore.setState({ nodes: DEMO_PIPELINE.nodes, edges: DEMO_PIPELINE.edges, history: [], future: [] });
    setIsDemoActive(true);
  };

  const handleClearDemo = () => {
    if (savedPipeline) {
      useStore.setState({ nodes: savedPipeline.nodes, edges: savedPipeline.edges, history: [], future: [] });
    } else {
      useStore.setState({ nodes: [], edges: [], history: [], future: [] });
    }
    setSavedPipeline(null);
    setIsDemoActive(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme} style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-app)' }}>
        <PipelineToolbar
          onLoadDemo={handleLoadDemo}
          onClearDemo={handleClearDemo}
          isDemoActive={isDemoActive}
        />
        {isDemoActive && (
          <div style={{
            background: 'rgba(79,110,247,0.08)', borderBottom: '1px solid rgba(79,110,247,0.2)',
            padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11, color: 'var(--accent)', flexShrink: 0,
          }}>
            <PlayCircle size={12} />
            Demo mode — this is a pre-built example pipeline. Drag new nodes or close demo to return to your work.
          </div>
        )}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <PipelineUI isDemoActive={isDemoActive} />
        </div>
        <SubmitButton />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

import { PromptNode, ResponseNode } from './components/CustomNodes';

// Define the custom types mapped to components
const nodeTypes = {
  promptNode: PromptNode,
  responseNode: ResponseNode,
};

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [promptValue, setPromptValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [nodes, setNodes] = useState([
    {
      id: '1',
      type: 'promptNode',
      position: { x: 100, y: 250 },
      data: {
        value: promptValue,
        onChange: (e) => setPromptValue(e.target.value)
      },
    },
    {
      id: '2',
      type: 'responseNode',
      position: { x: 550, y: 250 },
      data: {
        value: responseValue,
        isLoading: false,
        isError: false
      },
    },
  ]);

  const [edges, setEdges] = useState(initialEdges);

  // Sync state changes back to node data efficiently
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          return {
            ...node,
            data: {
              ...node.data,
              value: promptValue,
              onChange: (e) => setPromptValue(e.target.value)
            }
          };
        }
        if (node.id === '2') {
          return {
            ...node,
            data: { 
              ...node.data, 
              value: responseValue,
              isLoading,
              isError: responseValue.startsWith('Error:') 
            }
          };
        }
        return node;
      })
    );
  }, [promptValue, responseValue, isLoading]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleRunFlow = async () => {
    if (!promptValue.trim()) return;
    setIsLoading(true);
    setResponseValue('');
    setSaveMessage('');

    try {
      const res = await axios.post(`${API_URL}/api/ask-ai`, { prompt: promptValue });
      const aiText = res.data.response;
      setResponseValue(aiText);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponseValue('Error: Failed to fetch AI response.\nPlease ensure the backend is running and OPENROUTER_API_KEY is properly set in the server/.env configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!responseValue || responseValue.startsWith('Error:')) return;
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await axios.post(`${API_URL}/api/save`, { prompt: promptValue, response: responseValue });
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving interaction:', error);
      setSaveMessage('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
      <header className="app-header">
        <h2 className="app-title">AI Interaction Flow</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saveMessage && <span style={{ color: saveMessage.includes('Failed') ? '#ef4444' : '#10b981', fontWeight: '600', fontSize: '14px' }}>{saveMessage}</span>}
          <button 
            className="btn btn-success"
            onClick={handleSave} 
            disabled={!responseValue || responseValue.startsWith('Error:') || isSaving}
          >
            {isSaving ? (
                <>
                    <div className="spinner spinner-light"></div>
                    Saving...
                </>
            ) : 'Save'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleRunFlow} 
            disabled={isLoading}
          >
            {isLoading ? (
                <>
                    <div className="spinner spinner-light"></div>
                    Generating...
                </>
            ) : '▶ Run Flow'}
          </button>
        </div>
      </header>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#e2e8f0" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;

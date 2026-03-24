import React from 'react';
import { Handle, Position } from 'reactflow';

export const PromptNode = ({ data }) => {
  return (
    <div className="node-card" style={{ width: '300px' }}>
      <label className="node-title">User Prompt</label>
      <textarea 
        className="styled-textarea"
        onChange={data.onChange} 
        value={data.value}
        placeholder="Type your instruction for the AI..."
      />
      <Handle type="source" position={Position.Right} id="a" style={{ background: '#3b82f6', width: '12px', height: '12px' }} />
    </div>
  );
};

export const ResponseNode = ({ data }) => {
  return (
    <div className="node-card" style={{ width: '380px', minHeight: '150px' }}>
      <Handle type="target" position={Position.Left} id="b" style={{ background: '#10b981', width: '12px', height: '12px' }} />
      <label className="node-title" style={{ color: '#10b981' }}>AI Response</label>
      
      {data.isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#6b7280', fontWeight: '500' }}>
          <div className="spinner"></div> Generating...
        </div>
      ) : data.isError ? (
        <div className="response-container" style={{ color: '#ef4444' }}>
          {data.value}
        </div>
      ) : (
        <div className="response-container">
          {data.value || <span style={{ color: '#9ca3af' }}>Waiting to receive response...</span>}
        </div>
      )}
    </div>
  );
};

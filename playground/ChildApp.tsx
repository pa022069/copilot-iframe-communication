import React, { useEffect, useRef, useState } from 'react';
import { CopilotService } from '../dist/index.js';

const ChildApp: React.FC = () => {
  const [fromParent, setFromParent] = useState('');
  const [input, setInput] = useState('');
  const bridgeRef = useRef<CopilotService | null>(null);

  useEffect(() => {
    bridgeRef.current = new CopilotService(window.parent, '*');
    bridgeRef.current.subscribe('parent-to-child', (data) => {
      setFromParent(data.message);
    });
  }, []);

  const sendToParent = () => {
    bridgeRef.current?.emit('child-to-parent', { message: input });
  };

  return (
    <div>
      <h1>Child (React)</h1>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Send to parent..." />
      <button onClick={sendToParent}>Send to Parent</button>
      <div style={{ marginTop: 16 }}>Received from parent: <b>{fromParent}</b></div>
    </div>
  );
};

export default ChildApp; 
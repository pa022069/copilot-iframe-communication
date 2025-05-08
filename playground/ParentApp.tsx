import React, { useRef, useState } from 'react';
import { CopilotService } from '../dist/index.js';

const ParentApp: React.FC = () => {
  const [fromChild, setFromChild] = useState('');
  const [input, setInput] = useState('');
  const bridgeRef = useRef<CopilotService | null>(null);

  React.useEffect(() => {
    const iframe = document.getElementById('childFrame') as HTMLIFrameElement;
    if (!iframe) return;
    const onLoad = () => {
      bridgeRef.current = new CopilotService(iframe.contentWindow!, '*');
      bridgeRef.current.subscribe('child-to-parent', (data) => {
        setFromChild(data.message);
      });
    };
    if (iframe.contentWindow) {
      onLoad();
    } else {
      iframe.addEventListener('load', onLoad);
    }
    return () => {
      if (iframe) iframe.removeEventListener('load', onLoad);
    };
  }, []);

  const sendToChild = () => {
    bridgeRef.current?.emit('parent-to-child', { message: input });
  };

  return (
    <div>
      <h1>Parent (React)</h1>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Send to child..." />
      <button onClick={sendToChild}>Send to Child</button>
      <div style={{ marginTop: 16 }}>Received from child: <b>{fromChild}</b></div>
    </div>
  );
};

export default ParentApp; 
import React from 'react';
import { createRoot } from 'react-dom/client';
import ParentApp from './ParentApp';

const root = createRoot(document.getElementById('root')!);
root.render(<ParentApp />); 
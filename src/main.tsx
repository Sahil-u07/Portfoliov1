import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { smoothWheel } from './hooks';
import './base.css';

smoothWheel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root is missing from index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

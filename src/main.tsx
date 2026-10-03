import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { dishUrl, satUrl } from './scene/assets';
import './styles/global.css';

// Start downloading the 3D scene code and models in parallel with the first render instead of after it.
// (Product pages use the same models in their turntables.)
if (location.pathname === '/') void import('./scene/gsScene.js');
for (const href of [dishUrl, satUrl]) {
  const l = document.createElement('link');
  Object.assign(l, { rel: 'preload', as: 'fetch', href, crossOrigin: 'anonymous' });
  document.head.appendChild(l);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

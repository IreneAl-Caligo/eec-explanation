import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'katex/dist/katex.min.css';
import './index.css';

// Register PWA Service Worker for Offline Simulation Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('⚡ EEC Virtual Lab Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('EEC Virtual Lab Service Worker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);

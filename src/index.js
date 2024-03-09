import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
//import App from './app testing';

const root = createRoot(document.getElementById('app'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import "./i18n";
import App from './App.tsx';
import './index.css';

import { AssistantProvider } from './ai-assistant/assistantStore';
import { ThemeProvider } from './ai-assistant/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AssistantProvider>
            <App />
          </AssistantProvider>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>
);
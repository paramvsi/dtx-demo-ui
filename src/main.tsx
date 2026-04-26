import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { Routes } from './app/routes';
import { Providers } from './app/providers';
import { useThemeStore } from './stores/useThemeStore';

// Apply persisted theme synchronously before first paint to avoid a flash.
const persisted = useThemeStore.getState().theme;
document.documentElement.dataset.theme = persisted;

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('No #root element found');

createRoot(rootEl).render(
  <StrictMode>
    <Providers>
      <Routes />
    </Providers>
  </StrictMode>,
);

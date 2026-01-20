import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import store from './redux/store';

console.log('=== APP INITIALIZATION STARTED ===');
console.log('Redux store:', store);

window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement, rootElement);

if (!rootElement) {
  console.error('CRITICAL ERROR: Root element #root not found in DOM');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">ERROR: Root element not found!</h1>';
  throw new Error('Root element not found');
}

try {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering App...');
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
  console.log('=== APP INITIALIZATION COMPLETE ===');
} catch (error) {
  console.error('ERROR during app initialization:', error);
  console.error('Stack:', error.stack);
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
    <h1>App Initialization Error</h1>
    <pre>${error.message}\n${error.stack}</pre>
  </div>`;
  throw error;
}


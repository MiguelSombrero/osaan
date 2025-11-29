import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';

const queryClient = new QueryClient();

async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API !== 'true') {
    return;
  }

  const { worker } = await import('./test/mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests in dev
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
});

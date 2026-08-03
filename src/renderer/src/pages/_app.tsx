import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';
import { AppLayout } from '../App';
import '../assets/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AppProvider>
    </QueryClientProvider>
  );
}

import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';
import { AppLayout } from '../App';
import '../assets/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AppProvider>
  );
}

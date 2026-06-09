import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyEReceiptsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/finance/e-receipts');
  }, [router]);

  return null;
}

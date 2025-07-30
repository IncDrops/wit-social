
import { Suspense } from 'react';
import HomeClientPage from './home-client-page';
import { SuspenseLoader } from '@/components/suspense-loader';

export default function Home() {
  return (
    <Suspense fallback={<SuspenseLoader />} >
      <HomeClientPage />
    </Suspense>
  );
}

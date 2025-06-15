'use client';

import dynamic from 'next/dynamic';

// This disables SSR for the map
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function MapWrapper() {
  return <DynamicMap />;
}

import { useState } from 'react';
import ClimateMap from '@/components/ClimateMap';
import MapTokenInput from '@/components/MapTokenInput';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  if (!mapboxToken) {
    return <MapTokenInput onTokenSubmit={setMapboxToken} />;
  }

  return <ClimateMap token={mapboxToken} />;
};

export default Index;

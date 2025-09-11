import ClimateMap from '@/components/ClimateMap';

const Index = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  return <ClimateMap token={mapboxToken} />;
};

export default Index;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, MapPin, Leaf, Droplets, Wind, Filter } from 'lucide-react';

interface ClimateProject {
  id: string;
  title: string;
  description: string;
  category: 'renewable-energy' | 'forest-conservation' | 'water-management';
  region: 'europe' | 'asia' | 'americas';
  coordinates: [number, number];
  impact: string;
}

const projects: ClimateProject[] = [
  {
    id: '1',
    title: 'Norwegian Arctic Wind Farm',
    description: 'A revolutionary offshore wind farm project generating clean energy for northern Europe while preserving Arctic marine ecosystems.',
    category: 'renewable-energy',
    region: 'europe',
    coordinates: [15.0, 78.0],
    impact: 'Reduces CO2 emissions by 2.4M tons annually'
  },
  {
    id: '2',
    title: 'Amazon Regeneration Initiative',
    description: 'Community-led forest restoration program working with indigenous communities to restore degraded rainforest areas.',
    category: 'forest-conservation',
    region: 'americas',
    coordinates: [-60.0, -3.0],
    impact: 'Restored 50,000 hectares of rainforest'
  },
  {
    id: '3',
    title: 'Mekong Smart Water System',
    description: 'AI-powered water management system optimizing irrigation and flood prevention across the Mekong River delta.',
    category: 'water-management',
    region: 'asia',
    coordinates: [105.0, 10.0],
    impact: 'Improved water access for 2.5M people'
  }
];

const categoryIcons = {
  'renewable-energy': Wind,
  'forest-conservation': Leaf,
  'water-management': Droplets
};

const categoryColors = {
  'renewable-energy': 'bg-climate-sky text-climate-ocean',
  'forest-conservation': 'bg-climate-forest text-primary-foreground',
  'water-management': 'bg-climate-ocean text-primary-foreground'
};

interface ClimateMapProps {
  token: string;
}

const ClimateMap = ({ token }: ClimateMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClimateProject | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    category: string | null;
    region: string | null;
  }>({ category: null, region: null });
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [30, 15],
      pitch: 0,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(220, 235, 240)',
        'high-color': 'rgb(180, 220, 230)',
        'horizon-blend': 0.1,
      });
    });

    // Add markers for each project
    const newMarkers: mapboxgl.Marker[] = [];
    projects.forEach((project) => {
      const IconComponent = categoryIcons[project.category];
      
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = `
        w-10 h-10 rounded-full shadow-marker cursor-pointer transform transition-all duration-300 hover:scale-110
        flex items-center justify-center ${categoryColors[project.category]}
      `;
      markerElement.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${project.category === 'renewable-energy' ? '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2m9.6-6.6L8 9.4l3.6-3.7"/>' : 
          project.category === 'forest-conservation' ? '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>' :
          '<path d="M2 10h4l3-8 3 8h4"/>'
        }
      </svg>`;

      markerElement.addEventListener('click', () => {
        setSelectedProject(project);
      });

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(project.coordinates)
        .addTo(map.current!);
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);

    return () => {
      markers.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [token]);

  // Update marker visibility based on filters
  useEffect(() => {
    markers.forEach((marker, index) => {
      const project = projects[index];
      const shouldShow = (!activeFilters.category || project.category === activeFilters.category) &&
                        (!activeFilters.region || project.region === activeFilters.region);
      
      const element = marker.getElement();
      if (shouldShow) {
        element.style.display = 'flex';
      } else {
        element.style.display = 'none';
      }
    });
  }, [activeFilters, markers]);

  const filteredProjects = projects.filter((project) => {
    if (activeFilters.category && project.category !== activeFilters.category) return false;
    if (activeFilters.region && project.region !== activeFilters.region) return false;
    return true;
  });

  const handleFilter = (type: 'category' | 'region', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  return (
    <div className="h-screen bg-background relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-sky/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-earth flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Climate Impact Map</h1>
              <p className="text-sm text-muted-foreground">Discover sustainability initiatives worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filter Button */}
      <div className="absolute top-20 left-4 z-10">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-10 px-3 bg-background/95 backdrop-blur-sm shadow-soft border border-border/50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(activeFilters.category || activeFilters.region) && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {(activeFilters.category ? 1 : 0) + (activeFilters.region ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-background/95 backdrop-blur-sm" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Category</h3>
                <div className="space-y-1">
                  {['renewable-energy', 'forest-conservation', 'water-management'].map((category) => (
                    <Button
                      key={category}
                      variant={activeFilters.category === category ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleFilter('category', category)}
                    >
                      {category === 'renewable-energy' && <Wind className="h-3 w-3 mr-2" />}
                      {category === 'forest-conservation' && <Leaf className="h-3 w-3 mr-2" />}
                      {category === 'water-management' && <Droplets className="h-3 w-3 mr-2" />}
                      {category.replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Region</h3>
                <div className="space-y-1">
                  {['europe', 'asia', 'americas'].map((region) => (
                    <Button
                      key={region}
                      variant={activeFilters.region === region ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleFilter('region', region)}
                    >
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {(activeFilters.category || activeFilters.region) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveFilters({ category: null, region: null })}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Project Popup */}
      {selectedProject && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center p-4 z-20">
          <Card className="w-full max-w-md shadow-marker">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0"
                onClick={() => setSelectedProject(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${categoryColors[selectedProject.category]}`}>
                  {React.createElement(categoryIcons[selectedProject.category], { 
                    className: "h-5 w-5" 
                  })}
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedProject.title}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedProject.region}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedProject.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {selectedProject.description}
              </CardDescription>
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-sm font-medium text-accent-foreground">
                  Impact: {selectedProject.impact}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClimateMap;
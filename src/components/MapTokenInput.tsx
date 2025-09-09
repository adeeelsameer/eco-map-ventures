import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput = ({ onTokenSubmit }: MapTokenInputProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-earth flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Climate Impact Map</CardTitle>
          <CardDescription>
            Enter your Mapbox public token to explore climate initiatives around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Get your free token at{' '}
                <a
                  href="https://mapbox.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={!token.trim()}>
              Explore Climate Map
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapTokenInput;
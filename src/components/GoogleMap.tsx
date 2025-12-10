import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const GoogleMap = ({ 
  center = { lat: 11.5564, lng: 104.9282 }, // Default: Phnom Penh, Cambodia
  zoom = 15,
  className = "w-full h-[400px]"
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Fetch API key from edge function
        const { data, error: fnError } = await supabase.functions.invoke('get-google-maps-key');
        
        if (fnError || !data?.apiKey) {
          throw new Error('Failed to load Google Maps API key');
        }

        // Check if Google Maps script is already loaded
        if (window.google?.maps) {
          initMap();
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        script.onerror = () => setError('Failed to load Google Maps');
        document.head.appendChild(script);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setLoading(false);
      }
    };

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9e7f5" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#d4ecd5" }]
          }
        ]
      });

      // Add marker for store location
      new window.google.maps.Marker({
        position: center,
        map,
        title: "Car Plus Showroom",
        animation: window.google.maps.Animation.DROP
      });

      setLoading(false);
    };

    loadGoogleMaps();
  }, [center, zoom]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-lg overflow-hidden shadow-lg`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;

// Add type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: object) => object;
        Marker: new (options: object) => object;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
      };
    };
  }
}

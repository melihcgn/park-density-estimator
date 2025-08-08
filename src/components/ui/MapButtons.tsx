'use client';

import { useMap } from 'react-leaflet';
import { Button } from './button';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const marmarisPosition: [number, number] = [36.8529, 28.2742];
const cesmePosition: [number, number] = [38.3228, 26.3052];

export default function MapButtons() {
  const map = useMap();
  const [open, setOpen] = useState(false);
  const goToLocation = (position: [number, number]) => {
    map.setView(position, 15); // Zoom level 15
  };

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        map.setView([lat, lng], 16);
      },
      () => {
        alert('Konum alınamadı.');
      }
    );
  };

  return (
    <div className="absolute top-20 right-4 z-[1000] flex flex-col items-end space-y-2">
      {/* ☰ Icon - only visible on mobile */}
      <Button
        variant="secondary" size="icon"
        className="md:hidden shadow"
        onClick={() => setOpen(!open)}
        aria-label="Konum menüsü"
      >
        <Menu size={20} />
      </Button>

      {/* Buttons - always visible on md+, toggle on small screens */}
      <div className={`flex-col space-y-2 ${open ? 'flex' : 'hidden'} md:flex`}>
        <Button onClick={goToCurrentLocation} variant="secondary">Konumum</Button>
        <Button onClick={() => goToLocation(marmarisPosition)} variant="secondary">Marmaris</Button>
        <Button onClick={() => goToLocation(cesmePosition)} variant="secondary">Çeşme</Button>
      </div>
    </div>
  );
}

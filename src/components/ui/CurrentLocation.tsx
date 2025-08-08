import { useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
const blueIcon = L.icon({
  iconUrl: '/marker-icon.png', // public klasörüne koy
  iconSize: [25, 41], // orijinali: [25, 41]
  iconAnchor: [9, 28], // popup konumu için
  popupAnchor: [0, -28],
  shadowUrl: '/marker-shadow.png', // opsiyonel, varsayılan shadow
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});


const CurrentLocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();
  const hasCentered = useRef(false); // Track if setView has already been called

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);

          if (!hasCentered.current) {
            map.setView([lat, lng], 16);
            hasCentered.current = true; // Prevent future setView calls
          }
        },
        (err) => console.error('Location error:', err),
        { enableHighAccuracy: true }
      );
    };

    updateLocation(); // Initial location fetch
    const interval = setInterval(updateLocation, 10000); // Repeat every 10s
    return () => clearInterval(interval); // Cleanup
  }, [map]);

  return position ? <Marker position={position} icon={blueIcon}><Popup>Mevcut Konumun</Popup></Marker> : null;
};
export default CurrentLocationMarker;
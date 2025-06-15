'use client';

import { useDateTime } from '@/context/DateTimeContext';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MapInfoBox from './ui/MapInfoBox';

const defaultPosition: [number, number] = [36.8529, 28.2742]; // Marmaris

function MapClickHandler() {
  useMapEvents({
    click: async (e) => {
      console.log("Map clicked:", e.latlng);
    }
  });
  return null;
}

function UserLocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setPosition(coords);
      // 🚫 DO NOT call map.setView here (keeps focus on Marmaris)
    });
  }, []);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}


export function computeDynamicScore(date: Date): DynamicScore {
  const hour = date.getHours();
  const isEvening = hour >= 18 && hour <= 22;
  return { timeScore: isEvening ? 1 : 0 };
}
type StaticScore = {
  distanceScore: number;
  barAndResScore: number;
  residentialBuildingScore: number;
};

type DynamicScore = {
  timeScore: number; // e.g., 0-1 based on hour
};

function getColor(totalScore: number): string {
  return totalScore < 1 ? 'blue' : totalScore === 1 ? 'orange' : 'red';
}

export default function Map() {
  const [roads, setRoads] = useState<any>(null);
  const [roadColors, setRoadColors] = useState<any>({});
  const { selectedDateTime } = useDateTime();

  useEffect(() => {
    fetch('/data/roads.json') // Assuming it's in /public/roads.json
      .then((res) => res.json())
      .then((data) => {
        setRoads(data);
      });
  }, []);

  const BBOX = [36.84, 28.26, 36.86, 28.28] as [number, number, number, number];

  useEffect(() => {
    const fetchStaticScores = async () => {
      const res = await fetch('/data/staticScores.json');
      const staticScores = await res.json();

      const colors = {};
      for (const feature of roads.features) {
        const name = feature?.properties?.name;
        if (!name || !staticScores[name]) continue;

        // Compute dynamic part
        const fixedDate = new Date('2025-06-15T19:00:00');

        console.log("selectedDateTime: ", selectedDateTime)
        const dynamic = computeDynamicScore(selectedDateTime ?? new Date());

        const s = staticScores[name];
        const totalScore = s.distanceScore + s.barAndResScore + s.residentialBuildingScore + dynamic.timeScore;

        const color = getColor(totalScore);
        colors[name] = color;
      }

      setRoadColors(colors);
    };

    if (roads) {
      fetchStaticScores();
    }
  }, [roads, selectedDateTime]);


  const highlightStreet = "135 Sokak";
  useEffect(() => {
    console.log("roadColors updated:", roadColors);
  }, [roadColors]);
  return (
    <div className="h-full w-full">
      <MapInfoBox />
      <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserLocationMarker />
        <Marker position={defaultPosition}>
          <Popup>Marmaris!</Popup>
        </Marker>
        {roads && (
          <GeoJSON
            key={JSON.stringify(roadColors)} // 🔥 force re-render on color change
            data={roads}
            style={(feature) => {
              const name = feature?.properties?.name;
              const color = roadColors[name] || '#888';
              return {
                color,
                weight: 3
              };
            }}
          />
        )}

        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

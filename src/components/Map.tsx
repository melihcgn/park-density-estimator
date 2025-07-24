'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { scoreRoadForParking, getColor } from '@/utils/labelParkingPossibility';
import MapInfoBox from './ui/MapInfoBox';
import { useDateTime } from '@/context/DateTimeContext';
import { FeatureCollection, LineString } from 'geojson';
import { RoadData } from '@/utils/labelParkingPossibility';
const defaultPosition: [number, number] = [36.8529, 28.2742]; // Marmaris

export default function Map() {
  const [roads, setRoads] = useState<FeatureCollection<LineString> | null>(null);
  const [roadParkingData, setRoadParkingData] = useState<Record<string, RoadData> | null>(null);
  const [roadColors, setRoadColors] = useState<Record<string, string>>({});
  const { selectedDateTime } = useDateTime();

  useEffect(() => {
    async function loadData() {
      // Load roads
      const marmarisRoads = await fetch('/data/roads.json').then(res => res.json());
      const cesmeRoads = await fetch('/data/cesme_roads.json').then(res => res.json());

      // Merge roads
      const combinedRoads = {
        ...marmarisRoads,
        features: [...marmarisRoads.features, ...cesmeRoads.features]
      };
      setRoads(combinedRoads);

      // Load parking data
      const marmarisData = await fetch('/data/staticDistances.json').then(res => res.json());

      // Merge parking data
      setRoadParkingData(marmarisData);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!roads || !roadParkingData || !selectedDateTime) return;

    const colors: Record<string, string> = {};
    for (const feature of roads.features) {
      const name = feature.properties?.name;
      if (!name || !roadParkingData[name]) continue;

      const data = roadParkingData[name];
      const score = scoreRoadForParking(data, selectedDateTime);
      const color = getColor(score);
      colors[name] = color;
    }

    setRoadColors(colors);
  }, [roads, roadParkingData, selectedDateTime]);

  return (
    <div className="h-full w-full">
      <MapInfoBox />
      <MapContainer center={defaultPosition} zoom={13} className="h-full w-full z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={defaultPosition}>
          <Popup>Marmaris!</Popup>
        </Marker>

        {roads && (
          <GeoJSON
            key={JSON.stringify(roadColors)} // triggers re-render when colors change
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
      </MapContainer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { scoreRoadForParking, getColor } from '@/utils/labelParkingPossibility';
import MapInfoBox from './ui/MapInfoBox';
import { useDateTime } from '@/context/DateTimeContext';
import { FeatureCollection, LineString } from 'geojson';
import { RoadData } from '@/utils/labelParkingPossibility';
import CurrentLocationMarker from './ui/CurrentLocation';
import L from 'leaflet';

const redIcon = L.icon({
  iconUrl: '/red_marker_50x50.png', // public klasörüne koy
  iconSize: [30, 30], // orijinali: [25, 41]
  iconAnchor: [9, 28], // popup konumu için
  popupAnchor: [0, -28],
  shadowUrl: '/marker-shadow.png', // opsiyonel, varsayılan shadow
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});
const marmarisPosition: [number, number] = [36.8529, 28.2742]; // Marmaris
const cesmePosition: [number, number] = [38.3228, 26.3052];

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
      // deneme
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
      <MapContainer center={marmarisPosition} zoom={13} className="h-full w-full z-0">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={marmarisPosition} icon={redIcon}>
          <Popup>Marmaris</Popup>
        </Marker>
        <Marker position={cesmePosition} icon={redIcon}>
          <Popup>Çeşme</Popup>
        </Marker>
        <CurrentLocationMarker />

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

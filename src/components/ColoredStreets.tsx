'use client';

import { GeoJSON } from 'react-leaflet';
import geoJsonData from '../../public/data/marmarisStreets.json';

const getColor = (prediction: string) => {
  switch (prediction) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

export default function ColoredStreets() {
  return (
    <GeoJSON
      data={geoJsonData}
      style={(feature) => {
        const prediction = feature?.properties?.prediction || 'unknown';
        return {
          color: getColor(prediction),
          weight: 5,
        };
      }}
      onEachFeature={(feature, layer) => {
        const name = feature.properties.name || 'Unnamed Street';
        const prediction = feature.properties.prediction || 'unknown';
        layer.bindPopup(`${name}: Parking chance is ${prediction}`);
      }}
    />
  );
}

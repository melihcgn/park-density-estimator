import { convertOsmToGeoJSON } from "./osmToGeojson";

// src/lib/fetchStreetGeo.ts
export async function fetchStreetGeo(name: string, bbox: [number,number,number,number]) {
  const [minLat, minLng, maxLat, maxLng] = bbox;
  const query = `
    [out:json][timeout:30];
    way["highway"]["name"="${name}"](${minLat},${minLng},${maxLat},${maxLng});
    out geom;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const osm = await res.json();
  console.log("osm: ", osm)
  return convertOsmToGeoJSON(osm); // convert manually
}

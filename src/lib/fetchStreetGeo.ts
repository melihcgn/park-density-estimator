import { convertOsmToGeoJSON } from "./osmToGeojson";
import type { FeatureCollection, LineString } from "geojson";

export async function fetchStreetGeo(
  name: string,
  bbox: [number, number, number, number]
): Promise<FeatureCollection<LineString>> {
  const [minLat, minLng, maxLat, maxLng] = bbox;
  const query = `
    [out:json][timeout:30];
    way["highway"]["name"="${name}"](${minLat},${minLng},${maxLat},${maxLng});
    out geom;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch OSM data: ${res.statusText}`);
  }

  const osm = await res.json();
  return convertOsmToGeoJSON(osm);
}

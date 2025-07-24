import type { Feature, FeatureCollection, LineString } from "geojson";

interface OverpassNode {
  lat: number;
  lon: number;
}

interface OverpassElement {
  type: "way";
  tags: { name: string };
  geometry: OverpassNode[];
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export function convertOsmToGeoJSON(osm: OverpassResponse): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = osm.elements
    .filter((el) => el.type === "way" && el.geometry)
    .map((el) => ({
      type: "Feature",
      properties: { name: el.tags.name },
      geometry: {
        type: "LineString",
        coordinates: el.geometry.map((node) => [node.lon, node.lat]),
      },
    }));

  return { type: "FeatureCollection", features };
}

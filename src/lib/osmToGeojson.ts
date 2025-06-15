// src/lib/osmToGeojson.ts
export function convertOsmToGeoJSON(osm: any) {
  const features = osm.elements
    .filter((el: any) => el.type === "way" && el.geometry)
    .map((el: any) => ({
      type: "Feature",
      properties: { name: el.tags.name },
      geometry: {
        type: "LineString",
        coordinates: el.geometry.map((node: any) => [node.lon, node.lat]),
      },
    }));
  return { type: "FeatureCollection", features };
}

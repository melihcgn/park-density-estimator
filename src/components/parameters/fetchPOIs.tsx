import * as turf from '@turf/turf';
import type { Feature, Geometry, LineString  } from 'geojson';

interface OverpassElement {
    id: number;
    lat: number;
    lon: number;
    tags?: Record<string, string>;
}


async function fetchPOIs(bbox: [number, number, number, number], key: string, value: string) {
    const [south, west, north, east] = bbox;
    const query = `
    [out:json][timeout:25];
    node["${key}"="${value}"](${south},${west},${north},${east});
    out;
  `;
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const { elements }: { elements: OverpassElement[] } = await res.json();
    console.log("elementss: ", elements)
    return elements.map(e => turf.point([e.lon, e.lat]));
}

export async function computeStaticScore(feature: Feature<LineString>, bbox: [number, number, number, number]) {
    const distance = getDistanceToCenter(feature);
    const bars = await fetchPOIs(bbox, 'amenity', 'bar');
    const restaurants = await fetchPOIs(bbox, 'amenity', 'restaurant');
    const buildings = await fetchPOIs(bbox, 'building', '*');

    const center = turf.center(feature);

    const barCount = bars.filter(b => turf.distance(center, b, { units: 'meters' }) < 100).length;
    const resCount = restaurants.filter(r => turf.distance(center, r, { units: 'meters' }) < 100).length;
    const resBuildings = buildings.filter(b => turf.distance(center, b, { units: 'meters' }) < 50).length;

    return {
        distanceScore: (distance < 500 ? 1 : 0),
        barAndResScore: (barCount + resCount >= 2 ? 1 : 0),
        residentialBuildingScore: (resBuildings > 4 ? 1 : 0)
    };
}



const marmarisCenter = turf.point([28.2742, 36.8529]); // lon, lat

export function getDistanceToCenter(feature: Feature<Geometry>): number {
    const centroid = turf.centroid(feature);
    return turf.distance(centroid, marmarisCenter, { units: 'meters' });
}

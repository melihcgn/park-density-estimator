import * as turf from '@turf/turf';

function getDistanceToCenter(feature, citycenter) {
  const centroid = turf.centroid(feature);
  return turf.distance(centroid, citycenter, { units: 'meters' });
}

async function fetchPOIs(bbox, key, value) {
  const [south, west, north, east] = bbox;
  const query = `
    [out:json][timeout:25];
    node["${key}"="${value}"](${south},${west},${north},${east});
    out;
  `;
  const res = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  );
  const { elements } = await res.json();
  return elements.map((e) => turf.point([e.lon, e.lat]));
}

export async function computeStaticScore(feature, bbox, citycenter) {
  const distance = getDistanceToCenter(feature, citycenter );
  const bars = await fetchPOIs(bbox, 'amenity', 'bar');
  const restaurants = await fetchPOIs(bbox, 'amenity', 'restaurant');
  const buildings = await fetchPOIs(bbox, 'building', '*');

  const center = turf.center(feature);

  const barCount = bars.filter(
    (b) => turf.distance(center, b, { units: 'meters' }) < 100
  ).length;

  const resCount = restaurants.filter(
    (r) => turf.distance(center, r, { units: 'meters' }) < 100
  ).length;

  const resBuildings = buildings.filter(
    (b) => turf.distance(center, b, { units: 'meters' }) < 50
  ).length;

  return {
    distanceScore: distance < 500 ? 1 : 0,
    barAndResScore: barCount + resCount >= 2 ? 1 : 0,
    residentialBuildingScore: resBuildings > 4 ? 1 : 0
  };
}

import * as turf from '@turf/turf';

const marmarisCenter = turf.point([28.2742, 36.8529]);

let cachedPOIs = null;
let cachedBBOX = null;
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

async function fetchPOIsBuildings(bbox) {
  const [south, west, north, east] = bbox;
  const query = `
    [out:json][timeout:25];
    way["building"](${south},${west},${north},${east});
    out center;
  `;
  const res = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  );
  const { elements } = await res.json();

  // Filter elements that have center property and map to turf points
  return elements
    .filter(e => e.center && e.center.lat && e.center.lon)
    .map(e => turf.point([e.center.lon, e.center.lat]));
}


function getRoadCenter(feature) {
  const line = turf.lineString(feature.geometry.coordinates);
  const length = turf.length(line, { units: 'kilometers' });
  return turf.along(line, length / 2, { units: 'kilometers' });
}

function countNearby(center, pois, radius) {
  return pois.filter(poi =>
    turf.distance(center, poi, { units: 'meters' }) < radius
  ).length;
}

function countNearbyToLine(roadLine, pois, radius) {
  return pois.filter(poi =>
    turf.pointToLineDistance(poi, roadLine, { units: 'meters' }) < radius
  ).length;
}

export async function computeStaticDistance(feature, bbox) {
if (!cachedBBOX || JSON.stringify(bbox) !== JSON.stringify(cachedBBOX)) {
    cachedPOIs = null;
    cachedBBOX = bbox;
    console.log("cachedBBOX: ", cachedBBOX)
  }
  if (!cachedPOIs) {
    const bars = await fetchPOIs(bbox, 'amenity', 'bar');
    const restaurants = await fetchPOIs(bbox, 'amenity', 'restaurant');
    const buildings = await fetchPOIsBuildings(bbox);
    const attractions = await fetchPOIs(bbox, 'tourism', 'attraction');
    console.log("selam bars: ", bars)
    cachedPOIs = { bars, restaurants, buildings, attractions };
  }
  const { bars, restaurants, buildings, attractions } = cachedPOIs;

  const center = getRoadCenter(feature);
  let distanceToCenter = turf.distance(center, marmarisCenter, { units: 'meters' });

  const roadLine = turf.lineString(feature.geometry.coordinates);
  const roadLength = turf.length(roadLine, { units: 'kilometers' }) * 1000;

  const numBars = countNearbyToLine(roadLine, bars, 100);
  const numRestaurants = countNearbyToLine(roadLine, restaurants, 100);
  const numBuildings = countNearbyToLine(roadLine, buildings, 100);
  const nearAttraction = countNearbyToLine(roadLine, attractions, 150) > 0;

  return {
    roadId: feature.id || feature.properties['@id'] || '',
    name: feature.properties.name || '',
    roadType: feature.properties.highway || '',
    centerLat: center.geometry.coordinates[1],
    centerLon: center.geometry.coordinates[0],
    length_m: roadLength,
    distanceToMarmarisCenter_m: distanceToCenter,
    numBars_100m: numBars,
    numRestaurants_100m: numRestaurants,
    numBuildings_100m: numBuildings,
    nearAttraction
  };
}

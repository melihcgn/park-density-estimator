import fs from 'fs/promises';

const geoRaw = await fs.readFile('./public/data/cesme_geometry.json', 'utf8');
const geoData = JSON.parse(geoRaw);

if (geoData.type === 'GeometryCollection') {
  const featureCollection = {
    type: 'FeatureCollection',
    features: geoData.geometries.map(geometry => ({
      type: 'Feature',
      geometry,
      properties: {} // Optional: add properties if needed
    }))
  };

  await fs.writeFile('./public/data/cesme_roads.json', JSON.stringify(featureCollection, null, 2), 'utf8');
  console.log('✅ Converted GeometryCollection to FeatureCollection and saved as cesme_roads.json');
} else {
  console.log('❌ Provided GeoJSON is not a GeometryCollection.');
}

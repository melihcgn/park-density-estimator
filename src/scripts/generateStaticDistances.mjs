import fs from 'fs/promises';
import { computeStaticDistance } from '../utils/computeStaticDistance.js';
const roadsRaw = await fs.readFile('./public/data/roads.json', 'utf8');
const roads = JSON.parse(roadsRaw);

const BBOX = [36.84, 28.26, 36.86, 28.28];

const run = async () => {
  const staticDistances = {};
  const total = roads.features.length;
let index = 0;
  for (const feature of roads.features) {
    index++;
    const name = feature?.properties?.name;
    if (!name) continue;
    console.log(`🔄 Processing ${index} of ${total}: ${name}`);
    const distanceParts = await computeStaticDistance(feature, BBOX);
    staticDistances[name] = distanceParts;
  }

  await fs.writeFile(
    './public/data/staticDistances.json',
    JSON.stringify(staticDistances, null, 2),
    'utf8'
  );

  console.log('✅ Static Distances saved to /public/data/staticDistances.json');
};

run();

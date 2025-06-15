import fs from 'fs/promises';
import { computeStaticScore } from '../utils/computeStaticScore.js'; // ✅ update the path and extension

const roadsRaw = await fs.readFile('./public/data/roads.json', 'utf8');
const roads = JSON.parse(roadsRaw);

const BBOX = [36.84, 28.26, 36.86, 28.28];

const run = async () => {
  const staticScores = {};
  const total = roads.features.length;
let index = 0;
  for (const feature of roads.features) {
    index++;
    const name = feature?.properties?.name;
    if (!name) continue;
    console.log(`🔄 Processing ${index} of ${total}: ${name}`);
    const scoreParts = await computeStaticScore(feature, BBOX);
    staticScores[name] = scoreParts;
  }

  await fs.writeFile(
    './public/data/staticScores.json',
    JSON.stringify(staticScores, null, 2),
    'utf8'
  );

  console.log('✅ Static scores saved to /public/data/staticScores.json');
};

run();

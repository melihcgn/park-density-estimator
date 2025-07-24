import fs from 'fs/promises';
import { computeStaticScore } from '../utils/computeStaticScore.js'; // ✅ update the path and extension
import * as turf from '@turf/turf';

const roadsRaw = await fs.readFile('./public/data/roads.json', 'utf8');
const cesme_roadsRaw= await fs.readFile('./public/data/cesme_roads.json', 'utf8');
const marmarisRoads = JSON.parse(roadsRaw);
const cesmeRoads = JSON.parse(cesme_roadsRaw);

const marmaris_BBOX = [28.2320, 36.8290, 28.3160, 36.8750]; // lon/lat based on actual map view
const marmarisCenter = turf.point([28.2742, 36.8529]); // ✔️ Already good

const cesme_BBOX = [26.2660, 38.2840, 26.3560, 38.3500]; // ✔️ Correct order
const cesmeCenter = turf.point([26.3052, 38.3221]); // ✔️ Already good

const run = async () => {
  const staticScores = {};
  const total = marmarisRoads.features.length;
let index = 0;
  for (const feature of marmarisRoads.features) {
    index++;
    const name = feature?.properties?.name;
    if (!name) continue;
    console.log(`🔄 Processing ${index} of ${total}: ${name}`);
    const scoreParts = await computeStaticScore(feature, marmaris_BBOX, marmarisCenter);
    staticScores[name] = scoreParts;
  }
  for (const feature of cesmeRoads.features) {
    index++;
    const name = feature?.properties?.name;
    if (!name) continue;
    console.log(`🔄 Processing ${index} of ${total}: ${name}`);
    const cesme_scoreParts = await computeStaticScore(feature, cesme_BBOX, cesmeCenter);
    staticScores[name] = cesme_scoreParts;
  }
  await fs.writeFile(
    './public/data/staticScores.json',
    JSON.stringify(staticScores, null, 2),
    'utf8'
  );

  console.log('✅ Static scores saved to /public/data/staticScores.json');
};

run();

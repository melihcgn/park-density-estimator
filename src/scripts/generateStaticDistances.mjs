import fs from 'fs/promises';
import { computeStaticDistance } from '../utils/computeStaticDistance.js';
import * as turf from '@turf/turf';

const roadsRaw = await fs.readFile('./public/data/roads.json', 'utf8');
const cesme_roadsRaw = await fs.readFile('./public/data/cesme_roads.json', 'utf8');
const marmarisRoads = JSON.parse(roadsRaw);
const cesmeRoads = JSON.parse(cesme_roadsRaw);

const marmaris_BBOX = [36.84, 28.26, 36.86, 28.28]; // lon/lat based on actual map view
const marmarisCenter = turf.point([28.2742, 36.8529]); // ✔️ Already good

const cesme_BBOX = [38.2510052, 26.2590011, 38.3389604, 26.4219884];; // ✔️ Correct order
const cesmeCenter = turf.point([26.3052, 38.3221]); // ✔️ Already good
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
  const staticDistances = {};
  const total = marmarisRoads.features.length;
  let index = 0;
  for (const feature of marmarisRoads.features) {
    index++;
    const name = feature?.properties?.name;
    if (!name) continue;
    //console.log(`🔄 Processing ${index} of ${total}: ${name} in marmaris`);
    const distanceParts = await computeStaticDistance(feature, marmaris_BBOX, marmarisCenter);
    staticDistances[name] = distanceParts;
  }
  //console.log('⏳ Waiting before processing Çeşme...');
await sleep(15000); // wait 2 seconds to reduce risk of Overpass blocking
  const cesme_total = cesmeRoads.features.length;
  //console.log("cesmeRoads: ", cesme_total)

  let idx = 0;
  for (const feature of cesmeRoads.features) {
    idx++;
    const name = feature?.properties?.name;
    if (!name) continue;
    //console.log(`🔄 Processing ${idx} of ${cesme_total}: ${name} in cesme`);
    const distanceParts = await computeStaticDistance(feature, cesme_BBOX, cesmeCenter);
    staticDistances[name] = distanceParts;
  }

  await fs.writeFile(
    './public/data/staticDistances.json',
    JSON.stringify(staticDistances, null, 2),
    'utf8'
  );

  //console.log('✅ Static Distances saved to /public/data/staticDistances.json');
};

run();

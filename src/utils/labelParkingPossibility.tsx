export type RoadData = {
  roadId: string;
  name: string;
  roadType: string;
  centerLat: number;
  centerLon: number;
  length_m: number;
  distanceToMarmarisCenter_m: number;
  numBars_100m: number;
  numRestaurants_100m: number;
  numBuildings_100m: number;
  nearAttraction: boolean;
};

export function scoreRoadForParking(data: RoadData, selectedDateTime: Date) {
  let score = 0;

  // --- Static features ---
  score -= Math.min(data.length_m / 200, 10); // long roads are better
  // Distance to center skipped for now

  // Buildings = competition
  score += Math.min(data.numBuildings_100m / 5, 10);

  // Attractions help
  if (data.nearAttraction) score += 5;

  // Bars/restaurants help (especially for night parking)
  const totalCommercial = data.numBars_100m + data.numRestaurants_100m;
  score += Math.min(totalCommercial, 5);

  // --- Dynamic features ---
  const hour = selectedDateTime.getHours();
  const day = selectedDateTime.getDay();
  const isWeekend = (day === 0 || day === 6);
  const isNight = hour >= 20 || hour <= 5;
  const isEvening = hour >= 18 && hour < 20;

  // Weekend and evening penalty (more competition)
  if (isWeekend) score += 2;
  if (isWeekend && isNight) score += 2;
  else if (isEvening) score += 1;

  // Residential penalty
  if (data.numBuildings_100m > 30 && totalCommercial === 0) {
    score += 3;
    if (isNight || isEvening) score += 2;
  }

  // Commercial mix bonus
  if (totalCommercial > 0 && data.numBuildings_100m > 10) {
    if (isNight) score += 2;
  }

  // Clamp score
  score = Math.max(Math.min(score, 20), 0);
  console.log("score of ",data.name, ": ", score ,", nbdngs, nbars, nres", data.numBuildings_100m, " ", data.numBars_100m, " ",data.numRestaurants_100m)
  return Math.round(score * 10) / 10;
}

export function getColor(totalScore: number) {
  if (totalScore >= 12) return 'red';        // Very difficult to find parking
  if (totalScore >= 5) return 'orange';      // Moderate
  return 'blue';                             // Easier to find parking
}


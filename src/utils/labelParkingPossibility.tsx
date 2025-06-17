export function scoreRoadForParking(data, selectedDateTime: Date) {
  let score = 0;

  // Base static features
  score += Math.min(data.length_m / 100, 10);
  score += Math.max(0, 10 - data.distanceToMarmarisCenter_m / 200);
  score -= Math.min(data.numBuildings_100m / 20, 10);
  if (data.nearAttraction) score += 5;
  score += Math.min(data.numBars_100m + data.numRestaurants_100m, 5);

  // --- New: Dynamic time-based adjustments ---
  const hour = selectedDateTime.getHours();
  const day = selectedDateTime.getDay(); // 0 (Sunday) to 6 (Saturday)
  const isWeekend = (day === 0 || day === 6);
  const isNight = hour >= 20 || hour <= 5;
  const isEvening = hour >= 18 && hour < 20;

  // Penalty for likely crowding
  if (isWeekend) score -= 2;
  if (isWeekend && isNight) score -= 2; // More demand & competition
  else if (isEvening) score -= 1;

  return Math.round(score * 10) / 10;
}

function labelParkingPossibility(score) {
  if (score >= 15) return 'High Parking Potential';
  if (score >= 8) return 'Medium Parking Potential';
  return 'Low Parking Potential';
}

export function getColor(totalScore) {
  if (totalScore >= 15) return 'red';
  if (totalScore >= 8) return 'orange';
  return 'blue';
}

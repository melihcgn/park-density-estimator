export async function getRegionMeta(city: string) {
  const res = await fetch(`/api/get-region-info?city=${city}`);
  if (!res.ok) throw new Error("Could not load region info");
  return res.json();
}

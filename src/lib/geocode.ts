export async function reverseGeocode(lat: number, lon: number) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("Geocoding failed");
  return res.json();
}

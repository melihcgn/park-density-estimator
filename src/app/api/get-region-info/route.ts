import { NextResponse } from 'next/server';
import regionMeta from '@/../public/data/regionMeta.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.toLowerCase().trim();

  if (!city) {
    return NextResponse.json({ error: 'No city provided' }, { status: 400 });
  }

  const matched = Object.entries(regionMeta).find(([key]) =>
    key.toLowerCase().trim() === city
  );

  const result = matched
    ? matched[1]
    : { isTouristic: false, isCrowded: false, defaultParkingChance: "unknown" };

  return NextResponse.json(result);
}

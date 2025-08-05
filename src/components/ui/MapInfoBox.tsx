'use client';

import { useDateTime } from "@/context/DateTimeContext";

export default function MapInfoBox() {
  const { selectedDateTime } = useDateTime();

  const displayText = selectedDateTime
    ? `Park verisi şu tarih için gösteriliyor: ${selectedDateTime.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`
    : 'Gerçek zamanlı park verisi gösteriliyor';

  return (
    <div className="absolute top-14 right-4 bg-white/90 dark:bg-zinc-900/90 text-sm text-black dark:text-white px-4 py-2 rounded shadow-lg z-[50]">
      {displayText}
    </div>
  );
}

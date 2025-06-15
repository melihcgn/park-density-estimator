"use client"

import React from "react";
import Map from "@/components/Map";
import { DatePicker } from "./ui/datepicker";

export default function DatePickerWrapper() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  // Here you can call your backend API whenever selectedDate changes

  return (
    <div className="flex flex-row">
      <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
      <div>
        {selectedDate ? (
          <p>Seçilen Tarih: {selectedDate.toLocaleDateString()}</p>
        ) : (
          <p>Lütfen tarih seçiniz</p>
        )}
      </div>
    </div>
  );
}

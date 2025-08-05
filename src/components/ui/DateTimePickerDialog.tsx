"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./datepicker";
import { useDateTime } from "@/context/DateTimeContext";
import { Calendar } from 'lucide-react'; 

export function DateTimePickerDialog() {
  const { selectedDateTime, setSelectedDateTime } = useDateTime();

const [open, setOpen] = React.useState(false);
const [selectedDate, setSelectedDate] = React.useState<Date>(selectedDateTime ?? new Date());
const [selectedHour, setSelectedHour] = React.useState<number>(
  selectedDateTime ? selectedDateTime.getHours() : new Date().getHours()
);

const handleApply = () => {
  const dateWithHour = new Date(selectedDate);
  dateWithHour.setHours(selectedHour, 0, 0, 0);
  console.log("dateWithHour: ", dateWithHour)
  setSelectedDateTime(dateWithHour); // Use context to update
  setOpen(false);
};

const handleReset = () => {
  setSelectedDateTime(null); // Back to real-time mode
  setOpen(false);
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex">
          {/* Shown on md and larger screens */}
          <Button variant="outline" className="hidden md:inline-flex">
            Tarihli Park Verisini Seç
          </Button>

          {/* Shown only on smaller screens */}
          <Button variant="outline" className="md:hidden">
            <Calendar />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="overflow-hidden">Park Edilecek Tarihi ve Saati Seç</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />

          <div className="flex flex-col gap-2">
            <Label>Park edilecek saat</Label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="border bg-background shadow-xs border rounded px-2 py-1"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button onClick={handleApply}>Göster</Button>
          <Button variant="secondary" onClick={handleReset}>
            Şu Anı Göster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

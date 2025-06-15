"use client";

import React, { createContext, useContext, useState } from "react";

type DateTimeContextType = {
  selectedDateTime: Date | null;
  setSelectedDateTime: (date: Date | null) => void;
};

const DateTimeContext = createContext<DateTimeContextType | undefined>(undefined);

export const DateTimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <DateTimeContext.Provider value={{ selectedDateTime, setSelectedDateTime }}>
      {children}
    </DateTimeContext.Provider>
  );
};

export const useDateTime = () => {
  const context = useContext(DateTimeContext);
  if (!context) throw new Error("useDateTime must be used within DateTimeProvider");
  return context;
};

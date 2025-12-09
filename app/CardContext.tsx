"use client";
import { createContext, useContext, useState } from "react";

export type CardData = {
  selectedImage: string | null;
  selectedHolidayId: number;
  customHolidayText: string;
  toName: string;
  fromName: string;
};

const defaultValue: CardData = {
  selectedImage: null,
  selectedHolidayId: 1,
  customHolidayText: "",
  toName: "",
  fromName: "",
};

export const CardContext = createContext<{
  data: CardData;
  setData: (data: CardData) => void;
} | null>(null);

export function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within CardProvider");
  return ctx;
}

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CardData>(defaultValue);
  return (
    <CardContext.Provider value={{ data, setData }}>
      {children}
    </CardContext.Provider>
  );
}

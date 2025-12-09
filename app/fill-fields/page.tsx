"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { holidays, CUSTOM_HOLIDAY_ID } from "@/app/data";
import { MAX_HOLIDAY_LENGTH, MAX_NAME_LENGTH } from "@/app/constants";
import { HolidaySelect } from "@/app/_components/HolidaySelect";
import { LimitHint } from "@/app/_components/LimitHint";
import { NameInput } from "@/app/_components/NameInput";
import { NextButton } from "@/app/_components/NextButton";
import { StepLayout } from "@/app/_components/StepLayout";
import { useRouter } from "next/navigation";
import { useCard } from "@/app/CardContext";

export default function FillFields() {
  const router = useRouter();
  const { data, setData } = useCard();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!data.selectedImage) {
      router.replace("/select-card");
    }
  }, [data.selectedImage, router]);

  const handleHolidayChange = (id: number) => {
    setData({ ...data, selectedHolidayId: id });
  };

  return (
    <StepLayout
      title={
        <>
          Заполните поля
          <br />и адресата
        </>
      }
    >
      <div className="w-full aspect-square border-2 border-white rounded-lg overflow-hidden relative bg-black/20">
        {data.selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <Image
              src={data.selectedImage}
              width={400}
              height={400}
              className="w-full h-full object-cover"
              alt="selected"
              onLoadingComplete={() => setLoaded(true)}
            />
          </motion.div>
        )}
      </div>
      <div className="w-full flex flex-col gap-4">
        <HolidaySelect
          value={data.selectedHolidayId}
          options={holidays}
          onChange={handleHolidayChange}
        />
        {data.selectedHolidayId === CUSTOM_HOLIDAY_ID && (
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Введите название праздника"
              value={data.customHolidayText}
              onChange={(e) =>
                setData({ ...data, customHolidayText: e.target.value })
              }
              maxLength={MAX_HOLIDAY_LENGTH}
              className="font-open-sans-condensed w-full h-12 px-4 rounded border border-white text-white text-2xl placeholder-white/50"
            />
            <LimitHint
              show={data.customHolidayText.length >= MAX_HOLIDAY_LENGTH}
              max={MAX_HOLIDAY_LENGTH}
            />
          </div>
        )}
        <div className="w-full relative">
          <NameInput
            placeholder="Имя получателя (необязательно)"
            value={data.toName}
            maxLength={MAX_NAME_LENGTH}
            onChange={(v) => setData({ ...data, toName: v })}
          />
          <LimitHint
            show={data.toName.length >= MAX_NAME_LENGTH}
            max={MAX_NAME_LENGTH}
          />
        </div>
        <div className="w-full relative">
          <NameInput
            placeholder="Имя отправителя (необязательно)"
            value={data.fromName}
            maxLength={MAX_NAME_LENGTH}
            onChange={(v) => setData({ ...data, fromName: v })}
          />
          <LimitHint
            show={data.fromName.length >= MAX_NAME_LENGTH}
            max={MAX_NAME_LENGTH}
          />
        </div>
      </div>
      <NextButton onClick={() => router.push("/send")}>Дальше</NextButton>
    </StepLayout>
  );
}

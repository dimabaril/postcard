"use client";

import { useState } from "react";
import Image from "next/image";
import { holidays, images } from "./data";
import { MAX_HOLIDAY_LENGTH, MAX_NAME_LENGTH } from "./constants";
import { CardPreview } from "./components/CardPreview";
import { HolidaySelect } from "./components/HolidaySelect";
import { ImagePicker } from "./components/ImagePicker";
import { LimitHint } from "./components/LimitHint";
import { NameInput } from "./components/NameInput";
import { NextButton } from "./components/NextButton";
import { ShareButton } from "./components/ShareButton";
import { StepLayout } from "./components/StepLayout";

export default function Home() {
  // --- State ---
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedHolidayId, setSelectedHolidayId] = useState<number>(
    holidays[0].id,
  );
  const [customHolidayText, setCustomHolidayText] = useState("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Logic ---
  const handleHolidayChange = (id: number) => {
    setSelectedHolidayId(id);
  };

  const getFinalHolidayText = () => {
    if (selectedHolidayId === 100) return customHolidayText;
    const holiday = holidays.find((h) => h.id === selectedHolidayId);
    return holiday ? holiday.label : "";
  };

  // Функция скачивания/шаринга с использованием серверной генерации
  const handleShare = async () => {
    if (!selectedImage) {
      alert("Выберите картинку перед отправкой");
      return;
    }

    const finalHoliday = getFinalHolidayText();
    if (!finalHoliday) {
      alert("Введите текст поздравления");
      return;
    }

    setIsGenerating(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      // Формируем параметры для API
      const params = new URLSearchParams();
      params.set("imageUrl", selectedImage);
      if (toName) params.set("toName", toName);
      if (fromName) params.set("fromName", fromName);
      if (finalHoliday) params.set("holidayText", finalHoliday);

      // Получаем сгенерированное изображение с сервера
      const response = await fetch(`/api/generate-card?${params}`, {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API ${response.status}: ${errorText || response.statusText}`,
        );
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Пустой ответ от сервера");
      }

      const timestamp = Date.now();
      const file = new File([blob], `postcard_${timestamp}.jpg`, {
        type: "image/jpeg",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Поздравление",
          text: "Вам открытка!",
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = `postcard_${timestamp}.jpg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("Ошибка при генерации или отправке открытки:", err);
      if (err instanceof DOMException && err.name === "AbortError") {
        alert(
          "Запрос создания открытки отменен по таймауту. Попробуйте снова.",
        );
        return;
      }

      const message =
        err instanceof Error && err.message
          ? err.message
          : "Не удалось создать открытку. Попробуйте еще раз.";
      alert(message);
    } finally {
      clearTimeout(timeout);
      setIsGenerating(false);
    }
  };

  // --- Renders ---

  // Шаг 1: Выбор картинки
  const renderStep1 = () => (
    <StepLayout
      title={
        <>
          Выберите картинку
          <br />
          для открытки
        </>
      }
    >
      <ImagePicker
        images={images}
        selected={selectedImage}
        onSelect={setSelectedImage}
      />
      <NextButton disabled={!selectedImage} onClick={() => setStep(2)}>
        Дальше
      </NextButton>
    </StepLayout>
  );

  // Шаг 2: Ввод данных
  const renderStep2 = () => (
    <StepLayout
      title={
        <>
          Добавьте поздравление
          <br />и адресата
        </>
      }
    >
      <div className="w-full aspect-square border-4 border-white rounded-lg overflow-hidden relative bg-black/20">
        {selectedImage && (
          <Image
            src={selectedImage}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            alt="selected"
          />
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        <HolidaySelect
          value={selectedHolidayId}
          options={holidays}
          onChange={handleHolidayChange}
        />

        {selectedHolidayId === 100 && (
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Введите название праздника"
              value={customHolidayText}
              onChange={(e) => setCustomHolidayText(e.target.value)}
              maxLength={MAX_HOLIDAY_LENGTH}
              className="font-open-sans-condensed w-full h-12 px-4 rounded border border-white text-white text-2xl placeholder-white/50"
            />
            <LimitHint
              show={customHolidayText.length >= MAX_HOLIDAY_LENGTH}
              max={MAX_HOLIDAY_LENGTH}
            />
          </div>
        )}

        <div className="w-full relative">
          <NameInput
            placeholder="Имя получателя (необязательно)"
            value={toName}
            maxLength={MAX_NAME_LENGTH}
            onChange={setToName}
          />
          <LimitHint
            show={toName.length >= MAX_NAME_LENGTH}
            max={MAX_NAME_LENGTH}
          />
        </div>

        <div className="w-full relative">
          <NameInput
            placeholder="Имя отправителя (необязательно)"
            value={fromName}
            maxLength={MAX_NAME_LENGTH}
            onChange={setFromName}
          />
          <LimitHint
            show={fromName.length >= MAX_NAME_LENGTH}
            max={MAX_NAME_LENGTH}
          />
        </div>
      </div>

      <NextButton onClick={() => setStep(3)}>Дальше</NextButton>
    </StepLayout>
  );

  // Шаг 3: Просмотр и Отправка
  const renderStep3 = () => (
    <StepLayout
      title={
        <>
          Отправьте <br /> поздравление
        </>
      }
    >
      <CardPreview
        imageUrl={selectedImage}
        toName={toName}
        fromName={fromName}
        holidayText={getFinalHolidayText()}
      />

      <ShareButton
        onClick={handleShare}
        disabled={isGenerating || !selectedImage || !getFinalHolidayText()}
        loading={isGenerating}
      />
    </StepLayout>
  );

  return (
    // <main className="min-h-dvh flex flex-col bg-[#22386F] px-9 py-12">
    <main className="min-h-dvh bg-[#22386F] px-6 py-6">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </main>
  );
}

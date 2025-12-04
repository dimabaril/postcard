"use client";

import { useState } from "react";
import Image from "next/image";
import { holidays, images } from "./data";
// Icons
// import { Download, Send } from "lucide-react";

console.log("navigator.share:", !!navigator.share);
console.log(
  "navigator.canShare available:",
  typeof navigator.canShare === "function",
);

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

  const MAX_HOLIDAY_LENGTH = 40;
  const MAX_NAME_LENGTH = 40;

  // --- Logic ---
  const handleHolidayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHolidayId(Number(e.target.value));
  };

  const getFinalHolidayText = () => {
    if (selectedHolidayId === 100) return customHolidayText;
    const holiday = holidays.find((h) => h.id === selectedHolidayId);
    return holiday ? holiday.label : "";
  };

  // Функция скачивания/шаринга
  const handleShare = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);

    try {
      // Формируем URL для нашего API-генератора
      const params = new URLSearchParams();
      params.set("imageUrl", selectedImage);
      params.set("holidayText", getFinalHolidayText());
      if (toName) params.set("toName", toName);
      if (fromName) params.set("fromName", fromName);

      const cardUrl = `/api/generate-card?${params.toString()}`;

      // Получаем сгенерированную картинку с сервера
      const response = await fetch(cardUrl);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }

      const blob = await response.blob();
      const timestamp = Date.now();
      const file = new File([blob], `postcard_${timestamp}.jpg`, {
        type: "image/jpeg",
      });

      console.log(
        "navigator.canShare imjage file:",
        navigator.canShare && navigator.canShare({ files: [file] }),
      );

      // Пытаемся поделиться через Web Share API
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Поздравление",
          text: "Вам открытка!",
          files: [file],
        });
      } else {
        // Фоллбэк для десктопа или если шаринг не удался - просто скачивание
        const link = document.createElement("a");
        link.download = `postcard_${timestamp}.jpg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href); // Очищаем память
      }
    } catch (err) {
      console.error("Ошибка при генерации или отправке открытки:", err);
      alert("Не удалось создать открытку. Попробуйте еще раз.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Renders ---

  // Шаг 1: Выбор картинки
  const renderStep1 = () => (
    <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
      <h1 className="font-miroslav text-4xl text-center text-[#7FAECC]">
        Выберите картинку
        <br />
        для открытки
      </h1>
      {/* <div className="grid grid-cols-3 gap-6"> */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img.main)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all relative ${
              selectedImage === img.main
                ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "border-transparent"
            }`}
            // style={{ width: "100px", height: "100px" }}
          >
            <Image
              src={img.preview}
              alt="choice"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      <button
        disabled={!selectedImage}
        onClick={() => setStep(2)}
        className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Дальше
      </button>
    </div>
  );

  // Шаг 2: Ввод данных
  const renderStep2 = () => (
    <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
      <h1 className="font-miroslav text-4xl text-center text-[#7FAECC]">
        Добавьте поздравление
        <br />и адресата
      </h1>

      {/* Превью выбранной картинки (маленькое) */}
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

      {/* Форма */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center rounded border border-white relative">
          <select
            value={selectedHolidayId}
            onChange={handleHolidayChange}
            className="font-stretch-extra-condensed w-full h-12 pl-4 pr-11 bg-transparent text-white text-2xl focus:outline-none appearance-none cursor-pointer"
          >
            {holidays.map((holiday) => (
              <option key={holiday.id} value={holiday.id}>
                {holiday.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 w-5 h-5 text-white pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {selectedHolidayId === 100 && (
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Введите название праздника"
              value={customHolidayText}
              onChange={(e) => setCustomHolidayText(e.target.value)}
              maxLength={MAX_HOLIDAY_LENGTH}
              className="font-stretch-extra-condensed w-full h-12 px-4 rounded border border-white text-white text-2xl placeholder-white/50"
            />

            {customHolidayText.length >= MAX_HOLIDAY_LENGTH && (
              <div className="absolute left bottom text-xs text-white/50">
                Достигнут лимит символов
                {MAX_HOLIDAY_LENGTH}
              </div>
            )}
          </div>
        )}

        <div className="w-full relative">
          <input
            type="text"
            placeholder="Имя получателя (необязательно)"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            className="font-stretch-extra-condensed w-full h-12 px-4 rounded bg-[#7FAECC] border-none text-white text-2xl placeholder-white/60"
          />

          {toName.length >= MAX_NAME_LENGTH && (
            <div className="absolute left bottom text-xs text-white/50">
              Достигнут лимит символов
              {MAX_NAME_LENGTH}
            </div>
          )}
        </div>

        <div className="w-full relative">
          <input
            type="text"
            placeholder="Имя отправителя (необязательно)"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            className="font-stretch-extra-condensed w-full h-12 px-4 rounded bg-[#7FAECC] border-none text-white text-2xl placeholder-white/60"
          />

          {fromName.length >= MAX_NAME_LENGTH && (
            <div className="absolute left bottom text-xs text-white/50">
              Достигнут лимит символов
              {MAX_NAME_LENGTH}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setStep(3)}
        className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Дальше
      </button>
    </div>
  );

  // Шаг 3: Просмотр и Отправка
  const renderStep3 = () => (
    <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
      <h1 className="font-miroslav text-4xl text-center text-[#7FAECC]">
        Отправьте <br /> поздравление
      </h1>

      {/* РЕЗУЛЬТИРУЮЩАЯ ОТКРЫТКА (DOM узел, который мы будем скринить) */}
      <div className="bg-[#22386F] w-full text-center">
        <div className="border-2 border-white/70 flex flex-col items-center">
          {/* Картинка */}
          <div className="w-full aspect-square">
            {selectedImage && (
              <Image
                src={selectedImage}
                width={500}
                height={500}
                className="w-full h-full object-cover"
                alt="final"
              />
            )}
            {/* Можно наложить логотип 30 лет поверх картинки здесь */}
          </div>

          {/* Текст */}
          <div className="text-[#D37F9A] uppercase tracking-wide pt-3 pb-4">
            {toName && (
              <div className="font-miroslav text-2xl leading-tight">
                {toName},
              </div>
            )}
            <div className="font-miroslav text-2xl leading-tight">
              Поздравляю Вас
            </div>
            <div className="font-miroslav text-2xl leading-tight">
              {getFinalHolidayText()}
            </div>
            {fromName && (
              <div className="pt-2">
                <div className="text-md text-gray-400 border-t border-gray-400 px-5 pt-2 inline-block">
                  {fromName}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка шеринга */}
      <button
        onClick={handleShare}
        disabled={isGenerating}
        className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-600 disabled:cursor-wait text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
      >
        {isGenerating ? "Создание..." : "Отправить"}
      </button>
    </div>
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

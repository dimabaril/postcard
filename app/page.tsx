"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toJpeg } from "html-to-image";
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

  const cardRef = useRef<HTMLDivElement>(null);

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
    if (cardRef.current === null) return;

    try {
      // Генерируем картинку из HTML
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95,
        // backgroundColor: "#22386F",
      });

      // Конвертируем base64 в Blob для Web Share API
      const blob = await (await fetch(dataUrl)).blob();

      // const file = new File([blob], "postcard.jpg", { type: "image/jpeg" });
      const timestamp = Date.now();
      const file = new File([blob], `postcard_${timestamp}.jpg`, {
        type: "image/jpeg",
      });

      // Debug: check whether the browser can share files (after file is created)
      console.log(
        "navigator.canShare(files):",
        navigator.canShare
          ? navigator.canShare({ files: [file] })
          : "no canShare",
      );

      if (navigator.share) {
        await navigator.share({
          title: "Поздравление",
          text: "Вам открытка!",
          files: [file],
        });
      } else {
        // Фоллбэк для десктопа - просто скачивание
        const link = document.createElement("a");
        link.download = "postcard.jpg";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Ошибка при создании картинки", err);
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
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all relative ${
              selectedImage === img
                ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "border-transparent"
            }`}
            // style={{ width: "100px", height: "100px" }}
          >
            <Image
              src={img}
              alt="choice"
              width={100}
              height={100}
              className="object-cover w-full h-full scale-170"
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
          <input
            type="text"
            placeholder="Введите название праздника"
            value={customHolidayText}
            onChange={(e) => setCustomHolidayText(e.target.value)}
            className="font-stretch-extra-condensed w-full h-12 px-4 rounded border border-white text-white text-2xl placeholder-white/50"
          />
        )}

        <input
          type="text"
          placeholder="Имя получателя (необязательно)"
          value={toName}
          onChange={(e) => setToName(e.target.value)}
          className="font-stretch-extra-condensed w-full h-12 px-4 rounded bg-[#7FAECC] border-none text-white text-2xl placeholder-white/60"
        />

        <input
          type="text"
          placeholder="Имя отправителя (необязательно)"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          className="font-stretch-extra-condensed w-full h-12 px-4 rounded bg-[#7FAECC] border-none text-white text-2xl placeholder-white/60"
        />
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
      <div ref={cardRef} className="bg-[#22386F] w-full text-center relative">
        {/* Здесь можно добавить SVG-рамку узором как фон или border-image */}
        <div className="border-2 border-white/70 flex flex-col items-center">
          {/* Картинка */}
          <div className="w-full aspect-square relative overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
                className="w-full h-full object-cover"
                alt="final"
              />
              // <Image
              //   src={selectedImage}
              //   width={400}
              //   height={400}
              //   className="w-full h-full object-cover"
              //   alt="final"
              // />
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
        className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Отправить
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

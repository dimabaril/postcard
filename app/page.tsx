"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toJpeg } from "html-to-image";
import { holidays, images } from "./data";
// Icons
import { Share2, Download, Send } from "lucide-react";

console.log("navigator.share:", !!navigator.share);
console.log(
  "navigator.canShare(files):",
  navigator.canShare ? navigator.canShare({ files: [file] }) : "no canShare",
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
      const file = new File([blob], "postcard.jpg", { type: "image/jpeg" });

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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl mb-6 text-center text-[#7FAECC]">
        Выберите картинку <br /> для открытки
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all relative ${
              selectedImage === img
                ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "border-transparent"
            }`}
            style={{ width: "100px", height: "100px" }}
          >
            {/* В реальном проекте используйте next/image */}
            {/* <img
              src={img}
              alt="choice"
              className="object-cover w-full h-full"
            /> */}
            <Image
              src={img}
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
        className="cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-xl py-3 px-12 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Дальше
      </button>
    </div>
  );

  // Шаг 2: Ввод данных
  const renderStep2 = () => (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-center text-[#7FAECC]">
        Добавьте поздравление <br /> и адресата
      </h1>

      {/* Превью выбранной картинки (маленькое) */}
      <div className="w-64 h-64 mb-6 border-4 border-white rounded-lg overflow-hidden relative bg-black/20">
        {selectedImage && (
          // <img
          //   src={selectedImage}
          //   className="w-full h-full object-cover"
          //   alt="selected"
          // />
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
      <div className="w-full space-y-4 font-sans">
        <select
          value={selectedHolidayId}
          onChange={handleHolidayChange}
          className="w-full p-3 rounded  border border-white text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          {holidays.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label}
            </option>
          ))}
        </select>

        {selectedHolidayId === 100 && (
          <input
            type="text"
            placeholder="Введите название праздника"
            value={customHolidayText}
            onChange={(e) => setCustomHolidayText(e.target.value)}
            className="w-full p-3 rounded border border-white text-white placeholder-white/50"
          />
        )}

        <input
          type="text"
          placeholder="Имя получателя (необязательно)"
          value={toName}
          onChange={(e) => setToName(e.target.value)}
          className="w-full p-3 rounded bg-[#7FAECC] border-none text-white placeholder-white/60"
        />

        <input
          type="text"
          placeholder="Имя отправителя (необязательно)"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          className="w-full p-3 rounded bg-[#7FAECC] border-none text-white placeholder-white/60"
        />
      </div>

      <button
        onClick={() => setStep(3)}
        className="mt-8 cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-xl py-3 px-12 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Дальше
      </button>
    </div>
  );

  // Шаг 3: Просмотр и Отправка
  const renderStep3 = () => (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <h1 className="text-3xl mb-4 text-center text-[#7FAECC]">
        Отправьте <br /> поздравление
      </h1>

      {/* РЕЗУЛЬТИРУЮЩАЯ ОТКРЫТКА (DOM узел, который мы будем скринить) */}
      <div
        ref={cardRef}
        className="bg-[#22386F] p-6 w-full text-center relative border border-blue-900"
      >
        {/* Здесь можно добавить SVG-рамку узором как фон или border-image */}
        <div className="border-2 border-white/50 p-4 h-full flex flex-col items-center">
          {/* Картинка */}
          <div className="w-full aspect-square relative mb-6 border-4 border-white shadow-lg overflow-hidden">
            {selectedImage && (
              // <img
              //   src={selectedImage}
              //   className="w-full h-full object-cover"
              //   alt="final"
              // />
              <Image
                src={selectedImage}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                alt="final"
              />
            )}
            {/* Можно наложить логотип 30 лет поверх картинки здесь */}
          </div>

          {/* Текст */}
          <div className="text-[#f9a8d4] uppercase tracking-wide">
            {toName && <div className="text-xl mb-2">{toName},</div>}
            <div className="text-2xl leading-tight mb-2">ПОЗДРАВЛЯЮ ВАС</div>
            <div className="text-2xl leading-tight mb-6">
              {getFinalHolidayText()}
            </div>
            {fromName && (
              <div className="text-md text-gray-400 ">{fromName}</div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки шеринга */}
      <div className="mt-8 w-full text-center">
        <p className="mb-4 text-lg text-white ">Выберите способ отправки:</p>
        <div className="flex justify-center gap-6">
          {/* Кнопка Share API (универсальная для мобилок) */}
          <button
            onClick={handleShare}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-full border border-[#D37F9A] flex items-center justify-center">
              <Send className="text-[#D37F9A] w-6 h-6" />
            </div>
            <span className="text-sm text-[#D37F9A]">Отправить</span>
          </button>

          {/* Кнопка Скачать (для десктопа) */}
          <button
            onClick={handleShare}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-full border border-[#D37F9A] flex items-center justify-center">
              <Download className="text-[#D37F9A] w-6 h-6" />
            </div>
            <span className="text-sm text-[#D37F9A]">Скачать</span>
          </button>
        </div>

        <button
          onClick={() => setStep(1)}
          className="mt-10 text-sm text-blue-300 underline"
        >
          Создать новую
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-8 bg-[#22386F]">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardPreview } from "../components/CardPreview";
import { ShareButton } from "../components/ShareButton";
import { StepLayout } from "../components/StepLayout";
import { useCard } from "../CardContext";
import { holidays } from "../data";

function getFinalHolidayText(
  selectedHolidayId: number,
  customHolidayText: string,
) {
  if (selectedHolidayId === 100) return customHolidayText;
  const holiday = holidays.find((h) => h.id === selectedHolidayId);
  return holiday ? holiday.label : "";
}

export default function Send() {
  const router = useRouter();
  const { data } = useCard();
  const [isGenerating, setIsGenerating] = useState(false);

  const finalHoliday = getFinalHolidayText(
    data.selectedHolidayId,
    data.customHolidayText,
  );

  useEffect(() => {
    if (!data.selectedImage || !finalHoliday) {
      router.replace("/select-card");
    }
  }, [data.selectedImage, finalHoliday, router]);

  const handleShare = async () => {
    if (!data.selectedImage) {
      alert("Выберите картинку перед отправкой");
      return;
    }
    if (!finalHoliday) {
      alert("Введите текст поздравления");
      return;
    }
    setIsGenerating(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const params = new URLSearchParams();
      params.set("imageUrl", data.selectedImage);
      if (data.toName) params.set("toName", data.toName);
      if (data.fromName) params.set("fromName", data.fromName);
      if (finalHoliday) params.set("holidayText", finalHoliday);
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

  return (
    <StepLayout
      title={
        <>
          Отправьте <br /> поздравление
        </>
      }
    >
      <CardPreview
        imageUrl={data.selectedImage}
        toName={data.toName}
        fromName={data.fromName}
        holidayText={finalHoliday}
      />
      <ShareButton
        onClick={handleShare}
        disabled={isGenerating || !data.selectedImage || !finalHoliday}
        loading={isGenerating}
      />
    </StepLayout>
  );
}

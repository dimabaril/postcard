import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import * as fs from "fs/promises";
import { MAX_HOLIDAY_LENGTH, MAX_NAME_LENGTH } from "../../constants";
import { CardTemplate, CARD_IMAGE_CLASS } from "../../components/CardTemplate";

// Cache fonts between invocations to avoid reading from disk on every request
const miroslavFontPromise = fs.readFile(
  new URL("../../fonts/MiroslavRegular.ttf", import.meta.url),
);
const openSansFontPromise = fs.readFile(
  new URL("../../fonts/OpenSans-Regular.ttf", import.meta.url),
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Получаем параметры из URL
    const imagePath = searchParams.get("imageUrl");
    const toName = (searchParams.get("toName") || "").slice(0, MAX_NAME_LENGTH);
    const fromName = (searchParams.get("fromName") || "").slice(
      0,
      MAX_NAME_LENGTH,
    );
    const holidayText = (searchParams.get("holidayText") || "").slice(
      0,
      MAX_HOLIDAY_LENGTH,
    );

    if (!imagePath) {
      return new Response("Image URL is required", { status: 400 });
    }

    // Разрешаем только локальные картинки из /images/
    if (!imagePath.startsWith("/images/")) {
      return new Response("Invalid image path", { status: 400 });
    }

    // Конструируем абсолютный URL для изображения
    const imageUrl = new URL(imagePath, req.nextUrl.origin).toString();
    const [miroslavFontData, openSansFontData] = await Promise.all([
      miroslavFontPromise,
      openSansFontPromise,
    ]);

    const imageWidth = 500;
    const imageHeight = 500;
    const linesEstimate =
      (toName ? 1 : 0) +
      1 +
      Math.max(1, Math.ceil(holidayText.length / 18)) +
      (fromName ? 2 : 0);
    const textHeight = linesEstimate * 30 + 40; // rough line height + paddings
    const cardHeight = imageHeight + textHeight;

    const card = (
      <CardTemplate
        mode="og"
        toName={toName || undefined}
        fromName={fromName || undefined}
        holidayText={holidayText}
        imageHeight={imageHeight}
        imageNode={
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" tw={CARD_IMAGE_CLASS} />
        }
      />
    );

    // Используем ImageResponse для генерации изображения на сервере
    return new ImageResponse(card, {
      width: imageWidth,
      height: cardHeight,
      headers: {
        "cache-control": "no-store",
      },
      fonts: [
        {
          name: "font-miroslav",
          data: miroslavFontData,
          style: "normal",
        },
        {
          name: "font-open-sans",
          data: openSansFontData,
          style: "normal",
        },
      ],
    });
  } catch (e: Error | unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to generate image:", {
      message: errorMessage,
      url: req.url,
    });
    return new Response("Failed to generate image", { status: 500 });
  }
}

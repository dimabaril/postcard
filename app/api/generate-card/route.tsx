import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { join } from "path";
import * as fs from "fs/promises";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Получаем параметры из URL
    const imagePath = searchParams.get("imageUrl");
    const toName = searchParams.get("toName") || "";
    const fromName = searchParams.get("fromName") || "";
    const holidayText = searchParams.get("holidayText") || "";

    if (!imagePath) {
      return new Response("Image URL is required", { status: 400 });
    }

    // Конструируем абсолютный URL для изображения
    const imageUrl = new URL(imagePath, req.nextUrl.origin).toString();

    // Читаем файл Miroslav из файловой системы
    const miroslavFontPath = join(
      process.cwd(),
      "app",
      "fonts",
      "MiroslavRegular.ttf",
    );
    const openSansFontPath = join(
      process.cwd(),
      "app",
      "fonts",
      "OpenSans-Regular.ttf",
    );

    const miroslavFontData = await fs.readFile(miroslavFontPath);
    const openSansFontData = await fs.readFile(openSansFontPath);

    const imageWidth = 500;
    const imageHeight = 500;

    // Используем ImageResponse для генерации изображения на сервере
    return new ImageResponse(
      (
        <div tw="flex w-full h-full bg-[#22386F] text-center">
          <div tw="flex flex-col items-center w-full border-2 border-white/70">
            {/* Картинка */}
            <div
              tw={`w-full h-[${imageHeight}px] flex items-center justify-center`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" tw="w-full h-full object-cover" />
            </div>

            {/* Текст */}
            <div
              tw="text-[#D37F9A] uppercase tracking-wide pt-3 pb-4 flex flex-col items-center w-full"
              style={{ fontFamily: "Miroslav" }}
            >
              {toName && (
                <div tw="text-[26px] leading-tight flex">{toName},</div>
              )}
              <div tw="text-[26px] leading-tight flex">Поздравляю Вас</div>
              <div tw="text-[26px] leading-tight flex">{holidayText}</div>
              {fromName && (
                <div tw="pt-2 w-full flex justify-center">
                  <div
                    tw="text-base text-gray-400 border-t border-gray-400 px-5 pt-2 inline-block"
                    style={{ fontFamily: "OpenSans" }}
                  >
                    {fromName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: imageWidth,
        height: imageHeight + 170,
        fonts: [
          {
            name: "Miroslav",
            data: miroslavFontData,
            style: "normal",
          },
          {
            name: "OpenSans",
            data: openSansFontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: Error | unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to generate image:", errorMessage);
    return new Response("Failed to generate image", { status: 500 });
  }
}

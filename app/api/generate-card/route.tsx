import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { join } from "path";
import * as fs from "fs/promises";

// Убираем Edge Runtime, чтобы получить доступ к файловой системе (fs)
// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // --- Получаем параметры из URL ---
    const imagePath = searchParams.get("imageUrl");
    const toName = searchParams.get("toName");
    const fromName = searchParams.get("fromName");
    // const toName = "Вася";
    // const fromName = "Петя";
    const holidayText = searchParams.get("holidayText");

    if (!imagePath) {
      return new Response("Image URL is required", { status: 400 });
    }
    // Construct an absolute URL for the image
    const imageUrl = new URL(imagePath, req.nextUrl.origin).toString();

    // --- Читаем файл шрифта напрямую из файловой системы ---
    // Путь относительно корня проекта
    const fontPath = join(process.cwd(), "app", "fonts", "MiroslavRegular.ttf");
    const miroslavFontData = await fs.readFile(fontPath);

    const imageWidth = 500;
    const imageHeight = 500;

    return new ImageResponse(
      (
        // --- JSX-структура открытки ---
        <div tw="bg-[#22386F] w-full h-full flex text-center">
          <div tw="flex flex-col items-center w-full border-2 border-white/70">
            {/* Картинка */}
            <div tw="w-full h-[500px] flex items-center justify-center">
              <img src={imageUrl} alt="" tw="w-full h-full object-cover" />
            </div>

            {/* Текст */}
            <div
              tw="text-[#D37F9A] uppercase tracking-wide pt-3 pb-4 flex flex-col items-center"
              style={{ fontFamily: '"Miroslav"' }}
            >
              {toName && <div tw="text-[26px] leading-tight">{toName}</div>}
              <div tw="text-[26px] leading-tight">Поздравляю Вас</div>
              <div tw="text-[26px] leading-tight">{holidayText}</div>
              {fromName && (
                <div tw="pt-2 w-full flex justify-center">
                  <div tw="text-base text-gray-400 border-t border-gray-500 px-8 pt-1 inline-block">
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
        // Высота будет немного больше, чтобы вместить текст
        height: imageHeight + 150,
        fonts: [
          {
            name: "Miroslav",
            data: miroslavFontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.error("Failed to generate image:", e.message);
    return new Response("Failed to generate image", { status: 500 });
  }
}

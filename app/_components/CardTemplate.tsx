import React from "react";

type CardTemplateMode = "web" | "og";

interface CardTemplateProps {
  mode: CardTemplateMode;
  imageNode?: React.ReactNode;
  toName?: string;
  fromName?: string;
  holidayText: string;
  imageHeight?: number;
}

const classAttr = (mode: CardTemplateMode, value: string) =>
  mode === "og" ? { tw: value } : { className: value };

export const CARD_IMAGE_CLASS = "w-full h-full object-cover";

export function CardTemplate({
  mode,
  imageNode,
  toName,
  fromName,
  holidayText,
  imageHeight,
}: CardTemplateProps) {
  const isOg = mode === "og";
  const miroslavStyle = isOg ? { fontFamily: "font-miroslav" } : undefined;
  const openSansStyle = isOg ? { fontFamily: "font-open-sans" } : undefined;

  return (
    <div
      {...classAttr(
        mode,
        `bg-[#22386F] w-full text-center${isOg ? " flex" : ""}`,
      )}
    >
      <div
        {...classAttr(
          mode,
          "border-2 border-white/70 flex flex-col items-center w-full",
        )}
      >
        <div
          {...classAttr(
            mode,
            "w-full flex items-center justify-center overflow-hidden",
          )}
          style={
            imageHeight
              ? ({ height: imageHeight } as React.CSSProperties)
              : undefined
          }
        >
          {imageNode}
        </div>

        <div
          {...classAttr(
            mode,
            "text-[#D37F9A] uppercase pt-3 pb-4 flex flex-col items-center w-full",
          )}
        >
          {toName && (
            <div
              {...classAttr(mode, "text-2xl flex font-miroslav")}
              style={miroslavStyle}
            >
              {toName},
            </div>
          )}
          <div
            {...classAttr(mode, "text-2xl flex font-miroslav")}
            style={miroslavStyle}
          >
            Поздравляю Вас
          </div>
          <div
            {...classAttr(mode, "text-2xl flex font-miroslav")}
            style={miroslavStyle}
          >
            {holidayText}
          </div>
          {fromName && (
            <div {...classAttr(mode, "pt-2 w-full flex justify-center")}>
              <div
                {...classAttr(
                  mode,
                  "text-base border-t px-5 pt-2 inline-block text-[#9ca3af] border-[#9ca3af] font-open-sans",
                )}
                style={openSansStyle}
              >
                {fromName}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

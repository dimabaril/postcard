import Image from "next/image";
import { CARD_IMAGE_CLASS, CardTemplate } from "./CardTemplate";

interface CardPreviewProps {
  imageUrl: string | null;
  toName?: string;
  fromName?: string;
  holidayText: string;
}

export function CardPreview({
  imageUrl,
  toName,
  fromName,
  holidayText,
}: CardPreviewProps) {
  return (
    <CardTemplate
      mode="web"
      imageNode={
        imageUrl ? (
          <Image
            src={imageUrl}
            width={500}
            height={500}
            className={CARD_IMAGE_CLASS}
            alt="final"
            priority
          />
        ) : undefined
      }
      toName={toName}
      fromName={fromName}
      holidayText={holidayText}
    />
  );
}

"use client";
import Image from "next/image";
import { motion } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={imageUrl}
              width={500}
              height={500}
              className={CARD_IMAGE_CLASS}
              alt="final"
              priority
            />
          </motion.div>
        ) : undefined
      }
      toName={toName}
      fromName={fromName}
      holidayText={holidayText}
    />
  );
}

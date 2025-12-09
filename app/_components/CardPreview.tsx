"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
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
  const [loaded, setLoaded] = useState(false);
  return (
    <CardTemplate
      mode="web"
      imageNode={
        imageUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <Image
              src={imageUrl}
              width={500}
              height={500}
              className={CARD_IMAGE_CLASS}
              alt="final"
              priority
              onLoadingComplete={() => setLoaded(true)}
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

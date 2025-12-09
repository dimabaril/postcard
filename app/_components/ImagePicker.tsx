"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface ImageItem {
  cardImage: string;
  previewImage: string;
}

interface ImagePickerProps {
  images: ImageItem[];
  selected: string | null;
  onSelect: (src: string) => void;
}

export function ImagePicker({ images, selected, onSelect }: ImagePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((img, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(img.cardImage)}
          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
            selected === img.cardImage
              ? "border-white shadow-[0_0_20px_rgba(255,255,255,1)]"
              : "border-transparent"
          }`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              src={img.previewImage}
              alt="choice"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

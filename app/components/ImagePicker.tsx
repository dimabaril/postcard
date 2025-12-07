import Image from "next/image";

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
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all relative ${
            selected === img.cardImage
              ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              : "border-transparent"
          }`}
        >
          <Image
            src={img.previewImage}
            alt="choice"
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}

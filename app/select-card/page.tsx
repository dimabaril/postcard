"use client";
import { useRouter } from "next/navigation";
import { images } from "../data";
import { ImagePicker } from "../_components/ImagePicker";
import { NextButton } from "../_components/NextButton";
import { StepLayout } from "../_components/StepLayout";
import { useCard } from "../CardContext";

export default function SelectCard() {
  const router = useRouter();
  const { data, setData } = useCard();

  return (
    <StepLayout
      title={
        <>
          Выберите картинку
          <br />
          для открытки
        </>
      }
    >
      <ImagePicker
        images={images}
        selected={data.selectedImage}
        onSelect={(img) => setData({ ...data, selectedImage: img })}
      />
      <NextButton
        disabled={!data.selectedImage}
        onClick={() => router.push("/fill-fields")}
      >
        Дальше
      </NextButton>
    </StepLayout>
  );
}

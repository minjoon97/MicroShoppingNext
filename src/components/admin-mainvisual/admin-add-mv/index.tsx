"use client";

import { ChangeEvent, useState } from "react";

import styles from "./index.module.css";
import { addMainvisualType } from "@/types/MainvisualType";

interface AddMainvisualSectionProps {
  onAdd: (formData: addMainvisualType) => Promise<{
    success: boolean;
    message: string;
  }>;
  onAddSuccess?: () => void;
}

const AddMainvisualSection = ({
  onAdd,
  onAddSuccess,
}: AddMainvisualSectionProps) => {
  const [mvTitle, setMvTitle] = useState("");
  const [mvSubtitle, setMvSubtitle] = useState("");
  const [mvImage, setMvImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMvImage(e.target.files[0]);
    }
  };

  const handleAddMainvisual = async () => {
    if (!mvTitle || !mvSubtitle || !mvImage) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await onAdd({
        title: mvTitle,
        subtitle: mvSubtitle,
        image: mvImage,
      });
      // 성공 시 처리
      setMvTitle("");
      setMvSubtitle("");
      setMvImage(null);
      alert("상품이 추가되었습니다!");
      if (onAddSuccess) onAddSuccess();
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error);
      alert("상품 추가에 실패했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={mvTitle}
        onChange={(e) => setMvTitle(e.target.value)}
        placeholder="메인비주얼 타이틀"
      />
      <input
        type="text"
        value={mvSubtitle}
        onChange={(e) => setMvSubtitle(e.target.value)}
        placeholder="메인비주얼 서브타이틀"
      />
      <input
        type="file"
        id="imageInput"
        onChange={handleImageChange}
        placeholder="이미지"
        accept="image/*"
      />
      <button onClick={handleAddMainvisual}>상품 추가</button>
    </div>
  );
};

export default AddMainvisualSection;

"use client";

import { ChangeEvent, useState } from "react";

import styles from "./index.module.css";
import { addRecommend } from "@/data/recommend";

const AddRecommendSection = () => {
  const [recommendName, setRecommendName] = useState("");
  const [recommendCategory, setRecommendCategory] = useState("");
  const [recommendPrice, setRecommendPrice] = useState(0);
  const [recommendImage, setRecommendImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRecommendImage(e.target.files[0]);
    }
  };

  const handleAddRecommend = async () => {
    if (
      !recommendName ||
      !recommendCategory ||
      !recommendPrice ||
      !recommendImage
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await addRecommend({
        name: recommendName,
        category: recommendCategory,
        price: recommendPrice,
        image: recommendImage,
      });
      // 성공 시 처리
      setRecommendName("");
      setRecommendCategory("");
      setRecommendPrice(0);
      setRecommendImage(null);
      alert("상품이 추가되었습니다!");
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error);
      alert("상품 추가에 실패했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={recommendName}
        onChange={(e) => setRecommendName(e.target.value)}
        placeholder="상품 이름"
      />
      <input
        type="text"
        value={recommendCategory}
        onChange={(e) => setRecommendCategory(e.target.value)}
        placeholder="카테고리"
      />
      <input
        type="number"
        value={recommendPrice}
        onChange={(e) => setRecommendPrice(Number(e.target.value))}
        placeholder="가격"
      />
      <input
        type="file"
        id="imageInput"
        onChange={handleImageChange}
        placeholder="이미지"
        accept="image/*"
      />
      <button onClick={handleAddRecommend}>상품 추가</button>
    </div>
  );
};

export default AddRecommendSection;

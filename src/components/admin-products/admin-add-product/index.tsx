"use client";

import { ChangeEvent, useState } from "react";

import styles from "./index.module.css";
import { addProductType } from "@/types/ProductType";

interface AddProductSectionProps {
  onAdd: (
    formData: addProductType
  ) => Promise<{ success: boolean; message: string }>;
  onAddSuccess?: () => void;
}

const AddProductSection = ({ onAdd, onAddSuccess }: AddProductSectionProps) => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productCategory || !productPrice || !productImage) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await onAdd({
        name: productName,
        category: productCategory,
        description: productDescription,
        price: productPrice,
        image: productImage,
      });
      // 성공 시 처리
      setProductName("");
      setProductCategory("");
      setProductDescription("");
      setProductPrice(0);
      setProductImage(null);
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
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="상품 이름"
      />
      <select
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
      >
        <option value="">카테고리 선택</option>
        <option value="상의">상의</option>
        <option value="하의">하의</option>
        <option value="신발">신발</option>
      </select>
      <textarea
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        placeholder="설명"
      />
      <input
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(Number(e.target.value))}
        placeholder="가격"
      />
      <input
        type="file"
        id="imageInput"
        onChange={handleImageChange}
        placeholder="이미지"
        accept="image/*"
      />
      <button onClick={handleAddProduct}>상품 추가</button>
    </div>
  );
};

export default AddProductSection;

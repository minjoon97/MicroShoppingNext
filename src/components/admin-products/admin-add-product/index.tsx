"use client";

import { ChangeEvent, useState } from "react";

import styles from "./index.module.css";
import { addProduct } from "@/data/products";

const AddProductSection = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
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
      await addProduct({
        name: productName,
        category: productCategory,
        price: productPrice,
        image: productImage,
      });
      // 성공 시 처리
      setProductName("");
      setProductCategory("");
      setProductPrice(0);
      setProductImage(null);
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
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="상품 이름"
      />
      <input
        type="text"
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
        placeholder="카테고리"
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

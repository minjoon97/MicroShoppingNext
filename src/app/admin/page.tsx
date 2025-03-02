"use client";

import { addProduct } from "@/data/firestore";
import { useState } from "react";

import styles from "./page.module.css";

const AdminPage = () => {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImage, setProductImage] = useState("");

  const handleAddProduct = async () => {
    try {
      await addProduct({
        name: productName,
        category: productCategory,
        price: productPrice,
      });
      // 성공 시 처리
      setProductName("");
      setProductCategory("");
      setProductPrice(0);
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
        value={productImage}
        onChange={(e) => setProductImage(e.target.value)}
        placeholder="이미지"
      />
      <button onClick={handleAddProduct}>상품 추가</button>
    </div>
  );
};

export default AdminPage;

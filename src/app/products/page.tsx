"use client";

import styles from "./page.module.css";
import ProductItem from "@/components/productItem";
import { useProducts } from "@/hooks/useProducts";

const ProductPage = () => {
  const { items, loading } = useProducts();

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>상품목록</h2>
        <p>{items.length}건</p>
      </div>
      <div className={styles.gridContainer}>
        {items.map((item) => (
          <ProductItem key={item.id} item={item}></ProductItem>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

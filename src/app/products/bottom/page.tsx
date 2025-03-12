"use client";

import styles from "./page.module.css";
import ProductItem from "@/components/productItem";
import { useProducts } from "@/hooks/useProducts";
import { useProductStore } from "@/store/useProductStore";
import Link from "next/link";

const ProductPage = () => {
  const { items, loading } = useProducts("하의");
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct
  );

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>하의 상품목록</h2>
        <p>{items.length}건</p>
      </div>
      <div className={styles.gridContainer}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className={styles.productItemLink}
            onClick={() => {
              setSelectedProduct(item);
            }}
          >
            <ProductItem item={item}></ProductItem>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

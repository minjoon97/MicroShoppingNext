"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { useProducts } from "@/hooks/useProducts";
import { useProductStore } from "@/store/useProductStore";
import ProductItem from "@/components/productItem";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // useProducts 훅에 검색어 전달
  const { items, loading } = useProducts(undefined, searchQuery);
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct
  );

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>검색 상품목록</h2>
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
}

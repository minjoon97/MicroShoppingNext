"use client";

import { fetchedProductsType } from "@/types/ProductType";
import styles from "./page.module.css";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import Image from "next/image";

const ProductDetailPage = () => {
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const [product, setProduct] = useState<fetchedProductsType | null>(null);

  useEffect(() => {
    setProduct(selectedProduct);
  }, [selectedProduct]);

  if (!product) {
    return <div className={styles.wrapper}>상품 정보를 불러오는 중...</div>;
  }

  return (
    <div className={styles.wrapper}>
      {product.image && (
        <Image
          src={product.image}
          alt="product-image"
          width={300}
          height={400}
        ></Image>
      )}
      <div className={styles.info}>
        <p>{product.category}</p>
        <h2>{product.name}</h2>
        <p>￦{product.price}</p>
        <p>
          ・면100% 데님 소재
          <br />
          ・리버시블
          <br />
          ・하트 핀스트라이프 포플린 안감
          <br />
          ・2개의 웰트 포켓
          <br />
          ・리버시블 지퍼
          <br />
          ・하트 라벨
        </p>
        <div className={styles.btnBox}>
          <button>상품 구매하기</button>
          <button>
            <Image
              src="/heart.svg"
              alt="heartImage"
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

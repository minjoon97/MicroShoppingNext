"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";

const ModernSection = () => {
  const { items, loading } = useProducts();
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct
  );

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className={styles.modern}>
      <div className={styles.modernMenu}>
        <h2>최신 상품</h2>
        <p>2025 봄 신상 리스트</p>
      </div>
      <Swiper
        key="modernswiper"
        modules={[Pagination]}
        slidesPerView={5.2}
        loop={true}
      >
        {items.slice(0, 6).map((item, index) => (
          <SwiperSlide key={`section-${index}`}>
            <div className={styles.mainSlideItem}>
              <Link
                href={`/products/${item.id}`}
                onClick={() => {
                  setSelectedProduct(item);
                }}
              >
                <Image
                  src={item.image}
                  alt="product-image"
                  width={300}
                  height={300}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                  className={styles.productImage}
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ModernSection;

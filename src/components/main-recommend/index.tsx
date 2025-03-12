"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRecommends } from "@/hooks/useRecommends";
import Image from "next/image";

const RecommendSection = () => {
  const { items, loading } = useRecommends();

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className={styles.recommend}>
      <div className={styles.recommendTitle}>
        <h2>추천 스타일</h2>
      </div>
      <Swiper
        key="recommendswiper"
        modules={[Pagination]}
        slidesPerView={2.2}
        loop={true}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`section-${index}`}>
            <div className={styles.mainSlideItem}>
              <Image
                src={item.image}
                alt="product-image"
                width={800}
                height={600}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
                className={styles.productImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RecommendSection;

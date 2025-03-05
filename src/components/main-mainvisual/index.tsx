"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useMainvisuals } from "@/hooks/useMainvisuals";
import Image from "next/image";

const MainVisual = () => {
  const { items, loading } = useMainvisuals();

  if (loading) return <div>로딩 중...</div>;

  return (
    <Swiper
      key="mainvisualswiper"
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      autoplay={{ delay: 5000 }}
      loop={true}
    >
      {items.map((item, index) => (
        <SwiperSlide key={`section-${index}`}>
          <section className={styles.mainvisual}>
            <div className={styles.mainSlideItem}>
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
              <div className={styles.titleBox}>
                <h2>{item.title}</h2>
                <h3>{item.subtitle}</h3>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MainVisual;

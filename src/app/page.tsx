"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import styles from "./page.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  return (
    <div>
      <Swiper
        key="mainvisualswiper"
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {[1, 2, 3].map((index) => (
          <SwiperSlide key={`section-${index}`}>
            <section className={styles.mainvisual}>
              <div className={styles.mainSlideItem}>
                <h1 className={styles.title}>메인 비주얼 {index}</h1>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
      <section className={styles.popular}>
        <div className={styles.popularMenu}>
          <h2>가장 인기있는 상품</h2>
          <div>
            <button>상의</button>
            <button>하의</button>
            <button>신발</button>
          </div>
        </div>
        <Swiper
          key="popularswiper"
          modules={[Pagination]}
          slidesPerView={5.2}
          loop={true}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
            <SwiperSlide key={`section-${index}`}>
              <div className={styles.mainSlideItem}>
                <h1 className={styles.title}>인기상품{index}</h1>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
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
          {[1, 2, 3, 4, 5].map((index) => (
            <SwiperSlide key={`section-${index}`}>
              <div className={styles.mainSlideItem}>
                <h1 className={styles.title}>추천상품{index}</h1>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}

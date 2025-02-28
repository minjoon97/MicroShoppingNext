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
        <div>
          <h2>가장 인기있는 상품</h2>
          <button>상의</button>
          <button>하의</button>
          <button>신발</button>
        </div>
      </section>
      <section className={styles.recommend}>
        <div>
          <h2>추천 스타일</h2>
        </div>
      </section>
    </div>
  );
}

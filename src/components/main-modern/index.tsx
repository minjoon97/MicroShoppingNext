import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";

const ModernSection = () => {
  const { items, loading } = useProducts();

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className={styles.modern}>
      <div className={styles.modernMenu}>
        <h2>최신 상품</h2>
        <div>
          <button>상의</button>
          <button>하의</button>
          <button>신발</button>
        </div>
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ModernSection;

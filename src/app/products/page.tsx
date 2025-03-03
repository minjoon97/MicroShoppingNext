import { fetchProducts } from "@/data/firestore";
import styles from "./page.module.css";
import Image from "next/image";

const ProductPage = async () => {
  const items = await fetchProducts();
  console.log(items);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>상품목록</h2>
      </div>
      <div className={styles.gridContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.gridItem}>
            <div className={styles.itemContent}>
              <Image
                src={item.image}
                alt="product-image"
                width={300}
                height={300}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                className={styles.productImage}
              />
            </div>
            {item.name}
            {item.price}
            {item.category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

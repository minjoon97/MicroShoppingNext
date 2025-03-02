import fetchProducts from "@/data/firestore";
import styles from "./page.module.css";

const ProductPage = async () => {
  const items = await fetchProducts();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>상품목록</h2>
      </div>
      <div className={styles.gridContainer}>
        {items.map((item, index) => (
          <div key={index} className={styles.gridItem}>
            <div className={styles.itemContent}>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

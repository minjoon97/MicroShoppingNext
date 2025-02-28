import styles from "./page.module.css";

const ProductPage = () => {
  const items = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>상품목록</h2>
      </div>
      <div className={styles.gridContainer}>
        {items.map((item) => (
          <div key={item} className={styles.gridItem}>
            <div className={styles.itemContent}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

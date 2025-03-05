import Image from "next/image";
import styles from "./index.module.css";
import { fetchedProductsType } from "@/types/ProductType";

interface ProductItemProps {
  item: fetchedProductsType;
}

const ProductItem = ({ item }: ProductItemProps) => {
  return (
    <div className={styles.gridItem}>
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
      <p>{item.category}</p>
      <p>{item.name}</p>
      <p>￦{item.price}</p>
    </div>
  );
};

export default ProductItem;

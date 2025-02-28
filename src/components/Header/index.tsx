import Link from "next/link";
import styles from "./index.module.css";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.menu}>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products">
            PRODUCTS
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products">
            MYPAGE
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products">
            ADMIN
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;

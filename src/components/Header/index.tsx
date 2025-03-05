import Link from "next/link";
import Image from "next/image";

import styles from "./index.module.css";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <h1>
        <Link href="/">
          <Image src="/logo.svg" alt="로고" width={120} height={40} priority />
        </Link>
      </h1>
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
          <Link className={styles.listItemContent} href="/admin">
            ADMIN
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;

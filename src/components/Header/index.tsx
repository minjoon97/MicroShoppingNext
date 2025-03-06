"use client";

import Link from "next/link";
import Image from "next/image";

import styles from "./index.module.css";
import { useUserStore } from "@/store/userStore";

const Header = () => {
  const user = useUserStore((state) => state.user);

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
        {user?.role === "admin" && (
          <li className={styles.listItem}>
            <Link className={styles.listItemContent} href="/admin">
              ADMIN
            </Link>
          </li>
        )}
      </ul>
      <div className={styles.login}>
        <Link className={styles.listItemContent} href="/login">
          LOG IN
        </Link>
      </div>
    </div>
  );
};

export default Header;

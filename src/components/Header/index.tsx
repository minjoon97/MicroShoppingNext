"use client";

import Link from "next/link";
import Image from "next/image";

import styles from "./index.module.css";
import { signOut } from "firebase/auth";
import { auth } from "@/data/firestore";
import { useUserStore } from "@/store/userStore";

const Header = () => {
  const user = useUserStore((state) => state.user);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      // Firebase에서 로그아웃
      await signOut(auth);

      // Zustand 스토어에서 사용자 정보 초기화
      const clearUser = useUserStore.getState().clearUser;
      clearUser();

      console.log("로그아웃 성공");

      // 리디렉션 처리

      return { success: true };
    } catch (error) {
      console.error("로그아웃 에러:", error);
      return { success: false, error };
    }
  };

  const handleLogoutClick = async () => {
    const result = await handleLogout();
    if (result.success) {
      // 추가적인 UI 처리 (예: 알림 메시지 표시)
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>
        <Link href="/">
          <Image src="/logo.svg" alt="로고" width={120} height={40} priority />
        </Link>
      </h1>
      <ul className={styles.menu}>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products/top">
            TOP
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products/bottom">
            BOTTOM
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link className={styles.listItemContent} href="/products/shoes">
            SHOES
          </Link>
        </li>
      </ul>
      <div className={styles.rightBox}>
        {!user && (
          <Link className={styles.login} href="/login">
            로그인
          </Link>
        )}
        {user && (
          <div className={styles.logout} onClick={handleLogoutClick}>
            로그아웃
          </div>
        )}
        <ul className={styles.rightMenu}>
          {user?.role === "admin" && (
            <li className={styles.listItem}>
              <Link className={styles.listItemContent} href="/admin">
                ADMIN
              </Link>
            </li>
          )}
          <li className={styles.listItem}>
            <Link className={styles.listItemContent} href="/products">
              <Image
                src="/profile.png"
                alt="profile"
                width={30}
                height={30}
              ></Image>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;

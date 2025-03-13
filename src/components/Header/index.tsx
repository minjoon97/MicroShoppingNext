"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./index.module.css";
import { signOut } from "firebase/auth";
import { auth } from "@/data/firestore";
import { useUserStore } from "@/store/userStore";

const Header = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      alert("로그아웃 됐습니다.");
    }
  };

  // 검색 토글 핸들러
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // 검색창이 열릴 때 입력 필드에 포커스
      setTimeout(() => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색어가 있으면 검색 결과 페이지로 이동
      router.push(`/products/all?search=${encodeURIComponent(searchQuery)}`);
      // 검색 후 검색창 닫기 (선택사항)
      setShowSearch(false);
      setSearchQuery("");
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
        {user && (
          <li className={styles.listItem}>
            <Link className={styles.listItemContent} href="/cart">
              <Image src="/cart.svg" alt="cart" width={20} height={20}></Image>
            </Link>
          </li>
        )}
        <li
          className={`${styles.listItem} ${
            showSearch ? styles.activeSearch : ""
          }`}
          onClick={toggleSearch}
        >
          <div className={styles.listItemContent}>
            <Image
              src="/search.svg"
              alt="search"
              width={20}
              height={20}
            ></Image>
          </div>
        </li>
      </ul>

      {/* 검색 바 */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearchSubmit}>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품명 검색..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>
        </div>
      )}

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
          {user && (
            <li className={styles.listItem}>
              <Link className={styles.listItemContent} href="/profile">
                <Image
                  src="/profile.png"
                  alt="profile"
                  width={26}
                  height={26}
                ></Image>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;

"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AdminProducts from "@/components/admin-products";
import AdminMainvisuals from "@/components/admin-mainvisual";

const AdminPage = () => {
  const [menuState, setMenuState] = useState(1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuBox}>
        <ul>
          <li onClick={() => setMenuState(1)}>메인비주얼 리스트 관리</li>
          <li onClick={() => setMenuState(2)}>인기상품 리스트 관리</li>
          <li onClick={() => setMenuState(3)}>추천스타일 리스트 관리</li>
          <li onClick={() => setMenuState(4)}>전체상품 리스트 관리</li>
        </ul>
      </div>
      <div className={styles.contentBox}>
        {menuState === 1 && <AdminMainvisuals></AdminMainvisuals>}
        {menuState === 4 && <AdminProducts></AdminProducts>}
      </div>
    </div>
  );
};

export default AdminPage;

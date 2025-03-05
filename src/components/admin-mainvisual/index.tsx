"use client";

import { useMainvisuals } from "@/hooks/useMainvisuals";
import styles from "./index.module.css";

const AdminMainvisuals = () => {
  const { items, loading } = useMainvisuals();

  return (
    <div className={styles.wrapper}>
      <div className={styles.topContents}>
        <h2 className={styles.title}>메인비주얼관리</h2>
        <button className={styles.addBtn}>추가하기</button>
      </div>
      <ul className={styles.mainvisualList}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          items.map((item, index) => (
            <div className={styles.mainvisualListItem} key={index}>
              {item.title}
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminMainvisuals;

"use client";

import styles from "./index.module.css";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useRecommends } from "@/hooks/useRecommends";
import AddRecommendSection from "./admin-add-recommend";

const AdminRecommends = () => {
  const { items, loading, handleDelete } = useRecommends();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topContents}>
        <h2 className={styles.title}>추천스타일 관리</h2>
        <button className={styles.addBtn} onClick={openModal}>
          추가하기
        </button>
      </div>
      <ul className={styles.recommendList}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          items.map((item, index) => (
            <div className={styles.recommendListItem} key={index}>
              {item.name}
              <p
                onClick={() => {
                  handleDelete(item.id);
                }}
              >
                &times;
              </p>
            </div>
          ))
        )}
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddRecommendSection></AddRecommendSection>
      </Modal>
    </div>
  );
};

export default AdminRecommends;

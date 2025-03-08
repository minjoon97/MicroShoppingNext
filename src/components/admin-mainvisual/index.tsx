"use client";

import { useMainvisuals } from "@/hooks/useMainvisuals";
import styles from "./index.module.css";
import Modal from "@/components/Modal";
import { useState } from "react";
import AddMainvisualSection from "./admin-add-mv";
import { deleteMainvisual } from "@/data/mainvisual";

const AdminMainvisuals = () => {
  const { items, loading } = useMainvisuals();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topContents}>
        <h2 className={styles.title}>메인비주얼관리</h2>
        <button className={styles.addBtn} onClick={openModal}>
          추가하기
        </button>
      </div>
      <ul className={styles.mainvisualList}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          items.map((item, index) => (
            <div className={styles.mainvisualListItem} key={index}>
              {item.title}
              <p
                onClick={() => {
                  deleteMainvisual(item.id);
                }}
              >
                &times;
              </p>
            </div>
          ))
        )}
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddMainvisualSection></AddMainvisualSection>
      </Modal>
    </div>
  );
};

export default AdminMainvisuals;

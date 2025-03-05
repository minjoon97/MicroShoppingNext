"use client";

import styles from "./index.module.css";
import { useProducts } from "@/hooks/useProducts";
import AddProductSection from "./admin-add-product";
import Modal from "@/components/Modal";
import { useState } from "react";

const AdminProducts = () => {
  const { items, loading } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topContents}>
        <h2 className={styles.title}>전체상품관리</h2>
        <button className={styles.addBtn} onClick={openModal}>
          추가하기
        </button>
      </div>
      <ul className={styles.productList}>
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          items.map((item, index) => (
            <div className={styles.productListItem} key={index}>
              {item.name}
            </div>
          ))
        )}
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddProductSection></AddProductSection>
      </Modal>
    </div>
  );
};

export default AdminProducts;

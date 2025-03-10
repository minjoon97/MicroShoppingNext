"use client";

import styles from "./index.module.css";
import { useProducts } from "@/hooks/useProducts";
import AddProductSection from "./admin-add-product";
import Modal from "@/components/Modal";
import { useState } from "react";
import { addProductType } from "@/types/ProductType";

const AdminProducts = () => {
  const {
    items: itemsTop,
    loading: topLoading,
    handleDelete: handleDeleteTop,
    handleAdd: handleAddTop,
  } = useProducts("상의");

  const {
    items: itemsBottom,
    loading: bottomLoading,
    handleDelete: handleDeleteBottom,
    handleAdd: handleAddBottom,
  } = useProducts("하의");

  const {
    items: itemsShoes,
    loading: shoesLoading,
    handleDelete: handleDeleteShoes,
    handleAdd: handleAddShoes,
  } = useProducts("신발");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddByCategory = (formData: addProductType) => {
    const category = formData.category;

    switch (category) {
      case "상의":
        return handleAddTop(formData);
      case "하의":
        return handleAddBottom(formData);
      case "신발":
        return handleAddShoes(formData);
      default:
        console.error("지원하지 않는 카테고리입니다:", category);
        return Promise.reject("지원하지 않는 카테고리입니다");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topContents}>
        <h2 className={styles.title}>전체상품관리</h2>
        <button className={styles.addBtn} onClick={openModal}>
          추가하기
        </button>
      </div>
      <h3>상의</h3>
      <ul className={styles.productList}>
        {topLoading ? (
          <div>로딩 중...</div>
        ) : (
          itemsTop.map((item, index) => (
            <div className={styles.productListItem} key={index}>
              {item.name}
              <p
                onClick={() => {
                  handleDeleteTop(item.id);
                }}
              >
                &times;
              </p>
            </div>
          ))
        )}
      </ul>
      <h3>하의</h3>
      <ul className={styles.productList}>
        {bottomLoading ? (
          <div>로딩 중...</div>
        ) : (
          itemsBottom.map((item, index) => (
            <div className={styles.productListItem} key={index}>
              {item.name}
              <p
                onClick={() => {
                  handleDeleteBottom(item.id);
                }}
              >
                &times;
              </p>
            </div>
          ))
        )}
      </ul>
      <h3>신발</h3>
      <ul className={styles.productList}>
        {shoesLoading ? (
          <div>로딩 중...</div>
        ) : (
          itemsShoes.map((item, index) => (
            <div className={styles.productListItem} key={index}>
              {item.name}
              <p
                onClick={() => {
                  handleDeleteShoes(item.id);
                }}
              >
                &times;
              </p>
            </div>
          ))
        )}
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddProductSection
          onAdd={handleAddByCategory}
          onAddSuccess={closeModal}
        ></AddProductSection>
      </Modal>
    </div>
  );
};

export default AdminProducts;

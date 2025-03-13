"use client";

import { SavedProduct, useUserStore } from "@/store/userStore"; // User 인터페이스에서 정의한 타입 import
import Image from "next/image";
import styles from "./index.module.css"; // 스타일 파일 생성 필요
import { User } from "@/store/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/data/firestore";

interface CartItemProps {
  item: SavedProduct;
  setUser: (user: User) => void;
}

const CartItem = ({ item, setUser }: CartItemProps) => {
  const user = useUserStore((state) => state.user);

  // 장바구니에서 상품 제거 함수
  const removeFromCart = async () => {
    if (!user?.uid) return;

    try {
      // 현재 user의 cartItems에서 해당 상품 제거
      const updatedCartItems =
        user.cartItems?.filter(
          (cartItem) => cartItem.productId !== item.productId
        ) || [];

      // Firestore 업데이트
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { cartItems: updatedCartItems });

      // 로컬 상태 업데이트
      setUser({
        ...user,
        cartItems: updatedCartItems,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("상품 제거 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>이미지 없음</div>
        )}
      </div>

      <div className={styles.itemInfo}>
        <h3 className={styles.productName}>{item.name}</h3>
        <p className={styles.productPrice}>￦{item.price.toLocaleString()}</p>
      </div>

      <button
        onClick={removeFromCart}
        className={styles.removeButton}
        aria-label="장바구니에서 제거"
      >
        삭제
      </button>
    </div>
  );
};

export default CartItem;

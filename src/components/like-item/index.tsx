"use client";

import { SavedProduct, useUserStore } from "@/store/userStore"; // User 인터페이스에서 정의한 타입 import
import Image from "next/image";
import styles from "./index.module.css"; // 스타일 파일 생성 필요
import { User } from "@/store/userStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/data/firestore";

interface LikeItemProps {
  item: SavedProduct;
  setUser: (user: User) => void;
}

const LikeItem = ({ item, setUser }: LikeItemProps) => {
  const user = useUserStore((state) => state.user);

  // 찜목록에서 상품 제거 함수
  const removeFromWishlist = async () => {
    if (!user?.uid) return;

    try {
      // 현재 user의 찜목록에서 해당 상품 제거
      const updatedWishLists =
        user.wishlist?.filter(
          (wishlist) => wishlist.productId !== item.productId
        ) || [];

      // Firestore 업데이트
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { cartItems: updatedWishLists });

      // 로컬 상태 업데이트
      setUser({
        ...user,
        wishlist: updatedWishLists,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("상품 제거 중 오류가 발생했습니다.");
    }
  };

  const addToCart = async (product: SavedProduct) => {
    if (!user?.uid || !product) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      // 현재 사용자 문서 참조
      const userRef = doc(db, "users", user.uid);

      // 최신 사용자 데이터 가져오기
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDoc.data();
      const cartItems = userData.cartItems || [];

      // 저장할 상품 정보
      const productInfo = {
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
      };

      // 이미 장바구니에 있는지 확인
      const existingItemIndex = cartItems.findIndex(
        (item: SavedProduct) => item.productId === product.productId
      );

      let newCartItems;
      if (existingItemIndex >= 0) {
        // 이미 있으면 반려
        alert("장바구니에 이미 있는 상품입니다.");
        return;
      } else {
        // 없으면 새로 추가
        newCartItems = [...cartItems, productInfo];
      }

      // Firestore 업데이트
      await updateDoc(userRef, { cartItems: newCartItems });

      // 사용자 스토어 업데이트
      setUser({
        ...user,
        cartItems: newCartItems,
      });

      alert("장바구니에 상품이 추가되었습니다.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
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
        onClick={() => {
          addToCart(item);
        }}
        className={styles.cartAddButton}
        aria-label="장바구니에 추가"
      >
        장바구니에 추가
      </button>
      <button
        onClick={removeFromWishlist}
        className={styles.removeButton}
        aria-label="찜목록에서 제거"
      >
        삭제
      </button>
    </div>
  );
};

export default LikeItem;

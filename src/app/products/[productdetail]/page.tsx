"use client";

import { fetchedProductsType } from "@/types/ProductType";
import styles from "./page.module.css";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SavedProduct, useUserStore } from "@/store/userStore";
import { db } from "@/data/firestore";

const ProductDetailPage = () => {
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const [product, setProduct] = useState<fetchedProductsType | null>(null);

  // 사용자 스토어에서 현재 사용자 정보 가져오기
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // 상품 찜 상태
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 상품 정보 설정 및 찜 상태 확인
  useEffect(() => {
    setProduct(selectedProduct);

    // 찜하기 상태 확인
    const checkWishlistStatus = async () => {
      if (selectedProduct && user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const wishlist = userData.wishlist || [];
            // 상품 ID로 찜 목록에 있는지 확인
            setIsWishlisted(
              wishlist.some(
                (item: SavedProduct) => item.productId === selectedProduct.id
              )
            );
          }
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      }
    };

    checkWishlistStatus();
  }, [selectedProduct, user]);

  // 찜하기 토글 함수
  const toggleWishlist = async () => {
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
      const wishlist = userData.wishlist || [];

      // 저장할 상품 정보
      const productInfo = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      };

      let newWishlist;
      if (isWishlisted) {
        // 이미 찜한 상품이면 제거
        newWishlist = wishlist.filter(
          (item: SavedProduct) => item.productId !== product.id
        );
      } else {
        // 찜하지 않은 상품이면 추가
        newWishlist = [...wishlist, productInfo];
      }

      // Firestore 업데이트
      await updateDoc(userRef, { wishlist: newWishlist });

      // 로컬 상태 업데이트
      setIsWishlisted(!isWishlisted);

      // 사용자 스토어 업데이트
      setUser({
        ...user,
        wishlist: newWishlist,
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("찜하기 처리 중 오류가 발생했습니다.");
    }
  };

  // 장바구니에 추가하는 함수
  const addToCart = async () => {
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
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      };

      // 이미 장바구니에 있는지 확인
      const existingItemIndex = cartItems.findIndex(
        (item: SavedProduct) => item.productId === product.id
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

  if (!product) {
    return <div className={styles.wrapper}>상품 정보를 불러오는 중...</div>;
  }

  return (
    <div className={styles.wrapper}>
      {product.image && (
        <Image
          src={product.image}
          alt="product-image"
          width={300}
          height={400}
        ></Image>
      )}
      <div className={styles.info}>
        <p>{product.category}</p>
        <h2>{product.name}</h2>
        <p>￦{product.price.toLocaleString()}</p>
        <p>{product.description}</p>
        <div className={styles.btnBox}>
          <button onClick={addToCart}>장바구니 담기</button>
          <button onClick={toggleWishlist}>
            <Image
              src={isWishlisted ? "/heart-filled.svg" : "/heart.svg"}
              alt={isWishlisted ? "찜한 상품" : "찜하기"}
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

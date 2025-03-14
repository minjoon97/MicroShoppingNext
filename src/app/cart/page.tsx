"use client";

import { useUserStore } from "@/store/userStore";
import styles from "./page.module.css";
import CartItem from "@/components/cart-item";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.cartItems && user.cartItems.length > 0) {
      const sum = user.cartItems.reduce((total, item) => total + item.price, 0);
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [user?.cartItems]);

  const handlePayment = async () => {
    // 장바구니가 비어있는지 확인
    if (!user?.cartItems || user.cartItems.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    // 결제 진행 중 상태로 변경
    setIsProcessing(true);

    try {
      // API 라우트 호출하여 결제 처리 요청
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: user.cartItems,
          totalAmount: totalPrice,
          userId: user.uid,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 결제 성공 시 장바구니 비우기
        setUser({
          ...user,
          cartItems: [],
        });

        // 결제 완료 메시지 표시
        alert("결제가 완료되었습니다!");

        // 주문 완료 페이지로 이동 (orderId가 있는 경우)
        if (result.orderId) {
          router.push(`/order/success?orderId=${result.orderId}`);
        } else {
          router.push("/");
        }
      } else {
        // 결제 실패 시
        alert(
          `결제 실패: ${result.message || "알 수 없는 오류가 발생했습니다."}`
        );
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 결제 처리 상태 해제
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>장바구니</h2>
      {user?.cartItems && user.cartItems.length > 0 ? (
        <>
          {user.cartItems.map((item, index) => (
            <div key={index}>
              <CartItem item={item} setUser={setUser}></CartItem>
            </div>
          ))}
          <p className={styles.totalPrice}>
            총 금액 <span>￦{totalPrice.toLocaleString()}</span>
          </p>
          <div className={styles.payBtnBox}>
            <button
              className={styles.payBtn}
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "결제 처리 중..." : "결제하기"}
            </button>
          </div>
        </>
      ) : (
        <p className={styles.emptyCart}>장바구니가 비어있습니다.</p>
      )}
    </div>
  );
};

export default CartPage;

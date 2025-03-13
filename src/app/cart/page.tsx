"use client";

import { useUserStore } from "@/store/userStore";

import styles from "./page.module.css";
import CartItem from "@/components/cart-item";
import { useEffect, useState } from "react";

const CartPage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user?.cartItems && user.cartItems.length > 0) {
      const sum = user.cartItems.reduce((total, item) => total + item.price, 0);
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [user?.cartItems]);

  return (
    <div className={styles.wrapper}>
      <h2>장바구니</h2>
      {user?.cartItems &&
        user.cartItems.length > 0 &&
        user.cartItems.map((item, index) => (
          <div key={index}>
            <CartItem item={item} setUser={setUser}></CartItem>
          </div>
        ))}
      <p className={styles.totalPrice}>
        총 금액 <span>￦{totalPrice}</span>
      </p>
      <div className={styles.payBtnBox}>
        <button className={styles.payBtn}>결제하기</button>
      </div>
    </div>
  );
};

export default CartPage;

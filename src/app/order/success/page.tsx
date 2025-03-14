"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import styles from "./page.module.css";
import { SavedProduct } from "@/store/userStore";
import { db } from "@/data/firestore";

// 주문 데이터 타입 정의
interface OrderDetails {
  orderId: string;
  userId: string;
  items: SavedProduct[];
  totalAmount: number;
  status:
    | "paid"
    | "processing"
    | "shipping"
    | "delivered"
    | "canceled"
    | string;
  paymentMethod: string;
  createdAt?: Timestamp; // 선택적 타임스탬프 필드
  updatedAt?: Timestamp; // 선택적 타임스탬프 필드
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  // null 값을 허용하는 OrderDetails 타입의 상태 선언
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError("주문 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          // 문서 데이터를 OrderDetails 타입으로 변환
          const data = orderSnap.data();
          const orderData: OrderDetails = {
            orderId: data.orderId || orderSnap.id,
            userId: data.userId,
            items: data.items || [],
            totalAmount: data.totalAmount || 0,
            status: data.status || "paid",
            paymentMethod: data.paymentMethod || "direct",
            createdAt: data.createdAt, // Timestamp로 처리
            updatedAt: data.updatedAt,
          };

          setOrderDetails(orderData);
        } else {
          setError("주문 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("주문 정보 조회 중 오류:", error);
        setError("주문 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  // 날짜 포맷 함수
  const formatDate = (timestamp?: Timestamp | null): string => {
    if (!timestamp || !timestamp.toDate) return "날짜 정보 없음";

    const date = timestamp.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <Link href="/" className={styles.homeLink}>
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // orderDetails가 null인 경우 처리
  if (!orderDetails) {
    return (
      <div className={styles.errorContainer}>
        <h2>주문 정보를 찾을 수 없습니다</h2>
        <Link href="/" className={styles.homeLink}>
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successHeader}>
        <h1>주문이 완료되었습니다!</h1>
        <p className={styles.orderNumber}>주문번호: {orderId}</p>
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.orderSummary}>
          <h2>주문 요약</h2>
          <div className={styles.summaryItem}>
            <span>주문 상태:</span>
            <span className={styles.orderStatus}>
              {orderDetails.status === "paid"
                ? "결제 완료"
                : orderDetails.status}
            </span>
          </div>
          {orderDetails.createdAt && (
            <div className={styles.summaryItem}>
              <span>주문 일시:</span>
              <span>{formatDate(orderDetails.createdAt)}</span>
            </div>
          )}
          <div className={styles.summaryItem}>
            <span>총 결제 금액:</span>
            <span className={styles.totalAmount}>
              ￦{orderDetails.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span>결제 방식:</span>
            <span>
              {orderDetails.paymentMethod === "direct"
                ? "온라인 결제"
                : orderDetails.paymentMethod}
            </span>
          </div>
        </div>

        <div className={styles.orderItems}>
          <h2>주문 상품</h2>
          <ul className={styles.itemList}>
            {orderDetails.items.map((item, index) => (
              <li key={index} className={styles.item}>
                {item.image && (
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                )}
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>
                    ￦{item.price.toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/mypage/orders" className={styles.orderHistoryButton}>
          주문 내역 보기
        </Link>
        <Link href="/" className={styles.continueShoppingButton}>
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}

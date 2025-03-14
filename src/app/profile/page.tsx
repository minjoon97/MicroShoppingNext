"use client";

import { useUserStore, SavedProduct } from "@/store/userStore";
import styles from "./page.module.css";
import LikeItem from "@/components/like-item";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/data/firestore";

// 주문 타입 정의
interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  items: SavedProduct[];
  status:
    | "paid"
    | "processing"
    | "shipping"
    | "delivered"
    | "canceled"
    | string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  paymentMethod: string;
}

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 주문 내역 가져오기
  useEffect(() => {
    async function fetchOrders() {
      if (!user?.uid) return;

      try {
        // 사용자 ID로 주문 내역 조회
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(ordersQuery);
        const ordersList: Order[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersList.push({
            id: doc.id,
            orderId: data.orderId || doc.id,
            totalAmount: data.totalAmount || 0,
            items: (data.items || []) as SavedProduct[],
            status: data.status || "paid",
            createdAt: data.createdAt as Timestamp,
            updatedAt: data.updatedAt as Timestamp,
            userId: data.userId,
            paymentMethod: data.paymentMethod || "direct",
          });
        });

        setOrders(ordersList);
      } catch (error) {
        console.error("주문 내역 조회 중 오류:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user?.uid]);

  // 날짜 포맷 함수
  const formatDate = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp || !timestamp.toDate) return "날짜 정보 없음";

    const date = timestamp.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 주문 상태 한글화
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      paid: "결제 완료",
      processing: "처리 중",
      shipping: "배송 중",
      delivered: "배송 완료",
      canceled: "주문 취소",
    };

    return statusMap[status] || status;
  };

  return (
    <div className={styles.wrapper}>
      <h2>나의 프로필</h2>
      <div className={styles.profileBox}>
        <p>
          이름 <span>{user?.displayName}</span>
        </p>
        <p>
          이메일 <span>{user?.email}</span>
        </p>
        <p>
          계정상태 <span>{user?.role === "user" ? "구매자" : "관리자"}</span>
        </p>
      </div>

      <h2>내가 찜한 목록</h2>
      {user?.wishlist && user.wishlist.length > 0 ? (
        user.wishlist.map((item, index) => (
          <div key={index}>
            <LikeItem item={item} setUser={setUser}></LikeItem>
          </div>
        ))
      ) : (
        <p className={styles.emptyList}>찜한 상품이 없습니다.</p>
      )}

      <h2>주문 내역</h2>
      {loading ? (
        <p className={styles.loading}>주문 내역을 불러오는 중...</p>
      ) : orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderItem}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <p className={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </p>
                  <p className={styles.orderId}>
                    주문번호: {order.orderId || order.id}
                  </p>
                </div>
                <div className={styles.orderStatus}>
                  <span
                    className={`${styles.statusBadge} ${styles[order.status]}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.orderProducts}>
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className={styles.productPreview}>
                      {item.image && (
                        <div className={styles.productImage}>
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <p className={styles.productName}>{item.name}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className={styles.moreItems}>
                      외 {order.items.length - 2}개 상품
                    </p>
                  )}
                </div>
                <div className={styles.orderTotal}>
                  <p>총 주문금액</p>
                  <p className={styles.totalPrice}>
                    ￦{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className={styles.orderActions}>
                <Link
                  href={`/order/success?orderId=${order.id}`}
                  className={styles.orderDetailBtn}
                >
                  주문 상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyList}>주문 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default ProfilePage;

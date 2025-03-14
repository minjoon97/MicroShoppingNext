import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/data/firestore";
import { PaymentRequest, PaymentResponse } from "./type";

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const data = (await request.json()) as PaymentRequest;
    const { items, totalAmount, userId } = data;

    // 필수 데이터 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json<PaymentResponse>(
        { success: false, message: "유효하지 않은 상품 정보입니다." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json<PaymentResponse>(
        { success: false, message: "사용자 정보가 없습니다." },
        { status: 400 }
      );
    }

    // 주문 ID 생성 (현재 타임스탬프 + 랜덤 숫자 조합)
    const orderPrefix = "ORD";
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `${orderPrefix}${timestamp}${randomStr}`;

    // Firebase Firestore에 주문 정보 저장
    const orderData = {
      orderId,
      userId,
      items,
      totalAmount,
      status: "paid", // 주문 상태 (paid, processing, shipped, delivered 등)
      createdAt: serverTimestamp(),
      paymentMethod: "direct", // 결제 방식 (필요시 변경)
      updatedAt: serverTimestamp(),
    };

    // orders 컬렉션에 새 문서 추가
    const orderRef = await addDoc(collection(db, "orders"), orderData);
    const firestoreOrderId = orderRef.id;

    // 사용자 문서에 주문 내역 업데이트 (선택적)
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        orders: arrayUnion(firestoreOrderId), // 주문 ID 배열에 추가
        cartItems: [], // 장바구니 비우기
        updatedAt: serverTimestamp(),
      });
    } catch (userUpdateError) {
      console.error("사용자 문서 업데이트 중 오류:", userUpdateError);
      // 사용자 문서 업데이트 실패해도 주문은 성공으로 처리
    }

    // 결제 성공 응답
    return NextResponse.json<PaymentResponse>({
      success: true,
      message: "결제가 성공적으로 처리되었습니다.",
      orderId: firestoreOrderId,
    });
  } catch (error) {
    console.error("결제 처리 중 오류:", error);

    return NextResponse.json<PaymentResponse>(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

import { SavedProduct } from "@/store/userStore";

// 결제 요청 타입 정의
export interface PaymentRequest {
  // 장바구니 상품 배열 (SavedProduct 타입 사용)
  items: SavedProduct[];

  // 총 결제 금액
  totalAmount: number;

  // 사용자 ID (Firebase uid)
  userId: string;
}

// 결제 응답 타입 정의
export interface PaymentResponse {
  // 결제 성공 여부
  success: boolean;

  // 결제 결과 메시지
  message: string;

  // 주문 ID (성공 시에만 존재)
  orderId?: string;
}

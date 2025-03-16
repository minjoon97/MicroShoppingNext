"use client";

import { Suspense } from "react";
import OrderSuccessContent from "@/components/order-success";

// 로딩 상태를 표시할 컴포넌트
function LoadingFallback() {
  return (
    <div>
      <p>주문 정보를 불러오는 중...</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

// src/store/useProductStore.ts
"use client";

import { fetchedProductsType } from "@/types/ProductType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 스토어 상태 인터페이스 정의
interface ProductState {
  selectedProduct: fetchedProductsType | null;
  setSelectedProduct: (product: fetchedProductsType) => void;
  clearSelectedProduct: () => void;
}

// 타입이 정의된 Zustand 스토어 생성
export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      // 상태
      selectedProduct: null,

      // 액션
      setSelectedProduct: (product: fetchedProductsType) =>
        set({ selectedProduct: product }),
      clearSelectedProduct: () => set({ selectedProduct: null }),
    }),
    {
      name: "product-storage", // localStorage에 저장될 키 이름
    }
  )
);

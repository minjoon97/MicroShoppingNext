import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User 인터페이스 수정
export interface SavedProduct {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

export interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  role: string;
  wishlist?: SavedProduct[]; // 찜 목록에 상품 정보 저장
  cartItems?: SavedProduct[]; // 장바구니에도 상품 정보 저장
}

// 스토어 상태 타입 정의
interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// 초기 상태
const initialUser: User | null = null;

// Zustand 스토어 생성 (persist 미들웨어 적용)
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: initialUser,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

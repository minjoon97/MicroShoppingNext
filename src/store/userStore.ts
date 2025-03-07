import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User 타입 정의
export interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  role: string;
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

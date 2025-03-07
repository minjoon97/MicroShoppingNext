"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/data/firestore";
import { useUserStore } from "@/store/userStore"; // Zustand store import

import styles from "./index.module.css";

const LoginSection = () => {
  // 로컬 상태 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Zustand 상태 설정 함수
  const setUser = useUserStore((state) => state.setUser);

  // 로그인 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      // Firebase Authentication으로 로그인
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore에서 사용자 정보 가져오기 (role 포함)
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        // 사용자 정보와 role을 Zustand 상태에 저장
        const userData = userDoc.data();
        const userInfo = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          role: userData.role || "user", // role 정보 가져오기 (없으면 'user' 기본값 사용)
        };
        setUser(userInfo);

        console.log("로그인 성공:", userData.role);
        // 여기서 로그인 성공 후 리디렉션
      } else {
        // 사용자 문서가 없는 경우 기본 정보만 설정
        const userInfo = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          role: "user",
        };
        setUser(userInfo);
        console.log("사용자 문서가 없습니다. 기본 역할 사용: user");
      }

      // 입력 필드 초기화
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("로그인 에러:", error);

      // 에러를 AuthError로 타입 캐스팅
      const authError = error as AuthError;

      // 에러 메시지 설정
      if (
        authError.code === "auth/user-not-found" ||
        authError.code === "auth/wrong-password"
      ) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다");
      } else if (authError.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다");
      } else if (authError.code === "auth/too-many-requests") {
        setError(
          "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요"
        );
      } else {
        setError("로그인 중 오류가 발생했습니다: " + authError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>로그인</h2>

      {/* 에러 메시지 */}
      {error && <div>{error}</div>}

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputBox}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.loginBtn} type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
};

export default LoginSection;

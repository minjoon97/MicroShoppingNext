"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/data/firestore";
import { FirebaseError } from "firebase/app";

import styles from "./index.module.css";

const CreateSection = () => {
  // 상태 관리
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // 역할 상태 추가 (기본값은 'user')
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 회원가입 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Firebase Authentication에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        role: role, // 선택한 역할로 저장
        createdAt: serverTimestamp(),
      });

      // 성공 메시지 표시
      setSuccess("회원가입이 완료되었습니다. 로그인해주세요.");

      // 입력 필드 초기화
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      // error를 FirebaseError로 타입 캐스팅
      const firebaseError = error as FirebaseError;
      console.error("회원가입 에러:", firebaseError);
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다");
      } else {
        setError("회원가입 중 오류가 발생했습니다: " + firebaseError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>회원가입</h2>

      {/* 에러 메시지 */}
      {error && <div>{error}</div>}

      {/* 성공 메시지 */}
      {success && <div>{success}</div>}

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div className={styles.inputBox}>
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* 역할 선택 */}
        <div className={styles.inputBox}>
          <label>계정 유형</label>
          <div className={styles.radioBox}>
            <div>
              <input
                id="role-user"
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              <label htmlFor="role-user">일반 사용자</label>
            </div>
            <div>
              <input
                id="role-admin"
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              <label htmlFor="role-admin">관리자</label>
            </div>
          </div>
        </div>

        <button className={styles.createBtn} type="submit" disabled={loading}>
          {loading ? "처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default CreateSection;

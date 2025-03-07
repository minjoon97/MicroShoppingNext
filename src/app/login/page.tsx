import LoginSection from "@/components/login-section";
import Link from "next/link";
import styles from "./page.module.css";

const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <LoginSection></LoginSection>
      <Link className={styles.createBtn} href="/login/create">
        <p>회원가입하기</p>
      </Link>
    </div>
  );
};

export default LoginPage;

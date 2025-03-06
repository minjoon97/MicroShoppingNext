import LoginSection from "@/components/login-section";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div>
      <LoginSection></LoginSection>
      <Link href="/login/create">
        <button>회원가입하기</button>
      </Link>
    </div>
  );
};

export default LoginPage;

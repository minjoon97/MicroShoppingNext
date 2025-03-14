"use client";

import { useUserStore } from "@/store/userStore";

import styles from "./page.module.css";
import LikeItem from "@/components/like-item";

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  return (
    <div className={styles.wrapper}>
      <h2>나의 프로필</h2>
      <div className={styles.profileBox}>
        <p>
          이름 <span>{user?.displayName}</span>
        </p>
        <p>
          이메일 <span>{user?.email}</span>
        </p>
        <p>
          계정상태 <span>{user?.role === "user" ? "구매자" : "관리자"}</span>
        </p>
      </div>
      <h2>내가 찜한 목록</h2>
      {user?.wishlist &&
        user.wishlist.length > 0 &&
        user.wishlist.map((item, index) => (
          <div key={index}>
            <LikeItem item={item} setUser={setUser}></LikeItem>
          </div>
        ))}
    </div>
  );
};

export default ProfilePage;

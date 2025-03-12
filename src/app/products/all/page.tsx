"use client";

import { Suspense } from "react";
import styles from "./page.module.css";
import SearchResults from "@/components/search-result";

// 로딩 상태를 표시할 컴포넌트
function LoadingFallback() {
  return <div>로딩 중...</div>;
}

export default function SearchPage() {
  return (
    <div className={styles.wrapper}>
      <Suspense fallback={<LoadingFallback />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

export type fetchedRecommendsType = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

// 상품 추가용 타입 (id 없음)
export type addRecommendType = {
  name: string;
  category: string;
  price: number;
  image: File;
};

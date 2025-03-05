export type fetchedMainvisualsType = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

// 상품 추가용 타입 (id 없음)
export type addMainvisualType = {
  title: string;
  subtitle: string;
  image: File;
};

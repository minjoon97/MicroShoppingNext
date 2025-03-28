export type fetchedProductsType = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
};

// 상품 추가용 타입 (id 없음)
export type addProductType = {
  name: string;
  category: string;
  description: string;
  price: number;
  image: File;
};

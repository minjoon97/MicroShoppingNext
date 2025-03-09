import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { addProductType, fetchedProductsType } from "@/types/ProductType";
import { db, storage } from "./firestore";

//product전체 불러오기
export async function fetchProducts() {
  const fetchedProducts: fetchedProductsType[] = [];

  const querySnapshot = await getDocs(collection(db, "products"));

  if (querySnapshot.empty) {
    return [];
  }

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());

    const aProduct = {
      id: doc.id,
      name: doc.data()["name"],
      category: doc.data()["category"],
      price: doc.data()["price"],
      image: doc.data()["image"],
    };

    fetchedProducts.push(aProduct);
  });

  return fetchedProducts;
}

//product 추가하기
export async function addProduct({
  name,
  category,
  price,
  image,
}: addProductType) {
  const newProductRef = doc(collection(db, "products"));

  //productId추출
  const productId = newProductRef.id;

  const storageRef = ref(storage, `products/${productId}`);

  await uploadBytes(storageRef, image);

  const imageUrl = await getDownloadURL(storageRef);

  const newProductData = {
    id: productId,
    name: name,
    category: category,
    price: price,
    image: imageUrl,
  };

  await setDoc(newProductRef, newProductData);

  return newProductData;
}

//product 삭제하기
export async function deleteProduct(productId: string) {
  try {
    // 1. Firestore에서 상품 데이터 삭제
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);

    // 2. Storage에서 이미지 삭제
    const storageRef = ref(storage, `products/${productId}`);
    await deleteObject(storageRef);

    return {
      success: true,
      message: "상품이 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("상품 삭제 중 오류 발생:", error);
    return {
      success: false,
      message: "상품 삭제 중 오류가 발생했습니다.",
    };
  }
}

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

import { db, storage } from "./firestore";
import { addRecommendType, fetchedRecommendsType } from "@/types/RecommendType";

//recommend전체 불러오기
export async function fetchRecommends() {
  const fetchedRecommends: fetchedRecommendsType[] = [];

  const querySnapshot = await getDocs(collection(db, "recommend"));

  if (querySnapshot.empty) {
    return [];
  }

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());

    const aRecommend = {
      id: doc.id,
      name: doc.data()["name"],
      category: doc.data()["category"],
      price: doc.data()["price"],
      image: doc.data()["image"],
    };

    fetchedRecommends.push(aRecommend);
  });

  return fetchedRecommends;
}

//recommend 추가하기
export async function addRecommend({
  name,
  category,
  price,
  image,
}: addRecommendType) {
  const newRecommendRef = doc(collection(db, "recommend"));

  //recommendId추출
  const recommendId = newRecommendRef.id;

  const storageRef = ref(storage, `recommend/${recommendId}`);

  await uploadBytes(storageRef, image);

  const imageUrl = await getDownloadURL(storageRef);

  const newRecommendData = {
    id: recommendId,
    name: name,
    category: category,
    price: price,
    image: imageUrl,
  };

  await setDoc(newRecommendRef, newRecommendData);

  return newRecommendData;
}

export async function deleteRecommend(recommendId: string) {
  try {
    // 1. Firestore에서 추천 상품 데이터 삭제
    const recommendRef = doc(db, "recommend", recommendId);
    await deleteDoc(recommendRef);

    // 2. Storage에서 이미지 삭제
    const storageRef = ref(storage, `recommend/${recommendId}`);
    await deleteObject(storageRef);

    return {
      success: true,
      message: "추천 상품이 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("추천 상품 삭제 중 오류 발생:", error);
    return {
      success: false,
      message: "추천 상품 삭제 중 오류가 발생했습니다.",
    };
  }
}

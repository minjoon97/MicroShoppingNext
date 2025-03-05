import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "./firestore";
import { addRecommendType, fetchedRecommendsType } from "@/types/RecommendType";

//product전체 불러오기
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

//product 추가하기
export async function addRecommend({
  name,
  category,
  price,
  image,
}: addRecommendType) {
  const newRecommendRef = doc(collection(db, "recommend"));

  //productId추출
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

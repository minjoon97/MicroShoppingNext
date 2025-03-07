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
import {
  addMainvisualType,
  fetchedMainvisualsType,
} from "@/types/MainvisualType";

//product전체 불러오기
export async function fetchMainvisual() {
  const fetchedMainvisuals: fetchedMainvisualsType[] = [];

  const querySnapshot = await getDocs(collection(db, "mainvisual"));

  if (querySnapshot.empty) {
    return [];
  }

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());

    const aMainvisual = {
      id: doc.id,
      title: doc.data()["title"],
      subtitle: doc.data()["subtitle"],
      image: doc.data()["image"],
    };

    fetchedMainvisuals.push(aMainvisual);
  });

  return fetchedMainvisuals;
}

//product 추가하기
export async function addMainvisual({
  title,
  subtitle,
  image,
}: addMainvisualType) {
  const newMainvisualRef = doc(collection(db, "mainvisual"));

  //productId추출
  const MainvisualId = newMainvisualRef.id;

  const storageRef = ref(storage, `mainvisuals/${MainvisualId}`);

  await uploadBytes(storageRef, image);

  const imageUrl = await getDownloadURL(storageRef);

  const newMainvisualData = {
    id: MainvisualId,
    title: title,
    subtitle: subtitle,
    image: imageUrl,
  };

  await setDoc(newMainvisualRef, newMainvisualData);

  return newMainvisualData;
}

export async function deleteMainvisual(mainvisualId: string) {
  try {
    // 1. Firestore에서 데이터 삭제
    const mainvisualRef = doc(db, "mainvisual", mainvisualId);
    await deleteDoc(mainvisualRef);

    // 2. Storage에서 이미지 삭제
    const storageRef = ref(storage, `mainvisuals/${mainvisualId}`);
    await deleteObject(storageRef);

    return {
      success: true,
      message: "메인 비주얼이 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("메인 비주얼 삭제 중 오류 발생:", error);
    return {
      success: false,
      message: "메인 비주얼 삭제 중 오류가 발생했습니다.",
    };
  }
}

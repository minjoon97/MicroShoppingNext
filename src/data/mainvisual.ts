import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

  const storageRef = ref(storage, `products/${MainvisualId}`);

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

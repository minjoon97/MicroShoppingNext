import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

import { addProductType, fetchedProductsType } from "@/types/fetchedProducts";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDERID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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

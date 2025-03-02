import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

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
    };

    fetchedProducts.push(aProduct);
  });

  return fetchedProducts;
}

//product 추가하기
export async function addProduct({ name, category, price }: addProductType) {
  const newProductRef = doc(collection(db, "products"));

  const newProductData = {
    id: newProductRef.id,
    name: name,
    category: category,
    price: price,
  };

  await setDoc(newProductRef, newProductData);

  return newProductData;
}

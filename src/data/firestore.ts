import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { fetchedProductsType } from "@/types/fetchedProducts";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDERID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function fetchProducts() {
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

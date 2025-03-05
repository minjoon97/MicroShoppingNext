import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

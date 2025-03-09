import { fetchProducts, addProduct, deleteProduct } from "@/data/products";
import { addProductType, fetchedProductsType } from "@/types/ProductType";
import { useEffect, useState } from "react";

export function useProducts() {
  const [items, setItems] = useState<fetchedProductsType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const products = await fetchProducts();
      setItems(products);
    } catch (error) {
      console.error("상품 데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 상품 추가 함수
  const handleAdd = async (formData: addProductType) => {
    try {
      setLoading(true);

      const { name, category, price, image } = formData;

      if (!name || !category || !price || !image) {
        return { success: false, message: "모든 정보를 입력해주세요." };
      }

      const newProduct = await addProduct({
        name,
        category,
        price,
        image,
      });

      // 성공 시 상태 업데이트 (새 항목 추가)
      setItems((prevItems) => [...prevItems, newProduct]);

      return { success: true, message: "상품이 추가되었습니다." };
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error);
      return { success: false, message: "상품 추가 중 오류가 발생했습니다." };
    } finally {
      setLoading(false);
    }
  };

  // 상품 삭제 함수
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const result = await deleteProduct(id);

      if (result.success) {
        // 성공 시 상태 업데이트 (항목 제거)
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return { success: true, message: "상품이 삭제되었습니다." };
      } else {
        return {
          success: false,
          message: result.message || "삭제에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
      return { success: false, message: "상품 삭제 중 오류가 발생했습니다." };
    } finally {
      setLoading(false);
    }
  };

  // 새로고침 함수
  const refreshData = () => {
    fetchData();
  };

  return { items, loading, handleAdd, handleDelete, refreshData };
}

import {
  fetchProducts,
  addProduct,
  deleteProduct,
  fetchProductsByCategory,
} from "@/data/products";
import { addProductType, fetchedProductsType } from "@/types/ProductType";
import { useEffect, useState } from "react";

export function useProducts(category?: string) {
  const [items, setItems] = useState<fetchedProductsType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      let products;

      // 카테고리가 제공되면 해당 카테고리의 제품만 가져오고, 아니면 모든 제품 가져오기
      if (category) {
        products = await fetchProductsByCategory(category);
      } else {
        products = await fetchProducts();
      }

      setItems(products);
    } catch (error) {
      console.error("상품 데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]); // category가 변경될 때마다 데이터 다시 가져오기

  // 상품 추가 함수
  const handleAdd = async (formData: addProductType) => {
    try {
      setLoading(true);

      const { name, category: productCategory, price, image } = formData;

      if (!name || !productCategory || !price || !image) {
        return { success: false, message: "모든 정보를 입력해주세요." };
      }

      const newProduct = await addProduct({
        name,
        category: productCategory,
        price,
        image,
      });

      // 성공 시 상태 업데이트 (새 항목 추가)
      // 현재 선택된 카테고리와 제품의 카테고리가 일치하거나 카테고리가 선택되지 않은 경우에만 추가
      if (!category || newProduct.category === category) {
        setItems((prevItems) => [...prevItems, newProduct]);
      }

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

  return {
    items,
    loading,
    handleAdd,
    handleDelete,
    refreshData,
  };
}

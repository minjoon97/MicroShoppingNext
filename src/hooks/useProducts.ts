import {
  fetchProducts,
  addProduct,
  deleteProduct,
  fetchProductsByCategory,
  searchProductsByName,
} from "@/data/products";
import { addProductType, fetchedProductsType } from "@/types/ProductType";
import { useEffect, useState, useCallback } from "react";

export function useProducts(category?: string, searchQuery?: string) {
  const [items, setItems] = useState<fetchedProductsType[]>([]);
  const [loading, setLoading] = useState(true);

  // useCallback을 사용하여 함수를 메모이제이션
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let products;

      // 검색어가 있는 경우
      if (searchQuery && searchQuery.trim() !== "") {
        products = await searchProductsByName(searchQuery);

        // 검색 결과에서 카테고리 필터링 (카테고리가 지정된 경우)
        if (category) {
          products = products.filter(
            (product) => product.category === category
          );
        }
      }
      // 검색어가 없는 경우
      else {
        // 카테고리가 지정된 경우 해당 카테고리 상품만 가져오기
        if (category) {
          products = await fetchProductsByCategory(category);
        }
        // 카테고리도 없는 경우 전체 상품 가져오기
        else {
          products = await fetchProducts();
        }
      }

      setItems(products);
    } catch (error) {
      console.error("상품 데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]); // 의존성 배열에 category와 searchQuery 포함

  useEffect(() => {
    fetchData();
  }, [fetchData]); // 의존성 배열에 fetchData만 포함

  // 상품 추가 함수
  const handleAdd = async (formData: addProductType) => {
    try {
      setLoading(true);

      const {
        name,
        category: productCategory,
        description,
        price,
        image,
      } = formData;

      if (!name || !productCategory || !price || !description || !image) {
        return { success: false, message: "모든 정보를 입력해주세요." };
      }

      const newProduct = await addProduct({
        name,
        category: productCategory,
        description,
        price,
        image,
      });

      // 성공 시 상태 업데이트 (새 항목 추가)
      // 현재 선택된 카테고리와 제품의 카테고리가 일치하거나 카테고리가 선택되지 않은 경우에만 추가
      // 또한 검색어가 있는 경우 검색어와 일치하는지 확인
      if (
        (!category || newProduct.category === category) &&
        (!searchQuery ||
          newProduct.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
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

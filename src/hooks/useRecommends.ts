import {
  fetchRecommends,
  addRecommend,
  deleteRecommend,
} from "@/data/recommend";
import { addRecommendType, fetchedRecommendsType } from "@/types/RecommendType";
import { useEffect, useState } from "react";

export function useRecommends() {
  const [items, setItems] = useState<fetchedRecommendsType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const recommends = await fetchRecommends();
      setItems(recommends);
    } catch (error) {
      console.error("추천 상품 데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 추천 상품 추가 함수
  const handleAdd = async (formData: addRecommendType) => {
    try {
      setLoading(true);

      const { name, category, price, image } = formData;

      if (!name || !category || !price || !image) {
        return { success: false, message: "모든 정보를 입력해주세요." };
      }

      const newRecommend = await addRecommend({
        name,
        category,
        price,
        image,
      });

      // 서버에서 최신 데이터 가져오기
      setItems((prevItems) => [...prevItems, newRecommend]);

      return { success: true, message: "추천 상품이 추가되었습니다." };
    } catch (error) {
      console.error("추천 상품 추가 중 오류 발생:", error);
      return {
        success: false,
        message: "추천 상품 추가 중 오류가 발생했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  // 추천 상품 삭제 함수
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const result = await deleteRecommend(id);

      if (result.success) {
        // 성공 시 상태 업데이트 (항목 제거)
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return { success: true, message: "추천 상품이 삭제되었습니다." };
      } else {
        return {
          success: false,
          message: result.message || "삭제에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("추천 상품 삭제 중 오류 발생:", error);
      return {
        success: false,
        message: "추천 상품 삭제 중 오류가 발생했습니다.",
      };
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

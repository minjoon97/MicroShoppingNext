import {
  fetchMainvisual,
  deleteMainvisual,
  addMainvisual,
} from "@/data/mainvisual";
import {
  addMainvisualType,
  fetchedMainvisualsType,
} from "@/types/MainvisualType";
import { useEffect, useState } from "react";

export function useMainvisuals() {
  const [items, setItems] = useState<fetchedMainvisualsType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const mainvisuals = await fetchMainvisual();
      setItems(mainvisuals);
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 추가 함수
  const handleAdd = async (formData: addMainvisualType) => {
    try {
      setLoading(true);

      const { title, subtitle, image } = formData;

      if (!title || !subtitle || !image) {
        return { success: false, message: "모든 정보를 입력해주세요." };
      }

      const newMainvisual = await addMainvisual({
        title,
        subtitle,
        image,
      });

      // 성공 시 상태 업데이트 (새 항목 추가)
      setItems((prevItems) => [...prevItems, newMainvisual]);

      return { success: true, message: "메인 비주얼이 추가되었습니다." };
    } catch (error) {
      console.error("추가 중 오류 발생:", error);
      return {
        success: false,
        message: "메인 비주얼 추가 중 오류가 발생했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  // 삭제 함수
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const result = await deleteMainvisual(id);

      if (result.success) {
        // 성공 시 상태 업데이트 (항목 제거)
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return { success: true, message: "삭제되었습니다." };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      return { success: false, message: "삭제 중 오류가 발생했습니다." };
    } finally {
      setLoading(false);
    }
  };

  // 새로고침 함수
  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  return { items, loading, handleAdd, handleDelete, refreshData };
}

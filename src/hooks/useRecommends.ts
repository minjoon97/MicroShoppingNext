import { fetchRecommends } from "@/data/recommend";
import { fetchedRecommendsType } from "@/types/RecommendType";
import { useEffect, useState } from "react";

export function useRecommends() {
  const [items, setItems] = useState<fetchedRecommendsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const recommends = await fetchRecommends();
      setItems(recommends);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { items, loading };
}

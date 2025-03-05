import { fetchMainvisual } from "@/data/mainvisual";
import { fetchedMainvisualsType } from "@/types/MainvisualType";
import { useEffect, useState } from "react";

export function useMainvisuals() {
  const [items, setItems] = useState<fetchedMainvisualsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const mainvisuals = await fetchMainvisual();
      setItems(mainvisuals);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { items, loading };
}

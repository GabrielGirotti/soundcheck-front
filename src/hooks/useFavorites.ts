import { useEffect, useState } from "react";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:4000/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener favoritos");
        }

        const data = await res.json();
        const ids = data.map((item: { _id: string }) => item._id);
        setFavoriteIds(ids);
        localStorage.setItem("favorites", JSON.stringify(ids)); // Opcional
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  const toggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/favorites/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavoriteIds((prev) => {
          const updated = prev.includes(id)
            ? prev.filter((fid) => fid !== id)
            : [...prev, id];

          localStorage.setItem("favorites", JSON.stringify(updated)); // Opcional
          return updated;
        });
      } else {
        console.error("Error del servidor al actualizar favorito.");
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  return { favoriteIds, toggleFavorite, isFavorite };
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

interface Instrument {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls?: string[];
  category?: string;
}

const UserPanel: React.FC<{ username: string | null }> = ({ username }) => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [favoriteInstruments, setFavoriteInstruments] = useState<Instrument[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userInstrumentsRes, favoritesRes] = await Promise.all([
          fetch(`http://localhost:4000/instruments/user/${username}`),
          fetch(`http://localhost:4000/favorites`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const instrumentsData = await userInstrumentsRes.json();
        const favoritesData = await favoritesRes.json();

        setInstruments(instrumentsData);
        setFavoriteInstruments(favoritesData);
      } catch (error) {
        console.error("Error cargando datos del usuario", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const handleEdit = (id: string) => {
    navigate(`/edit-instrument/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:4000/instruments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      setInstruments((prev) => prev.filter((inst) => inst._id !== id));
    } catch (error) {
      alert("No se pudo eliminar el producto");
    }
  };

  if (loading) return <Spinner />;

  const toggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:4000/favorites/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavoriteInstruments((prev) =>
          prev.some((fav) => fav._id === id)
            ? prev.filter((fav) => fav._id !== id)
            : prev
        );
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error);
    }
  };

  return (
    <div className="py-4 px-8">
      <h2 className="text-2xl text-white font-bold mb-6">Hola {username}</h2>

      <h3 className="text-lg text-white mb-4">
        Estos son tus productos publicados:
      </h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {instruments.length === 0 ? (
          <div className="text-white">No has publicado productos aún.</div>
        ) : (
          instruments.map((inst) => (
            <div
              key={inst._id}
              onClick={() => handleEdit(inst._id)}
              className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
            >
              {inst.imageUrls?.[0] && (
                <img
                  src={
                    inst.imageUrls[0].startsWith("http")
                      ? inst.imageUrls[0]
                      : `http://localhost:4000${inst.imageUrls[0]}`
                  }
                  alt={inst.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-white text-xl font-semibold">{inst.title}</h3>
              <p className="text-gray-400 pr-16 md:pr-24">{inst.description}</p>
              <div className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
                ${inst.price}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(inst._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(inst._id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="text-lg text-white mt-10 mb-4">Tus favoritos:</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {favoriteInstruments.length === 0 ? (
          <div className="text-white">No tienes favoritos guardados.</div>
        ) : (
          favoriteInstruments.map((inst) => {
            const isFavorite = true;
            return (
              <div
                key={inst._id}
                onClick={() => navigate(`/show-instrument/${inst._id}`)}
                className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
              >
                <button
                  onClick={(e) => toggleFavorite(e, inst._id)}
                  className={`absolute top-5 right-5 w-7 h-7 rounded-full  flex items-center justify-center transition-colors duration-300 ${
                    isFavorite
                      ? "bg-orange-100  border-2 border-orange-400 text-pink-600"
                      : "bg-transparent hover:border-2 hover:border-red-400 text-gray-400  hover:text-red-400 duration-300 transition"
                  }`}
                  aria-label={
                    isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </button>

                {inst.imageUrls?.[0] && (
                  <img
                    src={
                      inst.imageUrls[0].startsWith("http")
                        ? inst.imageUrls[0]
                        : `http://localhost:4000${inst.imageUrls[0]}`
                    }
                    alt={inst.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-white text-xl font-semibold">
                  {inst.title}
                </h3>
                <p className="text-gray-400 pr-16 md:pr-24">
                  {inst.description}
                </p>
                <div className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
                  ${inst.price}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default UserPanel;



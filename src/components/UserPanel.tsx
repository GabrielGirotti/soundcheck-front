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
  const [loading, setLoading] = useState(true);

  const [favoriteInstruments, setFavoriteInstruments] = useState<Instrument[]>(
    []
  );

  const fetchFavorites = async () => {
    const stored = localStorage.getItem("favorites");
    if (!stored) return;

    const ids = JSON.parse(stored) as string[];

    try {
      const res = await fetch(`http://localhost:4000/instruments`);
      const all = await res.json();
      const filtered = all.filter((inst: Instrument) => ids.includes(inst._id));
      setFavoriteInstruments(filtered);
    } catch (error) {
      console.error("Error cargando favoritos", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInstruments = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/instruments/user/${username}`
        );
        const data = await res.json();
        setInstruments(data);
      } catch (error) {
        setInstruments([]);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUserInstruments();
    fetchFavorites();
  }, [username]);

  if (loading) return <Spinner />;

  const handleEdit = (id: string) => {
    navigate(`/edit-instrument/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    const token = localStorage.getItem("token");
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
              onClick={() => handleEdit(inst._id)}
              key={inst._id}
              className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
            >
              {inst.imageUrls!?.length > 0 && inst.imageUrls![0] && (
                <img
                  src={
                    inst.imageUrls![0].startsWith("http")
                      ? inst.imageUrls![0]
                      : `http://localhost:4000${inst.imageUrls![0]}`
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
          favoriteInstruments.map((inst) => (
            <div
              key={inst._id}
              onClick={() => navigate(`/show-instrument/${inst._id}`)}
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
              <div className="flex justify-end mt-3"></div>
            </div>
          ))
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

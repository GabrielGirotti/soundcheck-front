import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/instruments/search?q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <Spinner />;
  if (results.length === 0)
    return (
      <div className="text-white p-4 flex flex-col items-center">
        No se encontraron resultados.
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          Volver al inicio
        </button>
      </div>
    );

  const handleClick = (_id: string) => {
    setResults([]);
    navigate(`/show-instrument/${_id}`, { replace: true });
  };

  return (
    <div className="py-4 px-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {results.map((inst) => (
          <div
            key={inst._id}
            onClick={() => handleClick(inst._id)}
            className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
          >
              {inst.imageUrls && inst.imageUrls.length > 0 && (
              <img
                src={`http://localhost:4000${inst.imageUrls[0]}`} // Primera imagen
                alt={inst.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h3 className="text-white text-xl font-semibold">{inst.title}</h3>
            <p className="text-gray-400 pr-16 md:pr-24">{inst.description}</p>
            <div className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
              ${inst.price}
            </div>
          </div>
        ))}
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

export default SearchResults;

import React, { useEffect, useState } from "react";
import { FilterNav } from "./FilterNav";
import HeroSlider from "./HeroSlider";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

interface Instrument {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrls?: string[];
  user?: string;
  category?: string;
}

const Home: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const res = await fetch("http://localhost:4000/instruments");
        const data = await res.json();
        setInstruments(data);
      } catch (error) {
        console.error("Error cargando instrumentos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  if (loading) return <Spinner />;

  if (instruments.length === 0)
    return <div className="text-white p-4">No hay instrumentos aún...</div>;

  const sortedInstruments = [...instruments].sort((a, b) =>
    b._id > a._id ? 1 : -1
  );

  // Filtrar instrumentos por categoría seleccionada y usuario
  const filteredInstruments = sortedInstruments.filter(
    (inst) =>
      (!selectedCategory || inst.category === selectedCategory) &&
      inst.user !== username
  );

  const handleClick = (_id: string) => {
    navigate(`show-instrument/${_id}`);
  };

  return (
    <>
      <HeroSlider />
      <FilterNav onCategorySelect={setSelectedCategory} />

      <div className="py-4 px-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredInstruments.map((inst) => (
          <div
            key={inst._id}
            onClick={() => handleClick(inst._id)}
            className="bg-slate-800 hover:bg-slate-700 hover:shadow-2xl  p-4 rounded-t-3xl rounded-l-3xl shadow relative hover:scale-105 transition duration-300 cursor-pointer"
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
    </>
  );
};

export default Home;

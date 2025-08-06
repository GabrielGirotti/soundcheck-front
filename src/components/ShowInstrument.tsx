import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

const ShowInstrument = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos actuales del instrumento
    const fetchInstrument = async () => {
      try {
        const res = await fetch(`http://localhost:4000/instruments/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description);
        setCategory(data.category);
        setImagePreviews(
          data.imageUrls?.map((url: string) => `http://localhost:4000${url}`) ||
            []
        );
        setUser(data.user);
      } catch (error) {
        toast.error("No se pudo cargar el instrumento");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchInstrument();
  }, [id, navigate]);

  if (loading) return <Spinner />;

  return (
    <>
      <div className="flex flex-col p-4 items-center">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {imagePreviews.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${title} ${index + 1}`}
              onClick={() => setSelectedImage(url)}
              className="w-[300px] h-[200px] object-cover rounded shadow cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>

        <div className="bg-black/50 p-6 rounded-xl w-[90vw] max-w-[500px] relative mt-4 mx-auto">
          <p className="text-xs text-slate-500 mb-2">{category}</p>
          <h2 className="text-2xl md:text-4xl font-bold pr-14">{title}</h2>

          <p className="mt-2 text-sm md:text-base pr-20 md:pr-24">
            {description}
          </p>

          <p className="mt-2 text-xs md:text-sm pr-20 md:pr-24 italic text-slate-500">
            Publicado por {user ? user : "Usuario desconocido"}
          </p>
          <span className="absolute bottom-0 right-0 bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 text-white text-xl font-semibold pr-4 pl-8 pb-4 pt-8 rounded-tl-full shadow-lg">
            ${price}
          </span>
        </div>
        <button
          onClick={() => navigate("")}
          className="w-[90vw] max-w-[500px] mx-auto mt-6 px-6 py-2 rounded bg-gradient-to-r from-orange-400 to-pink-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          Contactar con el vendedor
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-[90vw] max-w-[500px] hover:text-orange-400 text-slate-300 transition duration-300 border border-orange-400 text-xs p-2 rounded text-center mt-4 mx-auto"
        >
          Volver al inicio
        </button>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Ampliada"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-orange-500 transition"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default ShowInstrument;

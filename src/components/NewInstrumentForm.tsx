import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const NewInstrumentForm: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
      setImagePreviews(filesArray.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Por favor selecciona al menos una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("category", category);
    imageFiles.forEach((file) => {
      formData.append("images", file); // campo 'images' (plural) debe coincidir con backend
    });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4000/instruments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir instrumento");

      const data = await res.json();
      alert("Instrumento publicado con éxito");

      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setImageFiles([]);
      setImagePreviews([]);
      setCategory("");

      navigate("/");
    } catch (error) {
      alert("Error al publicar instrumento");
    }
  };

  const categories = [
    "Guitarras",
    "Bajos",
    "Baterías",
    "Teclados",
    "Vientos",
    "Cuerdas",
    "Percusión",
    "Accesorios",
  ];

  return (
    <div className="max-w-md mx-auto p-6 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Vender Instrumento</h2>
          <button
            onClick={() => navigate("/")}
            className="text-orange-400 hover:text-white font-semibold transition duration-300"
            type="button"
          >
            &larr; Volver
          </button>
        </div>

        <label className="block mb-2 text-gray-300">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block mb-2 text-gray-300">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-gray-300">Precio</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block mb-2 text-gray-300">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
          required
        />

        <label className="block mb-2 text-gray-300">
          Imágenes del instrumento
        </label>
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center px-4 py-6 bg-gray-800 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition">
            <svg
              className="w-8 h-8 mb-2 text-orange-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4h.01M12 20v-4"
              />
            </svg>
            <span>Haz clic para subir imágenes</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-32 object-cover rounded shadow"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-400 to-pink-600 hover:scale-105 text-white py-2 px-4 rounded transition duration-300"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default NewInstrumentForm;

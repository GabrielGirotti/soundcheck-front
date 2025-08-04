// import React, { useState, useEffect, ChangeEvent } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Spinner from "./Spinner";

// const EditInstrumentForm: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState<number | "">("");
//   const [description, setDescription] = useState("");
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [category, setCategory] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const fetchInstrument = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/instruments/${id}`);
//         const data = await res.json();
//         setTitle(data.title);
//         setPrice(data.price);
//         setDescription(data.description);
//         setCategory(data.category);
//         setImagePreviews(
//           data.imageUrls?.map((url: string) => `http://localhost:4000${url}`) ||
//             []
//         );
//       } catch (error) {
//         alert("No se pudo cargar el instrumento");
//         navigate("/panel");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInstrument();
//   }, [id, navigate]);

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setImageFiles((prev) => [...prev, ...filesArray]);
//       const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
//       setImagePreviews((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("price", price.toString());
//     formData.append("description", description);
//     formData.append("category", category);
//     imageFiles.forEach((file) => {
//       formData.append("images", file); // nombre debe coincidir con multer.array("images")
//     });

//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`http://localhost:4000/instruments/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Error al editar instrumento");

//       alert("Instrumento editado con éxito");
//       navigate("/panel");
//     } catch (error) {
//       alert("Error al editar instrumento");
//     }
//   };

//   const categories = [
//     "Guitarras",
//     "Bajos",
//     "Baterías",
//     "Teclados",
//     "Vientos",
//     "Cuerdas",
//     "Percusión",
//     "Accesorios",
//   ];

//   if (loading) return <Spinner />;

//   const handleRemoveImage = (index: number) => {
//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);

//     // También podrías eliminar de imageFiles si ya está cargada
//     const newFiles = [...imageFiles];
//     newFiles.splice(index, 1);
//     setImageFiles(newFiles);
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

//     setDeleting(true);
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`http://localhost:4000/instruments/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Error al eliminar producto");

//       alert("Producto eliminado con éxito");
//       navigate("/panel");
//     } catch (error) {
//       alert("No se pudo eliminar el producto");
//       console.error(error);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 rounded-md">
//       <form onSubmit={handleSubmit}>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl text-white">Editar Instrumento</h2>
//           <button
//             onClick={() => navigate("/panel")}
//             className="text-orange-400 hover:text-white font-semibold transition duration-300"
//             type="button"
//           >
//             &larr; Volver
//           </button>
//         </div>

//         <label className="block mb-2 text-gray-300">Título</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-2 rounded bg-gray-700 text-white mb-4"
//           required
//         />

//         <label className="block mb-2 text-gray-300">Categoría</label>
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="w-full p-2 rounded bg-gray-700 text-white mb-4"
//           required
//         >
//           <option value="" disabled>
//             Selecciona una categoría
//           </option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         <label className="block mb-2 text-gray-300">Precio</label>
//         <input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//           className="w-full p-2 rounded bg-gray-700 text-white mb-4"
//           required
//         />

//         <label className="block mb-2 text-gray-300">Descripción</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-2 rounded bg-gray-700 text-white mb-4"
//           required
//         />

//         <label className="block mb-2 text-gray-300">Imágenes (opcional)</label>
//         <div className="relative bg-gray-800 border border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center">
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//             className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
//           />
//           <span className="text-white">
//             Haz clic o arrastra para subir imágenes
//           </span>
//         </div>

//         {imagePreviews.length > 0 && (
//           <div className="grid grid-cols-2 gap-2 mb-4">
//             {imagePreviews.map((src, idx) => (
//               <div key={idx} className="relative">
//                 <img
//                   src={src}
//                   alt={`Preview ${idx + 1}`}
//                   className="rounded object-cover max-h-32 w-full"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(idx)}
//                   className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <button
//           type="submit"
//           className="bg-gradient-to-r from-orange-400 to-pink-600 hover:scale-105 text-white py-2 px-4 rounded transition duration-300 w-full my-2"
//         >
//           Guardar cambios
//         </button>

//         <button
//           type="button"
//           onClick={() => handleDelete(id!)}
//           className="border border-red-500 hover:bg-red-700 text-red-500 hover:text-white p-2 rounded mt-6 w-full flex justify-center items-center gap-2 disabled:opacity-60"
//           disabled={deleting}
//         >
//           {deleting ? (
//             <>
//               <Spinner />
//             </>
//           ) : (
//             "Eliminar instrumento"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditInstrumentForm;

import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";

const EditInstrumentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  useEffect(() => {
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
      } catch (error) {
        alert("No se pudo cargar el instrumento");
        navigate("/panel");
      } finally {
        setLoading(false);
      }
    };
    fetchInstrument();
  }, [id, navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    deletedImages.forEach((url) => formData.append("deletedImages", url));
    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("category", category);
    imageFiles.forEach((file) => {
      formData.append("images", file); // nombre debe coincidir con multer.array("images")
    });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/instruments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al editar instrumento");

      alert("Instrumento editado con éxito");
      navigate("/panel");
    } catch (error) {
      alert("Error al editar instrumento");
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

  if (loading) return <Spinner />;

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    const removed = newPreviews.splice(index, 1)[0]; // URL de la imagen eliminada
    setImagePreviews(newPreviews);

    const newFiles = [...imageFiles];
    if (index < imageFiles.length) {
      newFiles.splice(index, 1); // si es archivo nuevo, lo borramos directamente
    } else {
      // si es una imagen antigua (viene del backend), guardamos su URL para eliminar
      setDeletedImages((prev) => [...prev, removed]);
    }
    setImageFiles(newFiles);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    setDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/instruments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      alert("Producto eliminado con éxito");
      navigate("/panel");
    } catch (error) {
      alert("No se pudo eliminar el producto");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Editar Instrumento</h2>
          <button
            onClick={() => navigate("/panel")}
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

        <label className="block mb-2 text-gray-300">Imágenes (opcional)</label>
        <div className="relative bg-gray-800 border border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <span className="text-white">
            Haz clic o arrastra para subir imágenes
          </span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative">
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="rounded object-cover max-h-32 w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-pink-600 hover:scale-105 text-white py-2 px-4 rounded transition duration-300 w-full my-2"
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={() => handleDelete(id!)}
          className="border border-red-500 hover:bg-red-700 text-red-500 hover:text-white p-2 rounded mt-6 w-full flex justify-center items-center gap-2 disabled:opacity-60"
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Spinner />
            </>
          ) : (
            "Eliminar instrumento"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditInstrumentForm;

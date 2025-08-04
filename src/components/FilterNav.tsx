import React, { useEffect, useState } from "react";

interface FilterNavProps {
  onCategorySelect: (cat: string) => void;
}

export const FilterNav: React.FC<FilterNavProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="flex items-center gap-2 pl-8 overflow-x-auto mb-4 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategorySelect(cat)}
          className="whitespace-nowrap transition duration-300 bg-slate-800 hover:bg-gradient-to-r from-orange-400 to-pink-600 p-2 rounded-xl text-gray-400 hover:text-white font-normal text-sm"
        >
          {cat}
        </button>
      ))}
      <button
        onClick={() => onCategorySelect("")}
        className="whitespace-nowrap transition duration-300 bg-slate-800 hover:bg-gradient-to-r from-orange-400 to-pink-600 p-2 rounded-xl text-gray-400 hover:text-white font-normal text-sm"
      >
        Todas
      </button>
    </nav>
  );
};
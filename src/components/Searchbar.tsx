import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/instruments/search?q=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      setResults([]);
    }
  };

  const handleResultClick = (id: string) => {
    setResults([]);
    navigate(`/instrument/${id}`);
    if (onSearch) onSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setResults([]);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onSearch) onSearch();
      setQuery("");
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <form className="relative text-white" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar productos, instrumentos..."
          className="bg-slate-900 w-full pl-10 pr-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
      </form>

      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-slate-900 shadow-lg max-h-60 overflow-y-auto">
          {results.map((product) => (
            <li
              key={product._id}
              className="px-4 py-2 text-sm hover:bg-pink-600 cursor-pointer rounded-md"
              onClick={() => handleResultClick(product._id)}
            >
              {product.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

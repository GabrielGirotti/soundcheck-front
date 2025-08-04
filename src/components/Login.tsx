import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error en login");

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      onLogin(data.token, data.username);

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-md mt-9">
      <h2 className="text-2xl mb-4 text-white font-bold">Iniciar sesión</h2>
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="transition duration-300 w-full bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600  p-2 rounded text-white font-semibold"
        >
          Entrar
        </button>
      </form>
      <nav className="w-full flex flex-col justify-center gap-2 items-center p-4">
        <p className="font-black">Aun no tienes cuenta? </p>

        <Link
          to="/register"
          className="hover:text-orange-400 text-white transition duration-300"
        >
          Crea un presionando aqui
        </Link>

        <Link
          to="/forgot-password"
          className="w-full hover:text-orange-400 text-slate-300 transition duration-300 border border-orange-400 text-xs p-2 rounded text-center mt-2"
        >
          Recuperar credenciales
        </Link>
      </nav>
    </div>
  );
};

export default Login;

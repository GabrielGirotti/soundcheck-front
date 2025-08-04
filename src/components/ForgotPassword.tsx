import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);
  setError(null);

  try {
    const res = await fetch("http://localhost:4000/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al enviar email");
    setMessage(
      "Si el email existe, recibirás instrucciones para restablecer tu contraseña."
    );
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <div className="max-w-md mx-auto p-6 rounded-md mt-9">
      <h2 className="text-2xl mb-4 text-white font-bold">
        Recuperar contraseña
      </h2>
      {message && <p className="mb-2 text-green-400">{message}</p>}
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="transition duration-300 w-full bg-gradient-to-r hover:bg-gradient-to-l from-orange-400 to-pink-600 p-2 rounded text-white font-semibold"
        >
          Enviar instrucciones
        </button>
      </form>
      <button
        onClick={() => navigate("/")}
        className="w-full hover:text-orange-400 text-slate-300 transition duration-300 border border-orange-400 text-xs p-2 rounded text-center mt-4"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default ForgotPassword;

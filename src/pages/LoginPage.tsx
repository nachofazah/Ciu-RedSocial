import React, { useState, useContext, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const API_URL = "http://localhost:3001";
  const { setUser } = useContext(AuthContext);
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); //redirige

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== "123456") {
      setError("Contraseña incorrecta");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`);
      const users = await res.json();
      const foundUser = users.find((u: any) => u.nickName === nickName);

      if (!foundUser) {
        setError("Usuario no encontrado");
        return;
      }

      setUser(foundUser);
      setError("");

      navigate("/", { replace: true });

    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="NickName"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          Entrar
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </form>
    </div>
  );
};
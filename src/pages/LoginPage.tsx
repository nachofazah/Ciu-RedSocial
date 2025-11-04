import React, { useState, useContext, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers } from '../api/postService';
import type { User } from "../types/User";
import "../styles/LoginPage.css";
import logoUNAHUR from "../assets/logo-unahur.png";

const PASSWORD_FIJA = "123456";

export const LoginPage: React.FC = () => {
  const { user, login } = useContext(AuthContext);

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  // Manejo del tema (modo claro/oscuro)
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Redirección si el usuario ya está logueado
  useEffect(() => {
    if (user) {
      navigate('/profile', { replace: true }); 
    }
  }, [user, navigate]);

  // Lógica de Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!nickName || !password) {
      setError("Por favor, ingrese usuario y contraseña.");
      setIsLoading(false);
      return;
    }

    if (password !== PASSWORD_FIJA) {
      setError("Contraseña incorrecta");
      setIsLoading(false);
      return;
    }

    try {
      // Obtener todos los usuarios de la API (GET /users) usando el servicio
      const users: User[] = await fetchUsers();
      // Buscar usuario por nickName
      const foundUser = users.find(
        (u: User) => u.nickName.toLowerCase() === nickName.toLowerCase()
      );

      if (!foundUser) {
        setError("Usuario no encontrado");
        setIsLoading(false);
        return;
      }

      // Login exitoso: Llama a la función 'login' del contexto
      login(foundUser);

      } catch (err) {
      // Usa err.message si la API lanza un Error con mensaje
      setError((err as Error).message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/*modo claro/oscuro*/}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label="Cambiar modo"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      <form onSubmit={handleLogin} className="login-box">
        {/* Logo unahur*/}
        <img src={logoUNAHUR} alt="UNAHUR Logo" className="login-logo" />

        <h2>Iniciar Sesión</h2>

        <div className="form-group">
          <label htmlFor="nickName">Usuario</label>
          <input
            id="nickName"
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? "Verificando..." : "Entrar"}
        </button>

        <p className="register-link">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="register-highlight">
            Regístrate gratis
          </Link>
        </p>
      </form>
    </div>
  );
};
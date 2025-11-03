import React, { useState, useContext, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/LoginPage.css";
import logoUNAHUR from "../assets/logo-unahur.png";

export const LoginPage: React.FC = () => {
  const { setUser } = useContext(AuthContext);
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== "123456") {
      setError("Contraseña incorrecta");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users");
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

        <button type="submit" className="btn-login">
          Entrar
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
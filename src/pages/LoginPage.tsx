import { useState, useContext, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers } from '../api/postService';
import type { User } from "../types/User";
import { useTheme } from '../context/ThemeContext'; 
import style from '../styles/LoginPage.module.css'; 
import logoUNAHUR from "../assets/logo-unahur.png";

const PASSWORD_FIJA = "123456";

export function LoginPage() {
  const { user, login } = useContext(AuthContext);

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

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
      const users: User[] = await fetchUsers();
      const foundUser = users.find(
        (u: User) => u.nickName.toLowerCase() === nickName.toLowerCase()
      );

      if (!foundUser) {
        setError("Usuario no encontrado");
        setIsLoading(false);
        return;
      }

      login(foundUser);

      } catch (err) {
      setError((err as Error).message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style['login-container']}> 
      {/*modo claro/oscuro*/}
      <button 
          onClick={toggleTheme} 
          className={style.themeToggleFixed}
          title="Cambiar Modo de Vista"
          >
          {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <form onSubmit={handleLogin} className={style['login-box']}>
        {/* Logo unahur*/}
        <img src={logoUNAHUR} alt="UNAHUR Logo" className={style['login-logo']} />

        <h2>Iniciar Sesión</h2>

        <div className={style['form-group']}>
          <label htmlFor="nickName">Usuario</label>
          <input
            id="nickName"
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>

        <div className={style['form-group']}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className={style['error-message']}>{error}</p>}

        <button type="submit" className={style['btn-login']} disabled={isLoading}>
          {isLoading ? "Verificando..." : "Entrar"}
        </button>

        <p className={style['register-link']}>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className={style['register-highlight']}>
            Regístrate gratis
          </Link>
        </p>
        <p className={style['register-link']}>
          <Link to="/" className={style['register-highlight']}>
            Volver al Inicio
          </Link>
        </p>
      </form>
    </div>
  );
};
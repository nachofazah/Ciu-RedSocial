import { useEffect, useRef, useState, useContext } from "react";
import style from "../styles/RegistroUsuario.module.css";
import { Link } from "react-router-dom";
import { registerUser } from "../api/postService"; 
import logo from '../assets/logo-unahur.png'; 
import rightPanelImage from '../assets/unahur-img.jpg';
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from "../context/AuthContext";

interface FormValues {
    nickName: string;
    email: string;
}

interface Props {
    showNotification: (message: string) => void;
}

export default function RegistroUsuario({ showNotification }: Props) {
    const { theme, toggleTheme } = useTheme();
    const { login } = useContext(AuthContext);
    const timeoutRef = useRef<number | null>(null);
    const [formData, setFormData] = useState<FormValues>({
        nickName: "",
        email: "",
    });
    const [errorApi, setErrorApi] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ 
        nickName?: string; 
        email?: string; 
    }>({}); 

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const reiniciarTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const iniciarTimeout = (time: number) => {
        timeoutRef.current = window.setTimeout(() => {
            setErrors({});
            setErrorApi(null);
            timeoutRef.current = null;
        }, time);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return emailRegex.test(email);
    };

    const validateNickName = (nickName: string) => {
        const nickRegex = /^[a-zA-Z0-9]+$/;
        return (
            nickName.length >= 3 && nickName.length <= 20 && nickRegex.test(nickName)
        );
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        reiniciarTimeout();

        const newErrors: { nickName?: string; email?: string } = {};
        if (!validateNickName(formData.nickName)) {
            newErrors.nickName =
                "El nombre debe ser alfanumérico y tener entre 3 y 20 caracteres.";
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = "Correo electrónico inválido.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            iniciarTimeout(3000);
            return;
        }

        try {
            const registeredUser = await registerUser(formData);
            
            console.log("Usuario registrado con éxito:", registeredUser);
            
            setErrorApi(null);
            setFormData({ nickName: "", email: "" });
            // Loguear al usuario automáticamente en el contexto
            login(registeredUser);
            showNotification("Usuario registrado con éxito.");

        } catch (error: any) {
            iniciarTimeout(5000);
            const errorMessage = error.message || "Error desconocido al registrar el usuario.";
            setErrorApi(errorMessage);
            console.error("Error en registro:", error);
        }
    };

    return (
      <>
        <button 
                onClick={toggleTheme} 
                className={style.themeToggleFixed}
                title="Cambiar Modo de Vista"
            >
                {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className={style.registrationWrapper}>
            <div className={style.registrationFormPanel}>
                <img src={logo} alt="UNAHUR Logo" className={style.logo} />
                <h2 className={style.formTitle}>Crea una cuenta</h2>

                <form className={style.formulario} onSubmit={handleSubmit}>
                    {errorApi && (
                        <p className={style.apiError}>
                            {errorApi}
                        </p>
                    )}
                    
                    <label htmlFor="nickName">Usuario</label>
                    <input
                        type="text"
                        id="nickName"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        placeholder="Coloca tu usuario"
                        required
                    />
                    {errors.nickName && (
                        <p className={style.inputError}>{errors.nickName}</p>
                    )}
                    
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Coloca tu email"
                        required
                    />
                    {errors.email && <p className={style.inputError}>{errors.email}</p>}
                    
                    <div className={style.buttonWrapper}>
                        <button type="submit" className={style.botonSubmit}>
                            Registrarse
                        </button>
                    </div>

                    <p className={style.loginPrompt}>
                        ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
                    </p>
                </form>
            </div>

            <div className={style.registrationImagePanel}>
                <img src={rightPanelImage} alt="Edificio UNAHUR" className={style.panelImage} />
                <div className={style.panelTextOverlay}>
                    <h3>UnaHur Anti-Social Net</h3>
                    <p>Tu feed te espera con las últimas novedades. Registrate y comenzá a ver y agregar publicaciones de inmediato.</p>
                </div>
            </div>
        </div>
      </>  
    );
}
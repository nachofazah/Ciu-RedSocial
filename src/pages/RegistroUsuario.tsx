import { useEffect, useRef, useState } from "react";
import style from "./RegistroUsuario.module.css";

interface Props {
  showNotification: (message: string, onCloseDo?: () => void) => void;
}

export default function RegistroUsuario({showNotification}: Props) {
  const timeoutRef = useRef<number | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    nickName: "",
    email: "",
  });
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ nickName?: string; email?: string }>(
    {}
  );
  
  // limpiar timeout al desmontar el componente
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

  interface FormValues {
    nickName: string;
    email: string;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //formato básico de email
    return emailRegex.test(email);
  };

  const validateNickName = (nickName: string) => {
    const nickRegex = /^[a-zA-Z0-9]+$/; // solo letras y números, no caracteres especiales
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

    // validar en un objeto local
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
      // limpiar errores después de 3 segundos
      iniciarTimeout(3000);
      return;
    }

    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      iniciarTimeout(3000);
      setErrorApi(data?.error || "Error desconocido del servidor.");
      return;
    }

    // Reiniciar el formulario y errores al enviar con éxito
    console.log("Usuario registrado con éxito:", data);
    setErrorApi(null);
    setFormData({ nickName: "", email: "" });

    showNotification("Usuario registrado con éxito.");
  };

  return (
    <div>
      <h1 id={style.titulo}>Registro de Usuario</h1>
      <form id={style.formulario} onSubmit={handleSubmit}>
        {errorApi && (
          <p className={style.apiError}>
            {errorApi}
          </p>
        )}
        <label htmlFor="nickName">Nombre de usuario:</label>
        <input
          type="text"
          id="nickName"
          name="nickName"
          value={formData.nickName}
          onChange={handleChange}
          placeholder="Ingresa un nombre de usuario"
          required
        />
        {errors.nickName && (
          <p className={style.inputError}>{errors.nickName}</p>
        )}
        <label htmlFor="email">Correo electronico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ingresa un correo electronico"
          required
        />
        {errors.email && <p className={style.inputError}>{errors.email}</p>}
        <button type="submit" id="botonRegistro">
          Registrarse
        </button>
      </form>
    </div>
  );
}

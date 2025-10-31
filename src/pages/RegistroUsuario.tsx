import { useEffect, useRef, useState } from "react";
import style from "./RegistroUsuario.module.css";

export default function RegistroUsuario() {
  const timeoutRef = useRef<number | null>(null);

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

  interface FormValues {
    nickName: string;
    email: string;
  }

  const [formData, setFormData] = useState<FormValues>({
    nickName: "",
    email: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ nickName?: string; email?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return; // prevenir envíos múltiples

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
      timeoutRef.current = window.setTimeout(() => {
        setErrors({});
        timeoutRef.current = null;
      }, 3000);

      return;
    }

    setIsSubmitting(true);
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          setError("Error al crear el usuario, el nombre de usuario ya existe.");
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Usuario creado:", data);
        setFormData({ nickName: "", email: "" });
      })
      .catch((error) => {
        setError("Error en la solicitud: " + error.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div>
      <h1 id={style.titulo}>Registro de Usuario</h1>
      <form id={style.formulario} onSubmit={handleSubmit}>
        {error && <p className={style.inputError}>{error}</p>}
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
        <button type="submit" id="botonRegistro" disabled={isSubmitting}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

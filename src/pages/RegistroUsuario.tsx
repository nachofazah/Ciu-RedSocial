import { useState } from "react";
import style from "./RegistroUsuario.module.css";

export default function RegistroUsuario() {
  
  interface FormValues {
    nickName: string;
    email: string;
  }
  const [formData, setFormData] = useState<FormValues>({
    nickName: "",
    email: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Formulario enviado, informacion:", formData);
  };

  return (
    <div>
      <h1 id={style.titulo}>Registro de Usuario</h1>
      <form id={style.formulario} onSubmit={handleSubmit}>
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
        <button type="submit" id="botonRegistro">Registrarse</button>
      </form>
    </div>
  );
}

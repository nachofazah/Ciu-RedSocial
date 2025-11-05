# Red Asocial - Trabajo Practico para la materia CIU

 Asocial es una aplicación web desarrollada como trabajo práctico para la materia "Construcción de Interfaces de Usuario" en la Universidad Nacional de Hurlingham. El proyecto pretende ser una red social simple donde se puede realizar un login, realizar publicaciones y ver lo que otros publicaron

## Estructura


Ciu-RedSocial/
│
├── src/                  # Código fuente de la aplicación
│   ├── api/              # Aqui se realizan las intereacciones con la api
│   ├── components/       # Componentes reutilizables de React
│   ├── context/          # Contextos globales de la aplicación
│   ├── pages/            # Vistas principales de la aplicación
│   ├── routes/           # Componente de ruta protegida
│   ├── syles/            # Estilos modulares de la app
│   ├── types/            # Interfaces exportadas
│   ├── app.tsx           # Componente principal de la app
│
├── .gitignore            # Archivos y carpetas ignorados por git
├── eslint.config.js      # Configuración de ESLint
├── index.html            # HTML principal
├── package.json          # Configuración y dependencias del proyecto
├── package-lock.json     # Control de versiones de dependencias
├── vite.config.js        # Configuración de Vite
└── README.md             # Documentación del proyecto


## Requisitos

- ![Node.js](./src/assets/node_icon.png) Node.js (versión recomendada: 18.x o superior)
- ![npm](src/assets/npm_icon.png) npm (gestor de paquetes de Node.js)
- ![Git](./src/assets/git_icon.png) Git (solo necesario si se clona el repositorio)

## Backend

Para la realización de este trabajo practico nos fue provista una copia funcional de un BackEnd ya preparado

Repo de la API: 
https://github.com/lucasfigarola/backend-api

## Instrucciones para correr localmente

1. **Obtener el código fuente**

   - Opción 1: Clonar el repositorio (requiere Git)
     ```bash
     git clone https://github.com/nachofazah/Ciu-RedSocial.git
     cd Ciu-RedSocial
     ```
   - Opción 2: Descargar como ZIP
     - Haz clic en el botón "Code" en la página del repositorio y selecciona "Download ZIP".
     - Extrae el archivo ZIP y accede a la carpeta `Ciu-RedSocial`.

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Iniciar la aplicación**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - Accede a `http://localhost:5173/` para ver la aplicación en funcionamiento.





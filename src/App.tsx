import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";

export const App: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Routes>
      {/*ruta de login*/}
      <Route path="/login" element={<LoginPage />} />

      {/*ruta de registro*/}
      <Route
        path="/register"
        element={<h1 className="text-center mt-10">Registro próximamente...</h1>}
      />

      {/*ruta principal*/}
      <Route
        path="/"
        element={
          user ? (
            <div className="text-center mt-10">
              <h1 className="text-2xl font-bold mb-4">
                Bienvenido/a {user.nickName}
              </h1>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
    </Routes>
  );
};
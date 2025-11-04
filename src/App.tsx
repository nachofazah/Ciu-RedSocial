import './App.css'
import RegistroUsuario from './pages/RegistroUsuario'
import Notificacion from './components/Notificacion';
import { useState } from 'react';
function App() {

  const [notification, setNotification] = useState<React.ReactElement | null>(null);

  const showNotification = (message: string, onCloseDo?: () => void) => {
    const notif = <Notificacion message={message} onClose={() => {
      setNotification(null);
      if (onCloseDo) onCloseDo();
    }} />;
    setNotification(notif);
  }

  return (
    <>
      {notification}
      <RegistroUsuario showNotification={showNotification} />
    </>
  )
}
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";

export const App: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/register"
          element={
            <h1 className="text-center mt-10">acá va el registro.</h1>
          }
        />

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
    </div>
  );
};
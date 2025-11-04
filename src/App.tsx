<<<<<<< Updated upstream
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
=======
import React, { useContext, useState } from "react";
>>>>>>> Stashed changes
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Link } from 'react-router-dom'; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import Home from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import RegistroUsuario from "./pages/RegistroUsuario"; 
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import Notificacion from './components/Notificacion';

// Definición de tipos para el estado de la notificación
interface NotificationState {
    message: string | null;
}

export const App: React.FC = () => {
    const { user } = useContext(AuthContext); 
    const [notification, setNotification] = useState<NotificationState>({ message: null });

<<<<<<< Updated upstream
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage/>} />

          {/* Private route using PrivateRoute component */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
=======
    // Función para cerrar la notificación (se pasa como prop a Notificacion.tsx)
    const hideNotification = () => {
        setNotification({ message: null });
    };

    // Función para mostrar la notificación de éxito en el Registro (cierre automático)
    const showNotificationForRegistration = (message: string) => {
        setNotification({ message });
        // Cierra automáticamente después de 4 segundos
        setTimeout(() => setNotification({ message: null }), 4000); 
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <Routes>
                
                {/* 💡 RUTA DE INICIO REESTRUCTURADA: Si el usuario NO está logueado, redirigimos a /login */}
                <Route 
                    path="/" 
                    element={user ? <Home /> : <Navigate to="/login" replace />} 
                />
                
                {/* 🔐 Rutas de Autenticación */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/profile" replace /> : <LoginPage />} 
                />
                <Route
                    path="/register"
                    element={<RegistroUsuario showNotification={showNotificationForRegistration} />}
                />

                {/* 🔍 Detalle del Post (Solo si Home funciona, lo dejamos como público) */}
                <Route path="/post/:postId" element={<PostDetailPage />} />


                {/* 🛡️ Rutas Protegidas (Requieren usuario logueado) */}

                <Route 
                    path="/profile" 
                    element={<ProtectedRoute element={ProfilePage} />} 
                />
                <Route 
                    path="/new-post" 
                    element={<ProtectedRoute element={CreatePostPage} />} 
                />

                {/* 🚫 Fallback 404 */}
                <Route 
                    path="*" 
                    element={
                        <div className="text-center mt-20">
                            <h1>404 | Página no encontrada</h1>
                            <p>Vuelve al <Link to="/">Inicio</Link>.</p>
                        </div>
                    } 
                />

            </Routes>

            {/* 🔔 Renderizado Global de la Notificación */}
            {notification.message && (
                <Notificacion 
                    message={notification.message} 
                    onClose={hideNotification} 
                />
            )}
        </div>
    );
};
>>>>>>> Stashed changes

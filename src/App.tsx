import React, { useContext, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Link } from 'react-router-dom'; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import Home from "./pages/Home";
import MainLayout from './components/MainLayout';
import { LoginPage } from "./pages/LoginPage";
import RegistroUsuario from "./pages/RegistroUsuario"; 
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import Notificacion from './components/Notificacion';
import { ThemeProvider } from './context/ThemeContext';


// Definición de tipos para el estado de la notificación
interface NotificationState {
    message: string | null;
}

export const App: React.FC = () => {
    const { user } = useContext(AuthContext); 
    const [notification, setNotification] = useState<NotificationState>({ message: null });
    const navigate = useNavigate();
    // Función para cerrar la notificación al realizar el registro (se pasa como prop a Notificacion.tsx)
    const hideNotification = () => {
        setNotification({ message: null });
        navigate("/");
    };

    // Función para mostrar la notificación de éxito en el Registro (cierre automático)
    const showNotificationForRegistration = (message: string) => {
        setNotification({ message });
        // Cierra automáticamente después de 4 segundos
        setTimeout(() => {
            setNotification({ message: null })

    }, 4000); 
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <ThemeProvider>

                
            <main className="pt-5" style={{ minHeight: '100vh' }}> {/* Contenedor principal para el resto del contenido */}
            <Routes>
                
                {/* RUTAS SIN HEADER/LAYOUT: LOGIN Y REGISTRO (Acceso) */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/profile" replace /> : <LoginPage />} 
                />
                <Route
                    path="/register"
                    element={<RegistroUsuario showNotification={showNotificationForRegistration} />}
                />

                {/* 2. RUTAS CON HEADER/LAYOUT (Rutas Internas) */}
                <Route element={<MainLayout />}>

                    {/* 💡 RUTA DE INICIO REESTRUCTURADA: Si el usuario NO está logueado, redirigimos a /login */}
                    <Route 
                        path="/" 
                        element={user ? <Home /> : <Navigate to="/login" replace />} 
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
                </Route>    

            </Routes>
            </main>
            </ThemeProvider>

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

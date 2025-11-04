import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

interface ProtectedRouteProps {
    element: ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element }) => {
    const { isAuthenticated, user } = useAuth();
    
    console.log(`[ROUTE CHECK] Autenticado: ${isAuthenticated}, Usuario ID: ${user?.id}`);

    if (!isAuthenticated) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderiza el componente (tu CreatePostPage)
    return <Element />;
};

export default ProtectedRoute;
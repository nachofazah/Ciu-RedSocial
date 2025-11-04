import React, { useContext, type ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

interface ProtectedRouteProps {
    element: ComponentType; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element }) => {
    const { user } = useContext(AuthContext); 
    
    // Definir la autenticación basada en la existencia del usuario
    const isAuthenticated: boolean = user !== null;

    console.log(`[ROUTE CHECK] Autenticado: ${isAuthenticated}, Usuario ID: ${user?.id}`);

    if (!isAuthenticated) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" replace />; 
    }

    // Si está autenticado, renderiza el componente
    return <Element />;
};

export default ProtectedRoute;
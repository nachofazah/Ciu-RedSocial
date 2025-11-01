import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
//import LoginPage from './pages/LoginPage'; 
import CreatePostPage from './pages/CreatePostPage'; 
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        // 1. El BrowserRouter envuelve toda la aplicación
        <BrowserRouter>
            {/* 2. Routes define las diferentes rutas */}
            <Routes>
                
                {/* Ruta Pública: Inicio */}
                <Route path="/" element={<HomePage />} />
                
                {/* Ruta Pública: Login */}
                {/* <Route path="/login" element={<LoginPage />} /> */}
                
                {/* Ruta Protegida: Creación de Publicación 
                  Depende del componente ProtectedRoute para verificar la sesión.
                */}
                <Route 
                    path="/create-post" 
                    element={<ProtectedRoute element={CreatePostPage} />} 
                />
                
                {/* Ruta 404 (Wildcard) */}
                <Route path="*" element={
                    <div style={{ padding: '50px', textAlign: 'center' }}>
                        <h1>404 | Página No Encontrada</h1>
                        <p>El recurso que buscas no existe.</p>
                    </div>
                } />
                
            </Routes>
        </BrowserRouter>
    );
};

export default App;
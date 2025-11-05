import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'; 
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Header() {
    // Obtener el usuario y la función de logout del contexto
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    const buttonVariant = theme === 'dark' ? 'outline-light' : 'outline-dark';

    return (
        <Navbar className="navbar fixed-top bg-body-tertiary" data-bs-theme={theme} expand="sm">
            <Container fluid className="px-3">
                {/* 1. Logo/Marca: Siempre apunta a la ruta Home */}
                <Navbar.Brand as={Link} to="/">
                    **Asocial**
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="gap-2">
                        
                        {/* 2. Navegación Condicional */}
                        {user ? (
                            // --- Usuario Logueado (Muestra Perfil y Cerrar Sesión) ---
                            <>
                                <Nav.Link as={Link} to="/" className="navbar-link">
                                    Inicio
                                </Nav.Link>
                                <Nav.Link as={Link} to="/profile" className="navbar-link">
                                    👤 Perfil ({user.nickName})
                                </Nav.Link>
                                <Nav.Link as={Link} to="/new-post" className="navbar-link">
                                    ➕ Publicar
                                </Nav.Link>
                                <Button 
                                    onClick={handleLogout} 
                                    variant="outline-light" 
                                    size="sm"
                                >
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            // --- Usuario NO Logueado (Muestra Login y Registrarse) ---
                            <>
                                <Nav.Link as={Link} to="/login" className="navbar-link">
                                    Iniciar Sesión
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="navbar-link">
                                    Registrarse
                                </Nav.Link>
                            </>
                        )}

                        <Button
                            onClick={toggleTheme}
                            variant={buttonVariant} // Variante dinámica
                            size="sm"
                            className="ms-2" // Margen a la izquierda para separarlo
                        >
                            {/* Muestra el icono basado en el tema actual */}
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </Button>
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
import { Container, Row, Col, Card, Button, ListGroup, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";
import { fetchAllPostsData } from "../api/postService"; 
import { Link } from 'react-router-dom'; 

const Home = () => {
    const [darkMode, setDarkMode] = useState(true); 
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
    const [postImages, setPostImages] = useState<{ [key: number]: string[] }>({});
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    // UNIFICACIÓN Y OPTIMIZACIÓN: Usar fetchAllPostsData
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAllPostsData(); 

                setPosts(data.posts);
                setCommentsCount(data.commentsCount);
                setPostImages(data.postImages);

            } catch (err: any) {
                console.error("Error al cargar datos del feed:", err);
                setError("No se pudieron cargar las publicaciones. Intenta más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        loadAllData();
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
        
    // Si está cargando, mostramos un mensaje
    if (isLoading) {
        return <Container className="py-5 text-center">Cargando feed...</Container>;
    }
    
    // Si hay un error y no hay posts
    if (error && posts.length === 0) {
        return <Container className="py-5 text-center text-danger">Error: {error}</Container>;
    }

    return (
        <>
            <div className="banner text-center">
                ¡Bienvenido a Asocial!
            </div>
            <Container fluid className="mt-0">
                <Row>
                    {/* Izquierda: inicio y perfil */}
                    <Col md={3} className={`border-end overflow-auto ${
                        darkMode ? "bg-dark text-light" : "bg-light text-dark"
                        }`}
                    >
                        <div className="d-flex flex-column gap-2 pt-3 p-3">

                            {/* Botón de Modo Oscuro/Claro */}
                            <Button
                                variant={darkMode ? "secondary" : "warning"}
                                size="lg"
                                className="bg-botones mb-2 w-50 d-block mx-auto"
                                onClick={toggleDarkMode}
                            >
                                {darkMode ? "Modo claro" : "Modo oscuro"}
                            </Button>
                            
                            {/* Uso de Link para navegación interna */}
                            <Nav.Link as={Link} to="/">
                                <Button size="lg" className="bg-botones mb-2 w-50 d-block mx-auto">
                                    🏠 Inicio
                                </Button>
                            </Nav.Link>

                            <Nav.Link as={Link} to="/profile"> 
                                <Button size="lg" className="bg-botones mb-2 w-50 d-block mx-auto">
                                    👤 Perfil
                                </Button>
                            </Nav.Link>
                            {/* Aquí puedes agregar un botón de Logout usando useAuth().logout() */}

                        </div>
                    </Col>

                    {/* Centro: publicaciones */}
                    <Col md={6} className={`border-end vh-100 overflow-auto ${
                        darkMode ? "bg-dark text-light" : "bg-light text-dark"
                        }`}
                    >
                        <div className="p-3">
                            <h4 className={`text-center mb-2 ${darkMode ? "text-light" : "text-dark"}`}>¿Qué querés compartir?</h4>
                            <Nav.Link as={Link} to="/new-post"> {/* 🎯 Corregir a la ruta /new-post */}
                                <Button variant="primary" className="bg-botones w-50 mb-3 d-block mx-auto">
                                    Crear nueva publicación
                                </Button>
                            </Nav.Link>
                        </div>

                        <div className="p-3">
                            <h4 className={`text-center mb-2 ${darkMode ? "text-light" : "text-dark"}`}>Publicaciones recientes</h4>
                            {posts.length === 0 ? (
                                <p className="text-center">No hay publicaciones todavía.</p>
                            ) : (
                                [...posts]
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((post) => (
                                        <Card 
                                            key={post.id} 
                                            className={`mb-3 w-50 d-block mx-auto ${
                                                darkMode ? 'bg-secondary text-light' : 'bg-light border'
                                            }`}
                                        >
                                            <Card.Body>
                                                {/* Autor y fecha */}
                                                <Card.Title className="mb-1" style={{fontSize: '0.9em'}}>
                                                    Publicado por: **{post.User?.nickName || 'Usuario Desconocido'}**
                                                </Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '0.8em'}}>
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </Card.Subtitle>
                                                <Card.Text>{post.description}</Card.Text>

                                                {/* Imágenes */}
                                                {postImages[post.id]?.length > 0 && (
                                                    <div className="mb-2 post-image-grid"> 
                                                        {postImages[post.id].slice(0, 1).map((imgUrl, idx) => (
                                                            <img 
                                                                key={idx} 
                                                                src={imgUrl} 
                                                                alt={`Post ${post.id}`} 
                                                                className="img-fluid mb-2 rounded" 
                                                                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Tags */}
                                                {post.Tags && post.Tags.length > 0 && (
                                                    <div className="mb-2">
                                                        {post.Tags.map((tag) => (
                                                            <span key={tag.id} className="badge bg-info text-dark me-1">
                                                                #{tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Cantidad de comentarios */}
                                                <p className="mb-2">
                                                    💬 **{commentsCount[post.id] ?? 0} comentarios**
                                                </p>

                                                {/* Botón Ver más */}
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    as={Link} 
                                                    to={`/post/${post.id}`}
                                                >
                                                    Ver más
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))
                            )}
                        </div>
                    </Col>

                    {/* Derecha: usuarios y actividad (manteniendo tu mock de datos) */}
                    <Col md={3} className={`border-end overflow-auto ${
                        darkMode ? "bg-dark text-light" : "bg-light text-dark"
                        }`}
                    >
                        <div className="pt-3 p-3">
                            <h4 className={`text-center mb-2 ${darkMode ? "text-light" : "text-dark"}`}>Actividad reciente</h4>
                            <ListGroup className="mb-3">
                                {[
                                    "Juan comentó en tu publicación",
                                    "Pedro creo una publicación"
                                ].map((act, idx) => (
                                    <ListGroup.Item className={darkMode ? "bg-secondary text-light" : "bg-light text-dark"} key={idx}>{act}</ListGroup.Item>
                                ))}
                            </ListGroup>
                            {/* ... (Tu lista de otros usuarios) ... */}
                            <h4 className={`text-center mb-2 ${darkMode ? "text-light" : "text-dark"}`}>Otros usuarios</h4>
                            <ListGroup>
                                {["Ana", "Luis", "Carla"].map((user, idx) => (
                                    <ListGroup.Item className={darkMode ? "bg-secondary text-light" : "bg-light text-dark"} key={idx}>{user}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Home;

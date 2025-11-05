import { Container, Row, Col, Card, Button, ListGroup, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { fetchAllPostsData } from "../api/postService"; 
import { Link } from 'react-router-dom'; 
import { useTheme } from '../context/ThemeContext'; 
import style from '../styles/Home.module.css';
import { fetchUsers } from "../api/postService";

const Home = () => {

    const { theme, toggleTheme } = useTheme(); 
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
    const [postImages, setPostImages] = useState<{ [key: number]: string[] }>({});
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                setError("Error al cargar usuarios");
            }
        };

        loadUsers();
    }, []);

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

    if (isLoading) {
        return <Container className="py-5 text-center">Cargando feed...</Container>;
    }
    
    if (error && posts.length === 0) {
        return <Container className="py-5 text-center text-danger">Error: {error}</Container>;
    }

    const lastPost = posts.length > 0 
        ? posts.reduce((latest, post) =>
            new Date(post.createdAt) > new Date(latest.createdAt) ? post : latest
            )
        : null;

    return (
        <>
            <div className="banner text-center">
                ¡Bienvenido a Asocial!
            </div>
            
            {/* 🏆 Contenedor principal: APLICA el tema y el layout modular */}
            <Container fluid className={style.mainLayout}>
                {/* flex-nowrap mantiene las columnas en línea en pantallas grandes */}
                <Row className="flex-nowrap">

                    {/* Izquierda: Navegación */}
                    <Col md={3} className={style.leftColumn}>
                        <div className="navContainer">
                            
                            {/* Botón de Modo Oscuro/Claro */}
                            <Button
                                variant={theme === 'dark' ? "secondary" : "warning"}
                                size="lg"
                                className={style.navButton} 
                                onClick={toggleTheme}
                            >
                                {theme === 'dark' ? "Modo claro ☀️" : "Modo oscuro 🌙"}
                            </Button>
                            
                            {/* Botones de Navegación */}
                            <Nav.Link as={Link} to="/" className={style.navLink}>
                                <Button size="lg" className={style.navButton}>
                                    🏠 Inicio
                                </Button>
                            </Nav.Link>

                            <Nav.Link as={Link} to="/profile" className={style.navLink}>
                                <Button size="lg" className={style.navButton}>
                                    👤 Perfil
                                </Button>
                            </Nav.Link>
                            

                        </div>
                    </Col>

                    {/* Centro: Feed de Publicaciones */}
                    <Col md={6} className={style.centerColumn}>

                        <h4 className={style.sectionTitle}>¿Qué querés compartir?</h4>
                        
                        <div className={style.createPostContainer}>
                            <Nav.Link as={Link} to="/new-post">
                                <Button variant="primary" className={style.createPostButton}>
                                    Crear nueva publicación
                                </Button>
                            </Nav.Link>
                        </div>

                        <div className="p-3">
                            <h4 className={style.sectionTitle}>Publicaciones recientes</h4>
                            {posts.length === 0 ? (
                                <p className="text-center">No hay publicaciones todavía.</p>
                            ) : (
                                [...posts]
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((post) => (
                                        <Card 
                                            key={post.id} 
                                            className={style.postCard}
                                        >
                                            <Card.Body>
                                                <Card.Title className="mb-1" style={{fontSize: '0.9em'}}>
                                                    Publicado por: **{post.User?.nickName || 'Usuario Desconocido'}**
                                                </Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '0.8em'}}>
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </Card.Subtitle>
                                                <Card.Text>{post.description}</Card.Text>

                                                {/* Imágenes */}
                                                {postImages[post.id]?.length > 0 && (
                                                    <div className="mb-2"> 
                                                        {postImages[post.id].slice(0, 1).map((imgUrl, idx) => (
                                                            <img 
                                                                key={idx} 
                                                                src={imgUrl} 
                                                                alt={`Post ${post.id}`} 
                                                                className={style.postImage}
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

                                                {/* Comentarios y Botón Ver más */}
                                                <p className="mb-2">
                                                    💬 **{commentsCount[post.id] ?? 0} comentarios**
                                                </p>
                                                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                                                    <Button variant="outline-primary" size="sm">
                                                        Ver más
                                                    </Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    ))
                            )}
                        </div>
                    </Col>

                    {/* Derecha: Actividad y Sugerencias */}
                    <Col md={3} className={style.rightColumn}>
                        <div className="pt-3 p-3">
                            <h4 className={style.sectionTitle}>Actividad reciente</h4>

                            <ListGroup className="mb-3">
                                {lastPost && (
                                    <ListGroup.Item className={style.activityItem}>
                                        {`${lastPost.User.nickName} creó una nueva publicación`}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                            <h4 className={style.sectionTitle}>Otros usuarios</h4>
                            <ListGroup>
                                {error ? (
                                    <ListGroup.Item>{error}</ListGroup.Item>
                                ) : users.length === 0 ? (
                                    <ListGroup.Item>Cargando usuarios...</ListGroup.Item>
                                ) : (
                                    users.map((user) => (
                                    <ListGroup.Item className={style.activityItem} key={user.id}>
                                        {user.nickName || `${user.firstName} ${user.lastName}`}
                                    </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Home;
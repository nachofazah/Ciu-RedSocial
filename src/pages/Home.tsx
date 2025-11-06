import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap"; 
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { fetchAllPostsData } from "../api/postService"; 
import { Link } from 'react-router-dom'; 
import { useTheme } from '../context/ThemeContext'; 
import style from '../styles/Home.module.css';
import { fetchUsers } from "../api/postService";

const Home: React.FC = () => {

    const { theme, toggleTheme } = useTheme(); 
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
    const [postImages, setPostImages] = useState<{ [key: number]: string[] }>({});
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Datos simulados del usuario actual para el widget del perfil en la derecha
    const currentUserMock = {
        nickName: "luna",
        atTag: "@luna",
        followers: "2.3K",
        following: 235,
        posts: 80,
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data.slice(0, 5)); 
            } catch (err) {
                console.error("Error al cargar usuarios:", err); 
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
        return <div className={style.loadingMessage}>Cargando feed...</div>;
    }
    
    if (error && posts.length === 0) {
        return <div className={style.errorMessage}>Error: {error}</div>;
    }

    const lastPost = posts.length > 0 
        ? posts.reduce((latest, post) =>
            new Date(post.createdAt) > new Date(latest.createdAt) ? post : latest
            )
        : null;

    return (
        <div className={style.appContainer}>
            <div className={style.welcomeTitle}>
                ¡Bienvenido a Asocial!
            </div>
            
            <div className={`${style.mainLayout} ${theme}-mode`}>
                
                {/* Izquierda: Navegación */}
                <div className={style.leftColumn}>
                    <div className={style.navContainer}>
                        
                        <Button
                            variant={theme === 'dark' ? "secondary" : "warning"}
                            size="lg"
                            className={style.navButton} 
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? "Modo claro ☀️" : "Modo oscuro 🌙"}
                        </Button>
                        
                        <Link to="/" className={style.navLink}>
                            <Button size="lg" className={style.navButton}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                🏠 Inicio
                            </Button>
                        </Link>

                        <Link to="/profile" className={style.navLink}>
                            <Button size="lg" className={style.navButton}>
                                👤 Perfil
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Centro: Feed de Publicaciones */}
                <div className={style.centerColumn}>
                    <div className={style.centerContent}>
                        <h4 className={style.sectionTitle}>¿Qué querés compartir?</h4>
                        
                        <div className={style.createPostContainer}>
                            <Link to="/new-post" className={style.navLink}>
                                <Button variant="primary" className={style.createPostButton}>
                                    Crear nueva publicación
                                </Button>
                            </Link>
                        </div>

                        <h4 className={style.sectionTitle}>Publicaciones recientes</h4>
                        {posts.length === 0 ? (
                            <p className={style.noPostsMessage}>No hay publicaciones todavía.</p>
                        ) : (
                            posts
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((post) => (
                                    <Card 
                                        key={post.id} 
                                        className={style.postCard}
                                    >
                                        <Card.Body>
                                            <Card.Title className={style.postAuthorTitle}>
                                                Publicado por: **{post.User?.nickName || 'Usuario Desconocido'}**
                                            </Card.Title>
                                            <Card.Subtitle className={style.postDateSubtitle}>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </Card.Subtitle>
                                            <Card.Text>{post.description}</Card.Text>

                                            {postImages[post.id]?.length > 0 && (
                                                <div className={style.postMediaWrapper}> 
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
                                            
                                            {post.Tags && post.Tags.length > 0 && (
                                                <div className={style.tagWrapper}>
                                                    {post.Tags.map((tag) => (
                                                        <span key={tag.id} className={style.badge}>
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className={style.commentCountText}>
                                                💬 **{commentsCount[post.id] ?? 0} comentarios**
                                            </p>
                                            <Link to={`/post/${post.id}`} className={style.detailLink}>
                                                <Button variant="outline-primary" size="sm" className={style.detailButton}>
                                                    Ver más
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                ))
                        )}
                    </div>
                </div>

                {/* Derecha: Actividad y Sugerencias */}
                <div className={style.rightColumn}>
                    <div className={style.rightContent}>
                        
                        {/* 🌟 NUEVO: Tarjeta de perfil/usuario logueado */}
                        <div className={style.profileCard}>
                            <div className={style.profileAvatar}>L</div>
                            <div className={style.profileInfo}>
                                <div className={style.profileName}>{currentUserMock.nickName}</div>
                                <div className={style.profileAtTag}>{currentUserMock.atTag}</div>
                            </div>
                            <div className={style.profileStats}>
                                <div className={style.statItem}>
                                    <div className={style.statValue}>{currentUserMock.followers}</div>
                                    <div className={style.statLabel}>Follower</div>
                                </div>
                                <div className={style.statItem}>
                                    <div className={style.statValue}>{currentUserMock.following}</div>
                                    <div className={style.statLabel}>Following</div>
                                </div>
                                <div className={style.statItem}>
                                    <div className={style.statValue}>{currentUserMock.posts}</div>
                                    <div className={style.statLabel}>Post</div>
                                </div>
                            </div>
                        </div>

                        <h4 className={style.sectionTitle}>Actividad reciente</h4>

                        <div className={style.listGroup}>
                            {lastPost && (
                                <div className={style.activityItem}>
                                    {`${lastPost.User.nickName} creó una nueva publicación`}
                                </div>
                            )}
                        </div>

                        <h4 className={style.sectionTitle}>Otros usuarios</h4>
                        <div className={style.listGroup}>
                            {users.length === 0 ? (
                                <div className={style.activityItem}>Cargando usuarios...</div>
                            ) : (
                                users.map((user) => (
                                <div className={style.activityItem} key={user.id}>
                                    {user.nickName || `${user.firstName} ${user.lastName}`}
                                </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
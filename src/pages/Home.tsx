import React, { useContext, useEffect, useState } from 'react';
import { Card } from "react-bootstrap"; 
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import { fetchAllPostsData } from "../api/postService"; 
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; 
import style from '../styles/Home.module.css';
import { fetchUsers } from "../api/postService";
import { AuthContext } from '../context/AuthContext'; 
import { FaHome, FaUsers, FaVideo, FaImage, FaStore, FaFileAlt, FaEllipsisH, FaThumbsUp, FaCommentAlt, FaShare, FaGlobe } from 'react-icons/fa';


const Home: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
    const [postImages, setPostImages] = useState<{ [key: number]: string[] }>({});
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Datos simulados del usuario actual para la COLUMNA IZQUIERDA
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

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

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
        <div className={`${style.appContainer} ${theme}-mode`}> 
            
            <div className={style.welcomeTitle}>
                ¡Bienvenido a Asocial!
            </div>

            <div className={style.mainLayoutGrid}> 
                
                {/* 1. Columna Izquierda: Información del Perfil y Navegación */}
                <div className={style.leftColumn}>
                    
                    {/* Tarjeta de información del perfil: solo si hay usuario logueado */}
                    {user ? (
                        <div className={style.profileCard}>
                            <div className={style.profileAvatarLarge}>
                                {(user.nickName?.[0] ?? "U").toUpperCase()}
                            </div>
                            <h3 className={style.profileName}>{user.nickName}</h3>
                            <p className={style.profileHandle}>@{(user.nickName ?? "").toLowerCase().replace(/\s/g, '')}</p>
                            <div className={style.profileStats}>
                                {/* datos opcionales: muestra solo si existen */}
                                <div className={style.statItem}><strong>2.3K</strong><span>Seguidores</span></div>
                                <div className={style.statItem}><strong>235</strong><span>Siguiendo</span></div>
                                <div className={style.statItem}><strong>10</strong><span>Post</span></div>
                            </div>
                        </div>
                    ) : null}

                    {/* Navegación Principal */}
                    <nav className={style.mainNav}>
                        <Link to="/" className={`${style.navItem} ${style.active}`}><FaHome /> Inicio</Link>
                        <Link to="/profile/friends" className={style.navItem}><FaUsers /> Amigos <span className={style.navBadge}>4</span></Link>
                        <Link to="/watch" className={style.navItem}><FaVideo /> Videos</Link>
                        <Link to="/photos" className={style.navItem}><FaImage /> Fotos</Link>
                        <Link to="/marketplace" className={style.navItem}><FaStore /> Marketplace</Link>
                        <Link to="/files" className={style.navItem}><FaFileAlt /> Guardado <span className={style.navBadge}>7</span></Link>
                    </nav>

                    <div className={style.footerSection}>
                        <Link to="#">Privacy terms</Link> | <Link to="#">Advertising</Link> | <Link to="#">Cookies</Link>
                        <p className={style.copyright}>Platform © 2025</p>
                        <button className="btn btn-sm btn-outline-secondary w-100 mt-3" onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                </div>

                {/* 2. Columna Central: Feed de Publicaciones */}
                <div className={style.centerColumn}>
                    <div className={style.centerContent}>
                        {/* Widget para crear una nueva publicación */}
                            <div className={style.createPostWidget}>
                                <div className={style.createPostHeader}>
                                    <div className={style.smallAvatar}>{currentUserMock.nickName[0].toUpperCase()}</div>
                                    <input type="text" placeholder="¿Qué estás pensando?" readOnly onClick={() => navigate('/new-post')} />
                                    <button className={style.sharePostButton}>Postear</button>
                                </div>
                                <div className={style.createPostActions}>
                                    <div className={style.actionItem}><FaImage /> Imagen/Video</div>
                                    <div className={style.actionItem}><span className={style.hashtagIcon}>#</span> Hashtag</div>
                                    <div className={style.actionItem}><span className={style.mentionIcon}>@</span> Mention</div>
                                    <div className={`${style.actionItem} ${style.publicOption}`}><FaGlobe /> Publico <FaEllipsisH style={{marginLeft: '5px'}}/></div>
                                </div>
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
                                        
                                        {/* 1. Encabezado del Post */}
                                        <div className={style.postHeader}>
                                            <div className={style.postAvatar}>
                                                {(post.User?.nickName || 'U')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={style.postAuthor}>
                                                    {post.User?.nickName || 'Usuario Desconocido'}
                                                </div>
                                                <div className={style.postTime}>
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {/* Opciones (FaEllipsisH) */}
                                            <Link to={`/post/${post.id}`} className={style.postOptionsLink} title="Ver Detalle">
                                                <FaEllipsisH className={style.postOptions} />
                                            </Link>
                                        </div>

                                        {/* 2. Contenido del Post */}
                                        <div className={style.postContentText}>
                                            <p>{post.description}</p>
                                        </div>

                                        {/* 3. Medios (Imágenes) */}
                                        {postImages[post.id]?.length > 0 && (
                                            <div className={style.postMediaGrid}> 
                                                {postImages[post.id].slice(0, 1).map((imgUrl, idx) => (
                                                    <img 
                                                        key={idx} 
                                                        src={imgUrl} 
                                                        alt={`Post ${post.id}`} 
                                                        className={style.postMediaItem}
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* 4. Tags */}
                                        {post.Tags && post.Tags.length > 0 && (
                                            <div className={style.tagWrapper}>
                                                {post.Tags.map((tag) => (
                                                    <span key={tag.id} className={style.badge}>
                                                        #{tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* 5. Estadísticas de Engagement (Likes, Comments, Shares) */}
                                        <div className={style.postEngagementStats}>
                                            <span>X Likes</span>
                                            <span>{commentsCount[post.id] ?? 0} Comentarios</span>
                                            <span>Y Compartidos</span>
                                        </div>

                                        {/* 6. Barra de Acciones (Botones) */}
                                        <div className={style.postActionsBar}>
                                            <button className={style.postActionButton}>
                                                <FaThumbsUp /> Like
                                            </button>
                                            <Link to={`/post/${post.id}`} className={style.postActionButton}>
                                                <FaCommentAlt /> Comment
                                            </Link>
                                            <button className={style.postActionButton}>
                                                <FaShare /> Share
                                            </button>
                                        </div>
                                    </Card>
                                ))
                        )}
                    </div>
                </div>

                {/* 3. Columna Derecha: Actividad y Sugerencias */}
                <div className={style.rightColumn}>
                    <div className={style.rightContent}>

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
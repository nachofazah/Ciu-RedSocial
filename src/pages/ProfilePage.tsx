import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { fetchPostsByUserId } from '../api/postService'; 
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types/Post'; 
import { useTheme } from '../context/ThemeContext';
import style from '../styles/ProfilePage.module.css'; 
import { FaHome, FaUsers, FaVideo, FaImage, FaStore, FaFileAlt, FaSearch, FaEllipsisH, FaGlobe, FaThumbsUp, FaCommentDots, FaShare } from 'react-icons/fa';

// Definición simple del tipo de ProfileData
interface UserProfileData {
    id: number;
    nickName: string;
    email: string;
    profileCompletion?: number; 
    profilePicture?: string; 
}


const ProfilePage: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commentsNum, setCommentsNum] = useState<{ [key: number]: number }>({});
    const [error, setError] = useState<string | null>(null);

    // Redirigir si no hay usuario logueado
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Función para cargar los posts del usuario (GET /posts?UserId=id)
    const loadUserPosts = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);
        try {
            const posts = await fetchPostsByUserId(user.id);
            const sortedPosts = posts.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setUserPosts(sortedPosts);
        } catch (e) {
            console.error("Error al cargar posts del perfil:", e);
            setError("No se pudieron cargar tus publicaciones.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);
    

    useEffect(() => {
        loadUserPosts();
    }, [loadUserPosts]);

    // Lógica para cargar el número de comentarios 
    useEffect(() => {
        userPosts.forEach(post => {
          fetch(`http://localhost:3001/comments/post/${post.id}`)
            .then(res => res.json())
            .then(data => {
              setCommentsNum(prev => ({ ...prev, [post.id]: data.length }));
            })
            .catch(err => console.error("Se produjo un error al cargar los comentarios", err));
          });
    }, [userPosts]);


    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };


    // --- Renderizado de Carga y Error ---
    if (!user) return null; 
    
    if (isLoading) {
        return (
            <div className={`${style.mainLayout} ${theme}-mode`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Cargando perfil y publicaciones...
            </div>
        );
    }

    const profileData: UserProfileData = {
        id: user.id,
        nickName: user.nickName,
        email: user.email,
        profileCompletion: 80,
    };

    return (
        <div className={`${style.mainLayout} ${theme}-mode`}>
            
            <div className={style.contentWrapper}>
                <div className="row g-0">

                    {/* Columna Izquierda: Información del Perfil y Navegación (Ahora se desplaza con el resto) */}
                    <div className="col-md-3 d-none d-md-block"> 
                        <div className={style.leftColumn}>
                            {/* Tarjeta de información del perfil */}
                            <div className={style.profileCard}>
                                <div className={style.profileAvatarLarge}>{profileData.nickName[0].toUpperCase()}</div>
                                <h3 className={style.profileName}>{profileData.nickName}</h3>
                                <p className={style.profileHandle}>@{profileData.nickName.toLowerCase().replace(/\s/g, '')}</p>
                                <div className={style.profileStats}>
                                    <div className={style.statItem}><strong>2.3K</strong><span>Seguidores</span></div>
                                    <div className={style.statItem}><strong>235</strong><span>Siguiendo</span></div>
                                    <div className={style.statItem}><strong>10</strong><span>Post</span></div>
                                </div>
                            </div>

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
                    </div>

                    {/* Columna Central: Feed de Publicaciones */}
                    <div className="col-md-6">
                        <div className={style.centerFeed}>

                            {/* Widget para crear una nueva publicación */}
                            <div className={style.createPostWidget}>
                                <div className={style.createPostHeader}>
                                    <div className={style.smallAvatar}>{profileData.nickName[0].toUpperCase()}</div>
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
                            
                            {/* Tus publicaciones */}
                            <h5 className={style.sectionTitle}>Tus Publicaciones</h5> 
                            {error && <div className="alert alert-danger">{error}</div>}

                            {userPosts.length === 0 ? (
                                <div className={style.noPostsMessage}>
                                    Aún no has creado ninguna publicación.
                                    <Link to="/new-post" className="btn btn-primary mt-2">¡Crear Ahora!</Link>
                                </div>
                            ) : (
                                userPosts.map((post) => (
                                    <div key={post.id} className={style.postCard}>
                                        <div className={style.postHeader}>
                                            <div className={style.postAvatar}>{user.nickName[0].toUpperCase()}</div>
                                            <div>
                                                <div className={style.postAuthor}>{user.nickName}</div>
                                                <div className={style.postTime}>{new Date(post.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            {/* Enlace de Opciones/Detalle */}
                                            <Link to={`/post/${post.id}`} className={style.postOptionsLink} title="Ver Detalle">
                                                <FaEllipsisH className={style.postOptions} />
                                            </Link>
                                            
                                            </div>
                                        <div className={style.postContentText}>
                                            <p>{post.description}</p>
                                        </div>
                                        <div className={style.postEngagementStats}>
                                            <span>10 Me Gustas</span> 
                                            <span>{commentsNum[post.id] ?? 0} Comentarios</span>
                                            <span>2 Compartidos</span> 
                                        </div>
                                        <div className={style.postActionsBar}>
                                            <button className={style.postActionButton}><FaThumbsUp /> Me gusta</button>
                                            <button className={style.postActionButton}><FaCommentDots /> Comentar</button>
                                            <button className={style.postActionButton}><FaShare /> Compartir</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Mensajes y Eventos (Ahora se desplaza con el resto) */}
                    <div className="col-md-3 d-none d-md-block">
                        <div className={style.rightColumn}>
                            
                            {/* Widget de Mensajes */}
                            <div className={style.messagesWidget}>
                                <h5 className={style.widgetTitle}>Mensajes</h5>
                                <div className={style.searchBox}>
                                    <FaSearch className={style.searchIcon} />
                                    <input type="text" placeholder="Search" className={style.searchInput} />
                                </div>
                                <div className={style.messageTabs}>
                                    <span className={`${style.messageTab} ${style.messageTabActive}`}>Destacados</span>
                                    <span className={style.messageTab}>Todos</span>
                                    <span className={style.messageTab}>Grupos<span className={style.messageBadge}>4</span></span>
                                </div>
                                <div className={style.messagesList}>
                                    <div className={style.messageItem}>
                                        <div className={style.messageAvatar} style={{backgroundColor: '#C8A2C8'}}>R</div> 
                                        <span>Ignacio Martín Fazah Beiroa</span>
                                    </div>
                                    <div className={style.messageItem}>
                                        <div className={style.messageAvatar} style={{backgroundColor: '#B0C4DE'}}>T</div> 
                                        <span>Lucas Martin Avalos Lettieri</span>
                                    </div>
                                    <div className={style.messageItem}>
                                        <div className={style.messageAvatar} style={{backgroundColor: '#FFD700'}}>A</div> 
                                        <span>Matías David Torres</span>
                                    </div>
                                    <div className={style.messageItem}>
                                        <div className={style.messageAvatar} style={{backgroundColor: '#ADD8E6'}}>E</div> 
                                        <span>Mayra Giselle García</span>
                                    </div>
                                    <div className={style.messageItem}>
                                        <div className={style.messageAvatar} style={{backgroundColor: '#98FB98'}}>C</div> 
                                        <span>Nahuel Lautaro Jimenez</span>
                                    </div>
                                    <Link to="#" className={style.viewAllMessages}>View All</Link>
                                </div>
                            </div>

                            {/* Widget de Eventos */}
                            <div className={style.eventsWidget}>
                                <h5 className={style.widgetTitle}>Eventos</h5>
                                <div className={style.eventItem}>
                                    <div className={style.eventDate}>
                                        <strong>8/11</strong>
                                    </div>
                                    <div className={style.eventDetails}>
                                        <div className={style.eventName}>UNAHUR TIC</div>
                                        <div className={style.eventTime}>Sab - Unahur</div>
                                    </div>
                                </div>
                                <div className={style.eventItem}>
                                    <div className={style.eventDate}>
                                        <strong>WD</strong>
                                        <span>Meetup</span>
                                    </div>
                                    <div className={style.eventDetails}>
                                        <div className={style.eventName}>Web Dev 2.0 Meetup</div>
                                        <div className={style.eventTime}>Yoshkar-Ola, Russia</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
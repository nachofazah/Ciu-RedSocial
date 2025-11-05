import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { fetchPostsByUserId } from '../api/postService'; 
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types/Post'; 
import { useTheme } from '../context/ThemeContext';
import style from '../styles/ProfilePage.module.css'; 
import { FaHome, FaInfoCircle, FaUsers, FaImage, FaHeart, FaComment } from 'react-icons/fa';

// Definición simple del tipo de ProfileData para evitar errores
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

    // Lógica para cargar el número de comentarios (manteniendo tu lógica existente)
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
    
    // El contenedor principal siempre aplica el tema, incluso en la carga
    if (isLoading) {
        return (
            <div className={`${style.mainLayout} ${theme}-mode`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Cargando perfil y publicaciones...
            </div>
        );
    }

    // --- Renderizado del Perfil con Diseño de Tres Columnas ---
    
    // Datos simulados
    const profileData: UserProfileData = {
        id: user.id,
        nickName: user.nickName,
        email: user.email, // no hace falta verificar si tiene email porque es necesario para el registro
        profileCompletion: 80,
    };

    return (
        <div className={`${style.mainLayout} ${theme}-mode`}>
            <div className="row">

                {/* Columna Izquierda: Perfil y Navegación */}
                <div className="col-md-3">
                    <div className={style.leftColumn}>
                        
                        {/* Tarjeta de información del perfil */}
                        <div className={style.profileHeaderCard}>
                            {/* Imagen de portada y avatar simulados */}
                            <img src="https://via.placeholder.com/600x100/404040/FFFFFF?text=PORTADA" alt="Cover" className={style.coverImage} />
                            <div className={style.profileAvatarLarge}>
                                {user.nickName[0].toUpperCase()}
                            </div>
                            <h3 className={style.profileName}>{profileData.nickName}</h3>
                            <p className={style.profileBio}>Estudiante de informática | Compartiendo ideas y código.</p>
                            
                        </div>

                        {/* Navegación del Perfil */}
                        <div className={style.profileNavSection}>
                            <h5 className={style.profileNavTitle}>MI PERFIL</h5>
                            <Link to="/profile" className={style.profileNavItem}><FaHome /> Feed</Link>
                            <Link to="/profile/about" className={style.profileNavItem}><FaInfoCircle /> About</Link>
                            <Link to="/profile/friends" className={style.profileNavItem}><FaUsers /> Friends</Link>
                            <Link to="/profile/photos" className={style.profileNavItem}><FaImage /> Photos</Link>
                        </div>

                        
                        {/* Botón de cerrar sesión */}
                        <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                </div>

                {/* Columna Central: Feed de Publicaciones del Usuario */}
                <div className="col-md-6">
                    <div className={style.centerColumn}>
                        
                        {/* Input para crear una nueva publicación (Enlace a la ruta /new-post) */}
                        <div className={style.createPostInput}>
                            <input type="text" placeholder="¿Qué estás pensando?" readOnly onClick={() => navigate('/new-post')} />
                            <button className="btn btn-sm btn-link" onClick={() => navigate('/new-post')}><FaImage /></button>
                        </div>

                        <h5 className="mb-3" style={{ color: 'var(--color-text-primary)' }}>Mis Publicaciones</h5>
                        
                        {/* Mostrar mensaje de error si existe */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Renderizar las publicaciones del usuario */}
                        {userPosts.length === 0 ? (
                            <div className="text-center mt-5">
                                Aún no has creado ninguna publicación.
                                <Link to="/new-post" className="btn btn-primary mt-2 d-block">¡Crear Ahora!</Link>
                            </div>
                        ) : (
                            userPosts.map((post) => (
                                <div key={post.id} className={style.postCard}>
                                    {/* Encabezado del Post */}
                                    <div className={style.postHeader}>
                                        <div className={style.postUserAvatar}>{user.nickName[0].toUpperCase()}</div>
                                        <div>
                                            <span className={style.postUserName}>{user.nickName}</span>
                                            <br />
                                            <span className={style.postTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Contenido del Post */}
                                    <div className={style.postContent}>
                                        <p>{post.description}</p>
                                        {/* Aquí iría la imagen del post si la tuvieras */}
                                    </div>
                                    
                                    {/* Acciones y Metadatos */}
                                    <div className="d-flex justify-content-between text-muted mb-2">     
                                        <Link to={`/post/${post.id}`}>Ver Detalle</Link>
                                    </div>
                                    
                                    <div className={style.postActions}>
                                        <button><FaHeart /> Like</button>
                                        <button>{commentsNum[post.id] ?? 0} 💬</button>
                                        <Link to={`/post/${post.id}`} className="btn btn-link p-0 m-0"><FaComment /> Comentar</Link>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Widgets (Miembros Online, Hashtags, Mis Fotos) */}
                <div className="col-md-3">
                    <div className={style.rightColumn}>
                        
                        {/* Widget de Miembros Online (Simulado) */}
                        <div className={style.widgetCard}>
                            <h5 className={style.widgetTitle}>Online Members</h5>
                            <div className={style.onlineMembersList}>
                                <div className={style.memberAvatar}>J</div>
                                <div className={style.memberAvatar}>A</div>
                                <div className={style.memberAvatar}>M</div>
                            </div>
                            <p className={style.onlineCount}>2 members online, 18 members total</p>
                        </div>

                        {/* Widget de Hashtags (Simulado) */}
                        <div className={style.widgetCard}>
                            <h5 className={style.widgetTitle}># Popular Tags</h5>
                            <div className={style.hashtagCloud}>
                                <Link to="#" className={style.hashtagButton}>#awesomeshot</Link>
                                <Link to="#" className={style.hashtagButton}>#webdesign</Link>
                                <Link to="#" className={style.hashtagButton}>#unahur</Link>
                                <Link to="#" className={style.hashtagButton}>#development</Link>
                            </div>
                        </div>

                        {/* Widget de Mis Fotos (Simulado) */}
                        <div className={style.widgetCard}>
                            <h5 className={style.widgetTitle}>My Photos</h5>
                            <div className={style.myPhotosGrid}>
                                <img src="https://via.placeholder.com/100x80" alt="Photo 1" className={style.photoThumbnail} />
                                <img src="https://via.placeholder.com/100x80" alt="Photo 2" className={style.photoThumbnail} />
                                <img src="https://via.placeholder.com/100x80" alt="Photo 3" className={style.photoThumbnail} />
                            </div>
                            <p className="text-center mt-3"><Link to="#" className="btn btn-sm btn-outline-primary">View All</Link></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
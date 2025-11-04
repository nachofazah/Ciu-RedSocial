import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { fetchPostsByUserId } from '../api/postService'; 
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types/Post'; 
//import '../styles/ProfilePage.css'; 

const ProfilePage: React.FC = () => {
    // Obtener el usuario y la función de logout
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados para manejar los posts y la carga
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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


    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };


    // --- Renderizado del Perfil ---

    if (!user) return null; 
    
    // Si aún está cargando o hay error en los posts
    if (isLoading) {
        return <div className="profile-container loading-message">Cargando perfil y publicaciones...</div>;
    }

    return (
        <div className="profile-container">
            
            <header className="profile-header">
                <div className="profile-info-block">
                    {/* Icono/Inicial del Usuario */}
                    <div className="profile-avatar">
                        {user.nickName[0].toUpperCase()}
                    </div>
                    
                    <div className="profile-details">
                        <h1>Hola, **{user.nickName}** 👋</h1>
                        <p className="profile-email">**Email:** {user.email}</p>
                        <p className="profile-stats">
                            **Posts publicados:** {userPosts.length}
                        </p>
                    </div>
                </div>

                <div className="profile-actions">
                    <Link to="/new-post" className="btn-create-post">
                        ➕ Crear Nueva Publicación
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <h2 className="profile-posts-title">Tus Publicaciones Recientes</h2>

            {error && <div className="error-message">{error}</div>}

            {/* Lista de Publicaciones */}
            <div className="profile-posts-grid">
                {userPosts.length === 0 ? (
                    <div className="no-posts-message">
                        Aún no has creado ninguna publicación. ¡Anímate a compartir!
                    </div>
                ) : (
                    userPosts.map((post) => (
                        <div key={post.id} className="post-card">
                            <Link to={`/post/${post.id}`} className="post-link">
                                <p className="post-description">{post.description.substring(0, 100)}...</p>
                                
                                <div className="post-meta">
                                    {post.Tags && post.Tags.map(tag => (
                                        <span key={tag.id} className="post-tag">#{tag.name}</span>
                                    ))}
                                    <span className="post-date">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default ProfilePage;
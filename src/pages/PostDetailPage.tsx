import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { fetchPostDetail, addComment } from '../api/postService'; 
import '../styles/PostDetailPage.css'; 
interface Comment {
    id: number; 
    nickName: string;
    text: string;
    timestamp: number;
}

interface PostDetail {
    id: string; 
    description: string;
    nickName: string;
    timestamp: number;
    imageUrls: string[];
    tagNames: string[]; 
    comments: Comment[];
    commentsCount: number;
}

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    
    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para cargar todos los detalles del post
    const loadPost = useCallback(async () => {
        if (!postId) {
            setError("ID de publicación no válido.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const detailedPost: PostDetail = await fetchPostDetail(postId); 
            setPost(detailedPost);
        } catch (e) {
            console.error("Error al cargar la publicación:", e);
            setError((e as Error).message || "No se pudo cargar la publicación o no existe.");
            setPost(null);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    // Efecto de carga inicial
    useEffect(() => {
        loadPost();
    }, [loadPost]);


    // Manejador del formulario de comentarios (POST /comments)
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!commentText.trim()) return;
        if (!user) {
            setError("Debes iniciar sesión para comentar.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Llama a la función de API Service con los datos necesarios
            await addComment(postId as string, user.id, commentText, user.nickName); 
            setCommentText(''); 
            
            // Recargar el post para refrescar la lista de comentarios
            await loadPost(); 
            
        } catch (e) {
            setError((e as Error).message || "Error al agregar comentario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderizado de estados
    if (loading) return <div className="message-box" style={{ margin: '30px auto' }}>Cargando publicación...</div>;
    if (error && !post) return <div className="detail-page-wrapper message-box error-box">Error: {error}</div>;
    if (!post) return null;

    return (
        <div className="detail-page-wrapper"> 
             <button 
                onClick={() => navigate('/')} 
                className="back-button" 
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                 </svg>
                 Volver al Feed
             </button>
             
             <div className="post-header"> 
                 <div className="user-avatar">
                     {post.nickName ? post.nickName[0] : 'U'}
                 </div>
                 <div>
                     <h1 className="post-title">{post.nickName || 'Usuario Desconocido'}</h1>
                     <p className="post-meta">{new Date(post.timestamp).toLocaleDateString()} a las {new Date(post.timestamp).toLocaleTimeString()}</p>
                 </div>
             </div>

             <p className="post-description">{post.description}</p> 
             
             {/* Sección de Imágenes */}
             {post.imageUrls && post.imageUrls.length > 0 && (
                 <div className="post-images-grid"> 
                     {post.imageUrls.map((img, idx) => (
                         <img 
                             key={idx} 
                             src={img} 
                             alt={`Post image ${idx + 1}`} 
                             className="post-image" 
                             onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/555555?text=Imagen+No+Disp')} 
                         />
                     ))}
                 </div>
             )}
             
             {/* Etiquetas */}
             <div className="post-tags"> 
                 {post.tagNames && post.tagNames.map((tag, idx) => ( 
                     <span key={idx}>#{tag}</span>
                 ))}
             </div>

             {/* Sección de Comentarios */}
             <h3 className="comments-section-title"> 
                 Comentarios ({post.commentsCount})
             </h3>

             {/* Formulario de Comentarios */}
             <form onSubmit={handleCommentSubmit} className="comment-form-wrapper"> 
                 <textarea
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     placeholder={user ? "Añade un comentario..." : "Inicia sesión para comentar."}
                     className="comment-form-textarea" 
                     disabled={!user || isSubmitting}
                     required
                 />
                 {error && <p className="error-message">{error}</p>}
                 <button
                     type="submit"
                     className="btn-comment-submit" 
                     disabled={!user || !commentText.trim() || isSubmitting}
                 >
                     {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
                 </button>
             </form>

             {/* Lista de Comentarios */}
             <div className="comment-list"> 
                 {post.comments && post.comments.length > 0 ? (
                     post.comments.map(comment => (
                         <div key={comment.id} className="comment-item">
                             <div className="comment-header">
                                 <span className="comment-author">{comment.nickName || 'Usuario Desconocido'}</span>
                                 <span className="comment-time">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                             </div>
                             <p className="comment-text">{comment.text}</p>
                         </div>
                     ))
                 ) : (
                     <p className="comment-list-empty" style={{textAlign: 'center', color: '#888'}}>Sé el primero en comentar esta publicación.</p>
                 )}
             </div>
        </div>
    );
};

export default PostDetailPage;
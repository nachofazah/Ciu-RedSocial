import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import type { Tag } from '../types/Tag';
import { fetchTags, createPost, associatePostImage } from '../api/postService';
import '../styles/CreatePost.css';

const CreatePostPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    //Estados del Formulario
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>(['']); 
    
    //Estados para Etiquetas
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    
    //Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    //Carga de Etiquetas al montar el componente (GET /tags)
    useEffect(() => {
        const loadTags = async () => {
            try {
                const tags = await fetchTags();
                setAvailableTags(tags);
            } catch (err: any) {
                setError(err.message || 'Error al cargar las etiquetas.');
            }
        };
        loadTags();
    }, []);

    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const handleAddImageUrl = () => {
        if (imageUrls[imageUrls.length - 1].trim()) {
            setImageUrls([...imageUrls, '']);
        }
    };

    const handleRemoveImageUrl = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls.length > 0 ? newUrls : ['']);
    };

    const handleTagChange = (tagId: number) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId) 
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!description.trim()) {
            return setError('La descripción es obligatoria.');
        }

        if (!user) {
            return setError('Error de sesión. Por favor, inicia sesión de nuevo.');
        }

        setIsLoading(true);

        try {
            //Crear Publicación (POST /posts)
            const postData = {
                description,
                userId: user.id,
                tags: selectedTagIds,
            };

            const newPostResponse = await createPost(postData);
            const postId = newPostResponse.postId;
            
            //Asociar Imágenes (POST /postimages)
            const validImageUrls = imageUrls.filter(url => url.trim());
            if (validImageUrls.length > 0) {
                await Promise.all(
                    validImageUrls.map(url => associatePostImage(url, postId))
                );
            }

            //Finalizar
            setSuccess('Publicación creada con éxito. Redirigiendo...');
            setTimeout(() => {
                navigate(`/post/${postId}`); 
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Error desconocido al crear la publicación. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <h2>✏️ Crear Nueva Publicación</h2>
            
            <form onSubmit={handleSubmit} className="post-form">
                {/* 1. Descripción */}
                <div className="form-group">
                    <label htmlFor="description" className="label-bold">Descripción (Obligatoria):</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                        className="form-input"
                    />
                </div>

                {/* 2. URLs de Imágenes */}
                <div className="form-images-group">
                    <h4 className="section-title">🖼️ URLs de Imágenes (Opcionales)</h4>
                    {imageUrls.map((url, index) => (
                        <div key={index} className="image-input-container">
                            <input
                                type="url"
                                placeholder={`URL de Imagen ${index + 1}`}
                                value={url}
                                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                className="form-input-image"
                            />
                            {imageUrls.length > 1 && (
                                <button type="button" onClick={() => handleRemoveImageUrl(index)} className="btn-remove-image">
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddImageUrl} className="btn-add-image">
                        + Añadir Imagen
                    </button>
                </div>

                {/* 3. Selección de Etiquetas */}
                <div className="form-group">
                    <label className="label-bold">🏷️ Etiquetas:</label>
                    <div className="tags-container">
                        {availableTags.length === 0 ? (
                            <p>Cargando etiquetas...</p>
                        ) : (
                            availableTags.map(tag => (
                                <label key={tag.id} className={selectedTagIds.includes(tag.id) ? 'tag-label tag-selected' : 'tag-label'}>
                                    <input
                                        type="checkbox"
                                        value={tag.id}
                                        checked={selectedTagIds.includes(tag.id)}
                                        onChange={() => handleTagChange(tag.id)}
                                        className="tag-checkbox" 
                                    />
                                    {tag.name}
                                </label>
                            ))
                        )}
                    </div>
                </div>
                
                {/* Mensajes de Estado */}
                {error && <p className="error-message">⚠️ {error}</p>}
                {success && <p className="success-message">✅ {success}</p>}

                {/* Botón de Envío */}
                <button type="submit" disabled={isLoading} className={`btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                    {isLoading ? '🚀 Publicando...' : 'Crear Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;
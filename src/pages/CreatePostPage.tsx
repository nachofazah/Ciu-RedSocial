import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types/Tag'; 
import '../styles/CreatePost.css'; 

const MAX_IMAGES = 3; 

const CreatePostPage: React.FC = () => {
    // Hooks y Contexto
    const { user, fetchTags, createPost } = useAuth();
    const navigate = useNavigate();

    // Estados del Formulario
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]); 
    const [imageUrls, setImageUrls] = useState<string[]>(['', '', '']); 
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);

    // Estados de Control de UI
    const [loadingTags, setLoadingTags] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efecto: Cargar Etiquetas Disponibles (GET /tags)
    useEffect(() => {
        const loadTags = async () => {
            setLoadingTags(true);
            try {
                const tags = await fetchTags(); 
                setAvailableTags(tags);
            } catch (e) {
                console.error("Error fetching tags:", e);
                setError("No se pudieron cargar las etiquetas. Inténtalo de nuevo.");
            } finally {
                setLoadingTags(false);
            }
        };
        loadTags();
    }, [fetchTags]);

    // Manejadores de Cambio

    const handleTagChange = (tagId: number) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    // Manejador de Envío
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user || !description.trim()) {
            setError("Debes completar la descripción y estar logueado.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createPost({
                description: description.trim(),
                tags: selectedTags,
                imageUrls: imageUrls,
            });

            navigate('/profile'); 

        } catch (e) {
            console.error("Error al crear post:", e);
            setError((e as Error).message || "Ocurrió un error al intentar crear la publicación.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <div className="error-message">Debes estar logueado para ver esta página.</div>;
    }

    // Renderizado
    return (
        <div className="form-wrapper post-form"> 
            
            <h2>Crear Nueva Publicación</h2>

            <p className="section-title" style={{ marginBottom: '20px' }}>
                ¡Comparte algo interesante, {user.nickName}!
            </p>

            <form onSubmit={handleSubmit}>
                
                {/* Campo de Descripción */}
                <div className="form-group">
                    <label htmlFor="description" className="label-bold">
                        Descripción de tu publicación *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="¿Qué tienes en mente? (Máx. 500 caracteres)"
                        rows={4}
                        maxLength={500}
                        className="form-input" 
                        required
                    />
                </div>

                {/* Sección de Etiquetas */}
                <div className="form-group">
                    <label className="label-bold">Etiquetas (Temas)</label>
                    {loadingTags && <p style={{ color: 'var(--gris-texto)' }}>Cargando etiquetas...</p>}
                    
                    <div className="tags-container"> 
                        {availableTags.map(tag => (
                            <label
                                key={tag.id}
                                className={`tag-label ${selectedTags.includes(tag.id) ? 'tag-selected' : ''}`} // 🛑 Usa tus clases
                            >
                                <input
                                    type="checkbox"
                                    className="tag-checkbox" 
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={() => handleTagChange(tag.id)}
                                />
                                #{tag.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sección de Imágenes */}
                <div className="form-images-group"> 
                    <h3 className="section-title">Imágenes (Máximo {MAX_IMAGES})</h3>
                    <p className="text-small" style={{ fontSize: '0.9em', color: 'var(--gris-texto)', marginBottom: '15px' }}>
                        Introduce URLs directas a las imágenes (e.g., de un servicio de hosting).
                    </p>
                    {[...Array(MAX_IMAGES)].map((_, index) => (
                        <div key={index} className="form-group">
                            <label htmlFor={`image-url-${index}`} className="label-bold" style={{ fontSize: '0.9em' }}>
                                URL de Imagen {index + 1} (opcional)
                            </label>
                            <input
                                id={`image-url-${index}`}
                                type="url"
                                value={imageUrls[index]}
                                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                placeholder={`URL de Imagen ${index + 1}`}
                                className="form-input-image" 
                            />
                        </div>
                    ))}
                </div>

                {/* Mensajes y Botón de Envío */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <button
                    type="submit"
                    className={`btn-primary ${isSubmitting || !description.trim() ? 'btn-disabled' : ''}`} // 🛑 Usa tus clases
                    disabled={isSubmitting || !description.trim()}
                >
                    {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;
import type { Tag } from '../types/Tag';

const BASE_URL = 'http://localhost:3001'; // ¡VERIFICA QUE ESTA URL SEA CORRECTA!

// Obtener Etiquetas (GET /tags)
export const fetchTags = async (): Promise<Tag[]> => {
    const response = await fetch(`${BASE_URL}/tags`);
    if (!response.ok) {
        throw new Error('Error al cargar las etiquetas.');
    }
    return response.json();
};


//Crear Publicación (POST /posts)

export const createPost = async (postData: { description: string, userId: number, tags: number[] }): Promise<{ postId: number }> => {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo crear la publicación.');
    }
    
    return response.json(); 
};


//Asociar Imágenes al Post (POST /postimages)

export const associatePostImage = async (url: string, postId: number): Promise<any> => {
    const response = await fetch(`${BASE_URL}/postimages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, postId }),
    });

    if (!response.ok) {
        console.error(`Error al asociar la imagen ${url} al post ${postId}`);
        return null;
    }
    return response.json();
};
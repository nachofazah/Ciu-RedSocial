import type { User } from '../types/User'; 
import type { Post, Tag } from '../types/Post'; 

const BASE_URL = '/api';

// Tipos requeridos para el servicio
export type PostImage = { id: number; url: string; postId: number; };

// Estructuras de respuesta para PostDetailPage
interface Comment {
    id: number; 
    nickName: string;
    text: string;
    timestamp: number;
}
interface PostDetailResponse {
    id: string;
    description: string;
    nickName: string; 
    timestamp: number;
    imageUrls: string[];
    tagNames: string[]; 
    comments: Comment[];
    commentsCount: number;
}


// --- LOGIN Y REGISTRO ---

// Obtener Lista de Usuarios (GET /users) para la simulación de Login
export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
        throw new Error('Error al cargar usuarios.');
    }
    return response.json();
};

// Crear nuevo Usuario (POST /users)
export const registerUser = async (userData: any): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Error desconocido al registrar el usuario.');
    }
    return response.json();
};

// --- CREACIÓN DE POSTS ---

// Obtener Etiquetas (GET /tags)
export const fetchTags = async (): Promise<Tag[]> => {
    const response = await fetch(`${BASE_URL}/tags`);
    if (!response.ok) {
        throw new Error('Error al cargar las etiquetas.');
    }
    return response.json();
};

// Crear Publicación (POST /posts)
export const createPost = async (postData: { description: string, userId: number, tagIds: number[] }): Promise<{ id: number }> => {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo crear la publicación.');
    }
    // El backend debe devolver el {postId: id_creado}
    return response.json(); 
};

// Asociar Imágenes al Post (POST /postimages)
export const associatePostImage = async (url: string, postId: number): Promise<any> => {
    const response = await fetch(`${BASE_URL}/postimages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, postId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al asociar la imagen ${url} al post ${postId}`);
    }
    return response.json();
};


// --- VISTA DE DETALLE (PostDetailPage) ---

// Obtener detalles completos del Post (PostDetailPage)
export const fetchPostDetail = async (postId: string): Promise<PostDetailResponse> => {
    // Obtener Post principal (incluyendo User y Tags)
    const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
    if (!postRes.ok) throw new Error("Publicación no encontrada.");
    const post: Post = await postRes.json(); 

    // Obtener imágenes y comentarios en paralelo
    const [imagesRes, commentsRes] = await Promise.all([
        fetch(`${BASE_URL}/postimages/post/${postId}`),
        fetch(`${BASE_URL}/comments/post/${postId}`)
    ]);

    const images: PostImage[] = imagesRes.ok ? await imagesRes.json() : [];
    const commentsData: any[] = commentsRes.ok ? await commentsRes.json() : [];

    // Formatear comentarios
    const comments: Comment[] = commentsData.map(c => ({
        id: c.id,
        nickName: c.User.nickName || 'Usuario Desconocido',
        text: c.content,
        timestamp: new Date(c.createdAt).getTime(),
    })).sort((a, b) => a.timestamp - b.timestamp); // Ordenar por tiempo de creación

    return {
        id: postId,
        description: post.description,
        nickName: post.User.nickName,
        timestamp: new Date(post.createdAt).getTime(),
        imageUrls: images.map(img => img.url),
        tagNames: post.Tags.map(tag => tag.name),
        comments: comments,
        commentsCount: comments.length,
    };
};

// Agregar un comentario (POST /comments)
export const addComment = async (postId: number, userId: number, content: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: Number(postId), userId, content }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el comentario.');
    }
    return response.json();
};


// --- VISTA DE PERFIL (ProfilePage) ---

// Obtener Posts por ID de Usuario (GET /posts?userId=xxx)
export const fetchPostsByUserId = async (userId: number): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts?UserId=${userId}`);
    if (!response.ok) {
        throw new Error(`Error al cargar posts del usuario ${userId}.`);
    }
    return response.json();
};


// --- OPTIMIZACIÓN DE HOME (HomePage) ---

interface PostData {
    posts: Post[];
    commentsCount: { [key: number]: number };
    postImages: { [key: number]: string[] };
}

export const fetchAllPostsData = async (): Promise<PostData> => {
    const postsRes = await fetch(`${BASE_URL}/posts`);
    if (!postsRes.ok) throw new Error("Error al obtener las publicaciones.");
    const posts: Post[] = await postsRes.json();

    const promises = posts.flatMap(post => [
        // 1. Fetch de comentarios (para contar)
        fetch(`${BASE_URL}/comments/post/${post.id}`).then(res => res.json()),
        // 2. Fetch de imágenes
        fetch(`${BASE_URL}/postimages/post/${post.id}`).then(res => res.json() as Promise<PostImage[]>)
    ]);

    const results = await Promise.all(promises);

    const commentsCount: { [key: number]: number } = {};
    const postImages: { [key: number]: string[] } = {};

    results.forEach((data, index) => {
        const postIndex = Math.floor(index / 2);
        const postId = posts[postIndex].id;

        if (index % 2 === 0) {
            commentsCount[postId] = (data as any[]).length;
        } else {
            postImages[postId] = (data as PostImage[]).map(img => img.url);
        }
    });

    return { posts, commentsCount, postImages };
};
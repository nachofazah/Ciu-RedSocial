import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Bienvenido a la Red Social UNAHUR</h2>
            <p>Aquí irá el feed de publicaciones (Módulo 2).</p>
            <p>Por ahora, puedes probar la ruta de tu módulo:</p>
            <a href="/create-post" style={{ color: '#33A3A9', fontWeight: 'bold' }}>Ir a Crear Publicación (Ruta Protegida)</a>
        </div>
    );
};

export default HomePage;
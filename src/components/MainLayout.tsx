import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout: React.FC = () => {
    return (
        <>
            <Header />
            <main className="pt-5" style={{ minHeight: '100vh' }}>
                {/* Outlet renderiza el componente de la ruta actual (Home, Profile, etc.) */}
                <Outlet /> 
            </main>
        </>
    );
};

export default MainLayout;
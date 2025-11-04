import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/User';

// Definición de tipos para el Contexto
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (nickName: string) => Promise<void>;
    logout: () => void;
}

// 1. Crear el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ** NOTA IMPORTANTE: Esta es una implementación SIMULADA **
const FAKE_USER: User = { 
    id: 101, // ¡Este ID será usado por tu CreatePostPage!
    nickName: 'MayraGG',
    firstName: 'Mayra',
    lastName: 'Garcia',
    email: 'mayra@unahur.edu.ar'
};

// 2. Crear el Proveedor del Contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Inicialmente, simulamos que el usuario ya está logueado para pruebas
    const [user, setUser] = useState<User | null>(FAKE_USER);
    const isAuthenticated = user !== null;

    const login = async (nickName: string) => {
        // En la versión final, aquí se haría un fetch a POST /login
        console.log(`[SIMULACIÓN] Intento de login con nickName: ${nickName}`);
        
        // Asumimos éxito y seteamos al usuario de prueba
        setUser(FAKE_USER);
    };

    const logout = () => {
        console.log("[SIMULACIÓN] Logout realizado.");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Crear el Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
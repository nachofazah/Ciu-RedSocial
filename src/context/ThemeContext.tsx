import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Definir el tipo de datos del contexto (tema y función de cambio)
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// Crear el Contexto con valores por defecto 
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Crear el Proveedor (Provider) que envuelve la aplicación
interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const storedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
        
        // Si no hay nada, usa 'dark' (asumiendo que ese es tu tema principal)
        return storedTheme || 'dark'; 
    });

    // Efecto para aplicar la clase CSS al <body>
    useEffect(() => {
        // Asigna la clase 'light-mode' o 'dark-mode' al elemento body
        document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
        
        // Guarda el tema actual en el almacenamiento local
        localStorage.setItem('app-theme', theme);
    }, [theme]); 

    // Función para cambiar el tema
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para usar el contexto (useTheme)
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};
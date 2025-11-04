import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  loginUser: () => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const loginUser = () => {
    // Registra el inicio de sesión
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    // Registra el cierre de sesión
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


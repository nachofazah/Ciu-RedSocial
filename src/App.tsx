import './App.css'
import RegistroUsuario from './pages/RegistroUsuario'
import Notificacion from './components/Notificacion';
import { useState } from 'react';
function App() {

  const [notification, setNotification] = useState<React.ReactElement | null>(null);

  const showNotification = (message: string, onCloseDo?: () => void) => {
    const notif = <Notificacion message={message} onClose={() => {
      setNotification(null);
      if (onCloseDo) onCloseDo();
    }} />;
    setNotification(notif);
  }

  return (
    <>
      {notification}
      <RegistroUsuario showNotification={showNotification} />
    </>
  )
}
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";

export const App: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage/>} />

          {/* Private route using PrivateRoute component */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

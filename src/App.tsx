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

export default App

import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './routes/privateRoutes'
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import { AuthProvider } from './context/authProvider';
import Profile from './pages/Profile';

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
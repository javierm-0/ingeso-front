import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto que maneja el estado de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Mantener los datos del usuario
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const navigate = useNavigate();

  // Función para comprobar si el usuario tiene un token válido
  const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Si hay un token, intentamos decodificarlo
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        // Si el token es válido y no ha expirado, cargamos los datos del usuario
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData);
        setLoading(false); // Terminamos la carga
      } else {
        // Si el token ha expirado, limpiamos y redirigimos al home
        localStorage.clear();
        setUser(null);
        setLoading(false);
        navigate('/'); // Redirigimos al home (login)
      }
    } else {
      setLoading(false); // No hay token, terminamos la carga
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/'); // Redirigimos al home (login)
  };

  // Verificamos el estado de autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

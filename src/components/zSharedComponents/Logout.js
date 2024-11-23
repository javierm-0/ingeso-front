// src/components/zSharedComponents/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//componente encargado de manejar la limpieza de data residual en localStorage y regresar a la pagina de inicio
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Eliminar los datos del usuario y el token de localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');

    // Redirigir al usuario a la página principal o login
    navigate('/');
  }, [navigate]);

  return null; // Este componente no necesita renderizar nada visualmente
};

export default Logout;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//de momento no se esta usando este componente porque user es null al recargar xd

const AccessDenied = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al login después de 3 segundos
    const timer = setTimeout(() => {
      navigate('/logout');  // Aquí puedes redirigir a donde quieras
    }, 3000);

    // Limpiar el timer en caso de que el componente se desmonte antes de que el tiempo se complete
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
        <p className="text-gray-700 mt-4">
          Intento de acceso no autorizado, vuelve a iniciar sesión.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
    // Si el usuario no está autenticado
     if (!user) {
      return <Navigate to="/" />;
    }
    
    // Si el rol del usuario no está en los roles permitidos, mostrar AccessDenied
    if (!allowedRoles.includes(user.role)) {
      return <AccessDenied />;
    }

  // Si el usuario tiene el rol adecuado, renderizar el contenido de la ruta
  return children;
};

export default ProtectedRoute;

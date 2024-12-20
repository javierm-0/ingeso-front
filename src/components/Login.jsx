import { useState ,useEffect} from 'react';
import ucnLogo from '../assets/ucnLogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tostadas from './zSharedComponents/Tostadas';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from "jwt-decode";


/**
 * @typedef {Object} User
 * @property {string} firstName - El nombre del usuario
 * @property {string} lastName - El apellido del usuario
 * @property {string} email - El correo electrónico del usuario
 * @property {string} rut - El RUT del usuario
 * @property {string} role - El rol del usuario
 */

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Hook de react-router-dom para redirigir


  const checkAccessToken = async () => {
    const AccessToken = localStorage.getItem('accessToken');
    if (AccessToken) {
      try {
        const decodedToken = jwtDecode(AccessToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          const userId = decodedToken.sub;
          const response = await axios.get(`http://localhost:3000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${AccessToken}` //con esto parchamos una vulnerabilidad epicamente
            }
          });
          const user = response.data;
          localStorage.setItem('userData', JSON.stringify(user));
          // Si el rol está presente, redirigimos según el rol
          if (user.role === 'admin') {
            navigate('/admin');
          } else if (user.role === 'teacher') {
            navigate('/teacher');
          } else if (user.role === 'student') {
            navigate('/student');
          } else {
            Tostadas.ToastWarning(`Rol de usuario no reconocido: ${user.role}`);
          }
        } else {
          Tostadas.ToastError("Token expirado.");
        }
      } catch (error) {
        console.error("Error al decodificar el token o al obtener los datos del usuario: ", error);
        Tostadas.ToastError("Token inválido o error al obtener los datos del usuario.");
      }
    }
  };

  // Llamar a checkAccessToken cuando el componente se monta
  useEffect(() => {
    checkAccessToken();
  }, []);
  


  const handleLoginClick = async (evento) =>{
    evento.preventDefault();

    if (!email || !password) {
      Tostadas.ToastInfo("Por favor ingrese correo y contraseña.");
      return;
    }

    if(localStorage.getItem('userData') ||localStorage.getItem('accessToken')){
      localStorage.clear();//antes de logear, limpiar data residual de otra sesion
    }

    try {
      //axios request
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });
      if (response.status === 201) {
        //201 es good, dice created, probablemente sea el access token lo que fue creado
      
        localStorage.setItem('accessToken', response.data.access_token); 
        const AccessToken = localStorage.getItem('accessToken');
        const decodedToken = jwtDecode(AccessToken);
        const userId = decodedToken.sub;//sub es el id del usuario

        //teniendo userId usamos el endpoint para obtener obj user
        try {
          const req = await axios.get(`http://localhost:3000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${AccessToken}` //con esto parchamos una vulnerabilidad epicamente
            }
          });
          const user = req.data;
          localStorage.setItem('userData',JSON.stringify(user));
          Tostadas.ToastSuccess("Ha logrado ingresar, felicidades");
          const USERDATA = JSON.parse(localStorage.getItem('userData'));
          if(USERDATA)
          {
            if (USERDATA.role === 'admin') 
              {
                Tostadas.ToastSuccess("¡Bienvenido Administrador!");
                setTimeout(() => {
                  navigate('/admin');
                }, 1300);
              } 
            else if (USERDATA.role === 'teacher') 
              {
                Tostadas.ToastSuccess("¡Bienvenido Profesor!");
                setTimeout(() => {
                  navigate('/teacher');
                }, 1300);
              } 
            else if (USERDATA.role === 'student')
              {
                Tostadas.ToastSuccess("¡Bienvenido Estudiante!");
                setTimeout(() => {
                  navigate('/student');
                }, 1300);
              } 
            else 
              {
                Tostadas.ToastWarning(`Rol de usuario no reconocido. ${USERDATA.role}`);
              }
            }
        } catch (error) {
          console.error("Error al obtener los datos del usuario: ", error);
          Tostadas.ToastError("Error al obtener los datos del usuario: ", error);
        }

        

      } else {
        //goodn't
        Tostadas.ToastWarning("Credenciales inválidas o error en el servidor.");
      }
      //errores
    } catch (error) {
      if (error.response) {
        // El servidor respondio con un codigo de estado fuera del rango 2xx
        Tostadas.ToastError("Credenciales inválidas: ");
      } else if (error.request) {
        //No se recibio respuesta del servidor(timeout)
        Tostadas.ToastError("Hubo un error en la conexión con el servidor. ");
      } else {
        //que pasa realmente
        Tostadas.ToastError("Ocurrió un error inesperado. \n"+error);
      }
    }
  
  };

  return (
    <div className="min-h-screen bg-[#0d5c71] flex justify-center items-center">
        <div className="max-w-[1280px] mx-auto p-8 text-center">
        <div className="w-[400px] h-[500px] bg-[#164a5f] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-start rounded-2xl">
          <img src={ucnLogo} className="w-[120px] h-[120px] absolute top-3% translate-y-4 mb-2.5" alt="Logo UCN" />
          <h1 className="m-0 mb-1 text-[1.625rem] leading-tight relative top-40 font-bold text-[#ffffff]">¡Bienvenid@ al Sistema!</h1>
          <p className="w-[350px] text-sm leading-none text-center absolute top-[42%] text-white">Inicie sesión para acceder a las funcionalidades del sistema</p>

          <form className="flex flex-col items-center relative top-60 w-full">
            <input 
              type="text" 
              placeholder="Correo" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
              autoComplete="off"
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="off"
              name="lalalfafdksafkjfs"
              className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
            />
            <button 
              type="submit" 
              className="p-2 px-5 border-none rounded bg-[#00001a] text-white relative top-2 cursor-pointer hover:bg-[#1559a180] active:font-extrabold"
              onClick={handleLoginClick}
            >
              Iniciar Sesión
              
            </button>
          </form>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};
export default Login;

import { useState } from 'react';
import ucnLogo from '../assets/ucnLogo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
  };

  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div className="w-[400px] h-[500px] bg-[#164a5f] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-start rounded-2xl">
        <img src={ucnLogo} className="w-[120px] h-[120px] absolute top-3% translate-y-4 mb-2.5" alt="Logo UCN" />
        <h1 className="m-0 mb-1 text-[1.625rem] leading-tight relative top-40 font-bold text-[#213547]">¡Bienvenid@ al Sistema!</h1>
        <p className="w-[350px] text-sm leading-none text-center absolute top-[40%]">Inicie sesión para acceder a las funcionalidades del sistema</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center relative top-60 w-full">
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
          />
          <button 
            type="submit" 
            className="p-2 px-5 border-none rounded bg-[#164e63bb] text-white relative top-2 cursor-pointer hover:bg-[#1559a180]"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;

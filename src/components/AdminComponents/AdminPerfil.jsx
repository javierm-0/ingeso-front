import { useState,useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from 'react-toastify';
import Tostadas from "../zSharedComponents/Tostadas";

const AdminPerfil =() =>{
    
    const [rut,setRut] = useState('');
    const [nombre,setNombre] = useState('');
    const [id,setId] = useState('');
    const [isResetting, setResetting] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const USERDATA = JSON.parse(localStorage.getItem('userData'));
        if (USERDATA) {
          setRut(USERDATA.rut);
          setNombre(USERDATA.firstName);
          setId(USERDATA.id);
        }
      }, []);

    const handleClick = () => {
        if (isResetting) {
            passwordChange();
        }
        else {
            setResetting(true);
        }
    };

    const passwordChange = async () => {
        if (!password) {
            console.error("Ingresa una nueva contraseña");
            Tostadas.ToastWarning("Ingresa una nueva contraseña.");
            return;
        }
      
        setLoading(true);

        try {
          const response = await fetch(`http://localhost:3000/user/update/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({password}),
          });
    
          if (response.ok) {
            console.log("Contraseña actualizada correctamente");
            Tostadas.ToastSuccess("Contraseña actualizada.");
            setResetting(false);
            setPassword('');
          } else {
            console.error("Error al actualizar la contraseña");
            Tostadas.ToastError("Error al actualizar la contraseña.");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="fixed top-0 left-0 w-72 h-screen">
                <AdminSidebar />
            </div>
    
            <div className="ml-80 mt-12">
                <div className="flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#164a5f]">Perfil de administrador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="font-semibold">Nombre</h3>
                            <p className="text-lg">{nombre}</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="font-semibold">RUT</h3>
                            <p className="text-lg">{rut}</p>
                        </div>
                    </div>
                </div>
                <div className="ml-[22px]">
                    <button 
                    className={`bg-gray-50 shadow-lg rounded-lg p-4 text-black font-semibold transition-all duration-150 ${isResetting ? 'translate-x-[370px]' : ''} relative z-10`}
                    onClick={handleClick}
                    disabled={loading}>
                    {isResetting ? 'Actualizar Contraseña' : 'Restablecer Contraseña'}
                    </button>

                    {isResetting && (
                    <div className="transition-all duration-300 transform opacity-100 translate-x-0 mt-[-43px]">
                        <input
                        type="password"
                        placeholder="Introduce tu nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-[75%] py-2 px-4 border-2 border-gray-300 rounded-lg relative z-0"
                        />
                    </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
    
    
};
export default AdminPerfil;
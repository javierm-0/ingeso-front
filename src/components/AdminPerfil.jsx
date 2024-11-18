import { useState,useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminPerfil =() =>{
    
    const [rut,setRut] = useState('');
    const [nombre,setNombre] = useState('');

    useEffect(() => {
        const USERDATA = JSON.parse(localStorage.getItem('userData'));
        if (USERDATA) {
          setRut(USERDATA.rut);
          setNombre(USERDATA.firstName);
        }
      }, []);

    

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
            </div>
        </div>
    );
    
    
};
export default AdminPerfil;
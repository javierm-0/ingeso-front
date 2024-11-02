import { useState } from "react";
import StudentSidebar from "./StudentSidebar";

const StudentPerfil =() =>{
    const [añoIngreso,setAñoIngreso] = useState('2022');
    const [rut,setRut] = useState('11.111.111-1');
    const [nombre,setNombre] = useState('juan');

    

    return (
        <div className="flex">
            <div className=''>
                <StudentSidebar></StudentSidebar>
            </div>

            <div className='ml-80 mt-12 mr-36 w-[50%]'>
                <div className="flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#164e63bb]">Perfil del Estudiante</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="font-semibold">Nombre</h3>
                            <p className="text-lg">{nombre}</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="font-semibold">RUT</h3>
                            <p className="text-lg">{rut}</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <h3 className="font-semibold">Año de Ingreso</h3>
                            <p className="text-lg">{añoIngreso}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};
export default StudentPerfil;
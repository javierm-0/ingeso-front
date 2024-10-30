import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import ucnLogo from '../assets/IsologoUCN.png';
import iconClose from '../assets/arrow-reduce-tag.svg';
import iconHome from '../assets/home.svg';
import iconUser from '../assets/profile-circle.svg';
import iconProgram from '../assets/submit-document.svg';
import iconCheck from '../assets/doc-glass-in.svg';
import iconAdd from '../assets/page-plus.svg'
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";

//Cerrar sesion
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

const AdminSidebar = () =>{
    const [isOpen,setIsOpen] = useState(true);
    const Menus = [
        {title: "Inicio", icon: <img src={iconHome}/>, link: "/admin"},
        {title: "Perfil", icon: <img src={iconUser}/>, link: "/admin/adminProfile"},
        {title: "Crear encuesta", icon: <img src={iconAdd}/>, link: ""},
        {title: "Subir fechas de envio de encuestas existentes", icon: <img src={iconProgram} />, link: ""},
        {title: "Ver Respuestas", icon:<img src={iconCheck} />, link: ""},
        {title: "Enviar alerta a estudiantes", icon:<img src={iconProgram} />, link: ""},
        {title: "Ver dashboard", icon:<RiDashboardFill />, link: ""},
        {title: "Cerrar Sesión", spacing: true, icon: <img src={iconClose} />, link: "/", isExitButton: true},
    ];

    const navigate = useNavigate(); // Hook de react-router-dom para redirigir

    const handleLogout = () => {
      logout(); // Cierra la sesión
      navigate('/'); // Redirige a la página de inicio
    };

    return(
        <div className="w-72">
            <div className={`bg-[#164e63bb] h-screen p-5 pt-8 ${isOpen? "w-72":"w-28"} duration-300 relative rounded-tr-2xl`}>
                <BsArrowLeftSquareFill className={`bg-[#3ab1b177] text-gray-200 
                text-3xl rounded-full absolute -right-3.5 top-10 border
                border-[#3ab1b177] cursor-pointer
                 ${!isOpen && "rotate-180"}`}
                onClick={() => setIsOpen(!isOpen)}/>

                <img src={ucnLogo} className={`text-4xl
                rounded cursor-pointer block float-left mr-2 mb-8
                `}/>
                <p className='text-white font-bold'>ADMIN</p>
           <ul className="pt-2">
            {Menus.map((menu, index) => (
                <React.Fragment key={index}>
                    <li 
                        key={index} 
                        className={`text-gray-300 text-sm flex
                        items-center gap-x-4 cursor-pointer p-2
                        hover:bg-white rounded-md 
                        ${menu.spacing ? "mt-24":"mt-2"}`}
                        onClick={() => menu.isExitButton ? handleLogout() : navigate(menu.link)
                        }
                    >
                        <span className="text-2xl block float-left">
                            {menu.icon ? menu.icon : <img src={iconUser} />}
                        </span>
                        <p className={`text-base font-medium flex-1 text-[#213547]
                            ${!isOpen && "hidden"}`}>{menu.title}
                        </p>
                    </li>
                </React.Fragment>
            ))}

           </ul>

            </div>

        </div>
    );    

};

export default AdminSidebar;
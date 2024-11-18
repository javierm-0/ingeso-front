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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
  };

const AdminSidebar = () =>{
    const [isOpen,setIsOpen] = useState(true);
    const Menus = [
        {title: "Inicio", icon: <img src={iconHome}/>, link: "/admin"},
        {title: "Perfil", icon: <img src={iconUser}/>, link: "/admin/adminProfile"},
        {title: "Crear encuesta", icon: <img src={iconAdd}/>, link: "/admin/crearEncuesta"},
        {title: "Subir fechas de envio de encuestas existentes", icon: <img src={iconProgram} />, link: ""},
        {title: "Ver Respuestas", icon:<img src={iconCheck} />, link: ""},
        {title: "Ver dashboard", icon:<RiDashboardFill />, link: ""},
        {title: "Cerrar Sesión", spacing: true, icon: <img src={iconClose} />, link: "/", isExitButton: true},
    ];

    const navigate = useNavigate(); // Hook de react-router-dom para redirigir

    const handleLogout = () => {
      logout(); // Cierra la sesión
      navigate('/'); // Redirige a la página de inicio
    };

    return(        
        <div className="fixed w-72 h-screen">
            <div className={`bg-[#164a5f] h-screen p-5 pt-8 absolute top-0 left-0 ${isOpen? "w-72":"w-28"} duration-300 rounded-tr-2xl`}>
                <BsArrowLeftSquareFill className={`bg-[#164a5f] text-gray-200 
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
                        className={`text-white text-sm flex
                        items-center gap-x-4 cursor-pointer p-2
                        rounded-md 
                        ${menu.spacing ? "mt-24 bottom-2 absolute":"mt-2"}`}
                        onClick={() => menu.isExitButton ? handleLogout() : navigate(menu.link)
                        }
                    >
                        <span className="text-2xl block float-left">
                            {menu.icon ? menu.icon : <img src={iconUser} />}
                        </span>
                        <p className={`text-base font-medium flex-1 text-white hover:text-blue-400
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
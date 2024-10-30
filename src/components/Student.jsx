import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ucnLogo from '../assets/IsologoUCN.png';
import iconClose from '../assets/arrow-reduce-tag.svg';
import iconOpen from '../assets/arrow-enlarge-tag.svg';
import iconHome from '../assets/home.svg';
import iconUser from '../assets/profile-circle.svg';
import iconProgram from '../assets/submit-document.svg';
import iconCheck from '../assets/doc-glass-in.svg';
import StudentSidebar from './StudentSidebar';

const Student = () => {
  const [isVisible, setVisible] = useState(true);
  const toggleBar = () => {
    setVisible(!isVisible);
  };

  return (
    <div className='flex'>
        <div className=''>
            <StudentSidebar></StudentSidebar>
        </div>

        <div className='ml-12 mt-12 mr-36 w-[50%]'>
            <h2 className="text-2xl font-bold text-[#164e63bb]">¡Bienvenido/a al Sistema de Encuestas!</h2>
            <p className="mt-2 text-justify">
            El Sistema de Encuestas es una plataforma destinada a facilitar la realización y gestión de encuestas por parte de los estudiantes de la Universidad Católica del Norte que estén realizando el Magíster en Gestión Ambiental.
            </p>
            <br></br>
            <h2 className="text-2xl font-bold mt-4 text-[#164e63bb]">Contacto</h2>
            <p>
            Dirección Escuela Prevención de Riesgos y Medio Ambiente: dir.epryma@ucn.cl<br />
            Director Magister Gestión Ambiental: dirmga@ucn.cl
            </p>
        </div>
    </div>
  );
};

export default Student;

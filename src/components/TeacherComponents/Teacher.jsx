import React, { useState } from 'react';
import TeacherSidebar from './TeacherSidebar';

const Teacher = () => {
  const [isVisible, setVisible] = useState(true);
  const toggleBar = () => {
    setVisible(!isVisible);
  };

  return (
    <div className='flex'>
        <div className=''>
            <TeacherSidebar></TeacherSidebar>
        </div>

        <div className='ml-12 mt-12 mr-36 w-[50%]'>
            <h2 className="text-2xl font-bold text-[#164a5f]">¡Bienvenido/a al Sistema de Encuestas!</h2>
            <p className="mt-2 text-justify">
            El Sistema de Encuestas es una plataforma destinada a facilitar la realización y gestión de encuestas por parte de los estudiantes de la Universidad Católica del Norte que estén realizando el Magíster en Gestión Ambiental.
            </p>
            <br></br>
            <h2 className="text-2xl font-bold mt-4 text-[#164a5f]">Contacto</h2>
            <p>
            Dirección Escuela Prevención de Riesgos y Medio Ambiente: dir.epryma@ucn.cl<br />
            Director Magister Gestión Ambiental: dirmga@ucn.cl
            </p>
        </div>
    </div>
  );
};

export default Teacher;

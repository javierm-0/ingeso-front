import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../TeacherSidebar';

const ListadoAsignaturaProfe = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const subjects = userData?.subjects || [];
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className='w-1/5'>
          <TeacherSidebar />
      </div>

    <div className='ml-40 mt-12 mr-36 w-[50%] bg-white p-8 rounded-lg shadow-lg'>
        <h1 className="text-2xl font-bold mb-4">Listado de Asignaturas</h1>
        {subjects.length === 0 ? (
          <p className="text-gray-500">No tienes asignaturas asignadas.</p>
        ) : (
          <ul className="space-y-4">
            {subjects.map((subject, index) => (
              <li key={index} className="border p-4 rounded-lg shadow-md bg-gray-100">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">{subject.asignatura}</h2>
                <button
                  onClick={() => navigate(`/teacher/verRespuestas/asignatura`,{state:{subject}})}
                  className="bg-[#164a5f] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1f5c71] active:font-extrabold"
                >
                  Ver Respuestas
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListadoAsignaturaProfe;

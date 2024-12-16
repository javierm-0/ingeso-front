import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import axios from 'axios';

const ListadoAsignaturaAdmin = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado para gestionar la carga
  const [error, setError] = useState(null);  // Estado para gestionar errores
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch asignaturas desde el endpoint usando axios
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/subjects/');
        setSubjects(response.data);  // Actualizar el estado con los datos recibidos
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Error al cargar las asignaturas');  // Establecer error si hay problemas con el fetch
      } finally {
        setLoading(false);  // Marcar como cargado después de la solicitud
      }
    };

    fetchSubjects();
  }, []);


  if (loading) {
    return <p>Cargando respuestas...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex">
      <div className="w-1/5">
        <AdminSidebar />
      </div>

      <div className="ml-40 mt-12 mr-36 w-[50%] bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Listado de Asignaturas</h1>
        {subjects.length === 0 ? (
          <p className="text-gray-500">No hay asignaturas disponibles.</p>
        ) : (
          <ul className="space-y-4">
            {subjects.map((subject, index) => {
              return (
                <li key={index} className="border p-4 rounded-lg shadow-md bg-gray-100">
                  <h2 className="text-lg font-semibold text-blue-800 mb-2">{subject.asignatura}</h2>
                  <button
                    onClick={() => {
                      navigate(`/admin/verRespuestas/asignatura`, { state: { subject } });
                    }}
                    className="bg-[#164a5f] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1f5c71] active:font-extrabold"
                  >
                    Ver Respuestas
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListadoAsignaturaAdmin;

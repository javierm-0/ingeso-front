import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';

const EliminarAsignaturaProf = () => {
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { teacher } = location.state || {}; // Recibimos el profesor serializado

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        if (!teacher || !teacher.id) {
          setError('No se encontró información del profesor.');
          return;
        }

        const response = await axios.get(`http://localhost:3000/user/${teacher.id}/subjects`);
        setAssignedSubjects(response.data);
      } catch (err) {
        setError('Error al cargar las asignaturas asignadas al profesor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedSubjects();
  }, [teacher]);

  const handleRemoveSubject = async (subject) => {
    try {
      const subjectName = encodeURIComponent(subject.asignatura); // Codificar la asignatura para URL
      const response = await axios.patch(
        `http://localhost:3000/user/${teacher.id}/remove-subject/${subjectName}`
      );

      if (response.status === 200) {
        console.log(`Asignatura ${subject.asignatura} eliminada correctamente.`);
        // Actualizar la lista de asignaturas asignadas
        setAssignedSubjects(prevSubjects =>
          prevSubjects.filter(subj => subj.asignatura !== subject.asignatura)
        );
        // Actualizar la información de teacher en localStorage
        const updatedTeacher = { ...teacher, subjects: assignedSubjects.filter(subj => subj.asignatura !== subject.asignatura) };
        localStorage.setItem('selectedTeacher', JSON.stringify(updatedTeacher));
        // Marcar que se debe hacer un "refetch" de los profesores
        localStorage.setItem('refetchTeachers', 'true');
      }
    } catch (error) {
      console.error('Error al eliminar la asignatura:', error);
      setError('No se pudo eliminar la asignatura. Por favor, intenta nuevamente.');
    }
  };

  if (loading) {
    return <div className="text-center text-blue-500">Cargando asignaturas asignadas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Eliminar Asignaturas de {teacher.firstName} {teacher.lastName}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Selecciona una asignatura para eliminarla del profesor.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {assignedSubjects.length > 0 ? (
            assignedSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-md shadow-sm hover:bg-red-300 cursor-pointer"
                onClick={() => handleRemoveSubject(subject)}
              >
                <p className="text-lg font-medium text-gray-800">{subject.asignatura}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Este profesor no tiene asignaturas asignadas.
            </p>
          )}
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate(-1)} // Volver a la pantalla anterior
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default EliminarAsignaturaProf;
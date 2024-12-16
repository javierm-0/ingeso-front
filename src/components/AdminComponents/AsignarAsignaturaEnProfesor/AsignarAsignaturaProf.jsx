import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';

const AsignarAsignaturaProf = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { teacher } = location.state || {}; // Recibimos el profesor

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/subjects/');
        const fetchedSubjects = response.data;

        // Filtrar asignaturas no asignadas al profesor
        const teacherSubjects = teacher.subjects.map(subj => subj.asignatura);
        const filteredSubjects = fetchedSubjects.filter(
          subject => !teacherSubjects.includes(subject.asignatura)
        );

        setAllSubjects(fetchedSubjects);
        setAvailableSubjects(filteredSubjects);
      } catch (err) {
        setError('Error fetching asignaturas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [teacher]);

  const handleAssignSubject = async (subject) => {
    try {
      const subjectName = encodeURIComponent(subject.asignatura); // Codificar la asignatura para URL
      const response = await axios.patch(
        `http://localhost:3000/user/${teacher.id}/assign-subject/${subjectName}`
      );

      if (response.status === 200) {

        const updatedTeacher = {
          ...teacher,
          subjects: [...teacher.subjects, subject],
        };

        
        localStorage.setItem('selectedTeacher', JSON.stringify(updatedTeacher));

        
        setAvailableSubjects(prevSubjects =>
          prevSubjects.filter(subj => subj.asignatura !== subject.asignatura)
        );

        localStorage.setItem('refetchTeachers', 'true');
    
      }
    } catch (error) {
      console.error('Error al asignar la asignatura:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-blue-500">Loading subjects...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Asignar Asignaturas a {teacher.firstName} {teacher.lastName}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Selecciona una asignatura para asignar al profesor.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {availableSubjects.length > 0 ? (
            availableSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer"
                onClick={() => handleAssignSubject(subject)}
              >
                <p className="text-lg font-medium text-gray-800">{subject.asignatura}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Todas las asignaturas ya están asignadas a este profesor.
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

export default AsignarAsignaturaProf;

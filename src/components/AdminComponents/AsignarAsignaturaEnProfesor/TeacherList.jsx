import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/all');
        const filteredTeachers = response.data.filter(user => user.role === 'teacher');
        setTeachers(filteredTeachers);
      } catch (err) {
        setError('Error fetching teachers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Verificar si hay un "refetch" en localStorage
    const shouldRefetch = localStorage.getItem('refetchTeachers') === 'true';

    if (shouldRefetch) {
      fetchTeachers();
      localStorage.removeItem('refetchTeachers'); // Limpiar el flag de refetch
    } else {
      fetchTeachers();
    }
  }, []);

  const handleTeacherClick = (teacher) => {
    navigate('/admin/elegirProfesor/asignarAsignaturaProfesor', { state: { teacher } });
  };

  const handleTeacherClickRemoveSubject = (teacher) => {
    navigate('/admin/elegirProfesor/quitarAsignatura', { state: { teacher } });
  };

  if (loading) {
    return <div className="text-center text-blue-500">Loading teachers...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <AdminSidebar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Lista de Profesores</h1>
        <div className="grid grid-cols-1 gap-4">
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="block bg-white shadow-md rounded-md p-4 border border-gray-200 hover:bg-gray-100"
            >
              <p className="text-lg font-medium text-gray-800">{teacher.firstName} {teacher.lastName}</p>
              <p className="text-sm text-gray-600">Email: {teacher.email}</p>
              <p className="text-sm text-gray-600">RUT: {teacher.rut}</p>
              <p className="text-sm text-gray-600">
                Asignaturas: {teacher.subjects.length > 0 ? (
                  teacher.subjects.map((subject, idx) => (
                    <span key={idx} className="block">- {subject.asignatura}</span>
                  ))
                ) : (
                  <span className="text-gray-500">Sin asignaturas</span>
                )}
              </p>

              <button
                onClick={() => navigate('/admin/elegirProfesor/asignarAsignaturaProfesor', { state: { teacher } })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:scale-95"
              >
                Asignar Asignaturas
              </button>

              <button
                onClick={() => navigate('/admin/elegirProfesor/quitarAsignatura', { state: { teacher } })}
                className="mt-2 ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 active:scale-95"
              >
                Ir a eliminar asignatura
              </button>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/all');
        const filteredStudents = response.data.filter(user => user.role === 'student');
        setStudents(filteredStudents);
      } catch (err) {
        setError('Error fetching students.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Verificar si hay un "refetch" en localStorage
    const shouldRefetch = localStorage.getItem('refetchStudents') === 'true';

    if (shouldRefetch) {
      fetchStudents();
      localStorage.removeItem('refetchStudents');  // Limpiar el flag de refetch
    } else {
      fetchStudents();
    }
  }, []);

  const handleStudentClick = (student) => {
    navigate('/admin/elegirEstudiante/asignarAsignatura', { state: { student } });
  };

  if (loading) {
    return <div className="text-center text-blue-500">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <AdminSidebar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Lista de Estudiantes</h1>
        <div className="grid grid-cols-1 gap-4">
          {students.map((student, index) => (
            <div
              key={index}
              className="block bg-white shadow-md rounded-md p-4 border border-gray-200 hover:bg-gray-100"
            >
              <p className="text-lg font-medium text-gray-800">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-gray-600">Email: {student.email}</p>
              <p className="text-sm text-gray-600">RUT: {student.rut}</p>
              <p className="text-sm text-gray-600">
                Asignaturas: {student.subjects.length > 0 ? (
                  student.subjects.map((subject, idx) => (
                    <span key={idx} className="block">- {subject.asignatura}</span>
                  ))
                ) : (
                  <span className="text-gray-500">Sin asignaturas</span>
                )}
              </p>

              <button
                onClick={() => navigate('/admin/elegirEstudiante/asignarAsignatura', { state: { student } })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:scale-95"
              >
                Asignar Asignaturas
              </button>

              <button
                onClick={() => navigate('/admin/elegirEstudiante/quitarAsignatura', { state: { student } })}
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

export default StudentList;

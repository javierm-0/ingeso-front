import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar';
import Tostadas from '../../zSharedComponents/Tostadas';
import { ToastContainer } from 'react-toastify';

const SurveyAssignmentForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Cargar asignaturas
    axios.get('http://localhost:3000/subjects/')
      .then(response => setSubjects(response.data))
      .catch(error => console.error('Error fetching subjects', error));
  }, []);

  // Cargar encuestas por asignatura
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    axios.get(`http://localhost:3000/user/students/subject/${encodeURIComponent(subject.asignatura)}`)
      .then(response => setStudents(response.data))  // Establece los estudiantes para la asignatura
      .catch(error => console.error('Error fetching students', error));
    
    // Cargar encuestas para la asignatura seleccionada
    axios.get(`http://localhost:4000/surveys/subject/${encodeURIComponent(subject.asignatura)}`)
      .then(response => setSurveys(response.data.data))
      .catch(error => console.error('Error fetching surveys', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSurvey || !endDate) {
      alert('Por favor complete todos los campos.');
      return;
    }
    
    // Realizar la asignación de encuesta para cada estudiante
    students.forEach((student) => {
      const assignmentData = {
        surveyId: selectedSurvey.id,
        userId: student.id,
        userMail: student.email,
        endDate,
        signature: selectedSubject.asignatura,
      };

      console.log("endDate: ",endDate);
      // Enviar el POST al endpoint para crear la asignación
      axios.post('http://localhost:4000/survey-assignments/', assignmentData)
        .then(response => {
          if (response.status === 200 || response.status === 201) {
            Tostadas.ToastSuccess(`Asignación creada correctamente para ${student.firstName} ${student.lastName}.`);
          }
        })
        .catch(error => {
          console.error('Error creating assignment for student', student.firstName, student.lastName, error);
          Tostadas.ToastError(`Error al asignar encuesta a ${student.firstName} ${student.lastName}.`);
        });
    });
    
    // Limpiar formulario
    setSelectedSurvey(null);
    setEndDate('');
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-1/5">
        <AdminSidebar />
      </div>
      <div className="ml-40 mt-12 mr-36 w-[50%] bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Crear Asignación de Encuesta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-lg font-medium text-gray-600">Asignatura:</label>
            <select
              id="subject"
              onChange={(e) => handleSubjectSelect(subjects.find(sub => sub.id === parseInt(e.target.value)))}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar Asignatura</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.asignatura}</option>
              ))}
            </select>
          </div>

          {selectedSubject && (
            <div>
              <label htmlFor="survey" className="block text-lg font-medium text-gray-600">Encuesta:</label>
              <select
                id="survey"
                value={selectedSurvey ? selectedSurvey.id : ""} // Asegúrate de que el valor es nulo cuando no hay encuesta seleccionada
                onChange={(e) => setSelectedSurvey(surveys.find(survey => survey.id === parseInt(e.target.value)))}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar Encuesta</option>
                {surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>{survey.title}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="endDate" className="block text-lg font-medium text-gray-600">Fecha Límite:</label>
            <input
              type="date"
              id="endDate"
              value={endDate.split("T")[0]}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const dateWithTime = `${selectedDate}T03:03:00`;
                setEndDate(dateWithTime);
              }}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#164a5f] text-white font-semibold rounded-lg shadow-lg focus:outline-none hover:bg-[#1f5c71] active:font-extrabold hover:scale-105"
            >
              Crear Asignación
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SurveyAssignmentForm;

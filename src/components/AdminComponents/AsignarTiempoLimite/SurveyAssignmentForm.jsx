import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/subjects/')
      .then(response => setSubjects(response.data))
      .catch(error => {
        setError('Error fetching subjects');
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    axios.get(`http://localhost:3000/user/students/subject/${encodeURIComponent(subject.asignatura)}`)
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students', error));
    
    axios.get(`http://localhost:4000/surveys/subject/${encodeURIComponent(subject.asignatura)}`)
      .then(response => {
        const surveysToDisplay = [];
        
        //verificar cada encuesta para ver si tiene deadline
        const surveyPromises = response.data.data.map(survey =>
          axios.get(`http://localhost:4000/survey-assignments/has-deadline/${survey.id}`).then(deadlineResponse => {
            //si no tiene deadline, agregar a la lista
            if (!deadlineResponse.data) {
              surveysToDisplay.push(survey);
            }
          })
        );

        //enviar en paralelo
        Promise.all(surveyPromises).then(() => {
          setSurveys(surveysToDisplay);
        });
      })
      .catch(error => {
        setError('Error fetching surveys');
        console.error(error);
      });
  };

  const handleAssignSurvey = (survey) => {
    // asignar encuesta a los estudiantes de una asignatura
    if (!endDate) {
      alert('Por favor complete la fecha límite.');
      return;
    }

    students.forEach((student) => {
      const assignmentData = {
        surveyId: survey.id,
        userId: student.id,
        userMail: student.email,
        endDate,
        signature: selectedSubject.asignatura,
      };

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

    //limpiar datos
    setSelectedSurvey(null);
    setEndDate('');
    //actualizar listado de encuestas
    setSurveys(surveys.filter(s => s.id !== survey.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSurvey || !endDate) {
      alert('Por favor complete todos los campos.');
      return;
    }

    handleAssignSurvey(selectedSurvey);
  };

  if (loading) {
    return <div className="text-center text-blue-500">Cargando asignaturas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Asignar Encuesta</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject" className="block text-lg font-medium text-gray-600">Asignatura:</label>
            <select
              id="subject"
              onChange={(e) => handleSubjectSelect(subjects.find(sub => sub.id === parseInt(e.target.value)))}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
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
              <div className="grid grid-cols-1 gap-4 mt-2">
                {surveys.length > 0 ? (
                  surveys.map((survey) => (
                    <div
                      key={survey.id}
                      className={`p-4 rounded-md shadow-sm cursor-pointer ${
                        selectedSurvey && selectedSurvey.id === survey.id
                          ? 'bg-[#164a5f] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      <p className="text-lg font-medium">{survey.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No hay encuestas disponibles para asignar.
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedSurvey && (
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
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#164a5f] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1f5c71]"
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

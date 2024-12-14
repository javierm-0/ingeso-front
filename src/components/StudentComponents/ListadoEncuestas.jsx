import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';

const ListadoEncuestas = () => {
  const [jsonCuestionarios, setJsonCuestionarios] = useState([]);
  const [jsonCuestionarioSeleccionado, setJsonCuestionarioSeleccionado] = useState(null);
  const [subjects, setSubjects] = useState(['Biología Marina', 'Física', 'Matemáticas']); // Example subjects, you can fetch this dynamically if needed.
  const navigate = useNavigate();
  
  // Function to fetch surveys by subject
  const fetchSurveysBySubject = async (subject) => {
    try {
      const response = await axios.get(`http://localhost:4000/surveys/subject/${encodeURIComponent(subject)}`);
      return response.data.data; // Assuming the survey data is in 'data'
    } catch (error) {
      console.error(`Error al obtener los cuestionarios para la asignatura ${subject}:`, error);
      return [];
    }
  };

  useEffect(() => {
    // Function to gather all surveys across different subjects
    const fetchAllSurveys = async () => {
      let allSurveys = [];
      for (const subject of subjects) {
        const surveysForSubject = await fetchSurveysBySubject(subject);
        allSurveys = [...allSurveys, ...surveysForSubject]; // Combine surveys from each subject
      }
      setJsonCuestionarios(allSurveys); // Update state with all surveys
    };

    fetchAllSurveys();
  }, [subjects]);

  const manejarSeleccion = (id) => {
    const encuestaElegida = jsonCuestionarios.find(c => c.id === id);
    setJsonCuestionarioSeleccionado(encuestaElegida);
    navigate(`/student/elegirEncuesta/responderEncuesta`, { state: { cuestionario: encuestaElegida } });
  };

  const columns = [
    {
      name: 'Título',
      selector: row => row.title,
      sortable: true,
      width: '750px',
      cell: row => (
        <div className="font-bold text-lg text-[#164a5f]">
          {row.title}
        </div>
      ),
    },
    {
      name: 'Acción',
      button: true,
      width: '150px',
      cell: row => (
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => manejarSeleccion(row.id)}
        >
          Responder
        </button>
      ),
    },
  ];

  return (
    <div className="flex">
      <div className="w-[340px]">
        <StudentSidebar />
      </div>

      <div className="ml-[340px] mt-8 mr-8 w-full max-w-3xl rounded-lg">
        <DataTable
          title={<span className="text-3xl text-[#164a5f] font-bold">Listado de Cuestionarios</span>}
          columns={columns}
          data={jsonCuestionarios}
          progressPending={!jsonCuestionarios.length}
          pagination
          highlightOnHover
          pointerOnHover
          noDataComponent="No se encontraron cuestionarios"
          progressComponent={
            <div className="flex flex-col items-center justify-center mt-24">
              <RingLoader color="#164a5f" size={50} />
              <div className="mt-2 font-bold">Cargando, por favor espere...</div>
            </div>
          }
          // Tailwind applied to the table itself
          className="table-fixed"
          // Tailwind applied to the table header and cells
          customStyles={{
            headCells: {
              style: {
                // These inline styles are now handled with Tailwind directly
                backgroundColor: '#164a5f', // We keep this as it’s a specific color
                color: 'white',
                fontWeight: 'bold',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ListadoEncuestas;

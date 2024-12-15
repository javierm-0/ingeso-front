import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';

const ListadoEncuestas = () => {
    const [encuestasPendientes, setEncuestasPendientes] = useState([]); // Almacena las encuestas pendientes
    const [encuestasCargadas, setEncuestasCargadas] = useState(false); // Indica si las encuestas han sido cargadas
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEncuestas = async () => {
            try {
                // Obtener userData desde localStorage
                const userData = JSON.parse(localStorage.getItem('userData'));

                if (!userData || !userData.subjects) {
                    console.error('No se encontró userData o no tiene asignaturas asociadas.');
                    return;
                }

                const encuestasAsignadas = [];
                const respondedSurveys = new Set();

                // Obtener encuestas respondidas
                const responses = await axios.get(`http://localhost:4000/responses/user/${userData.id}`);
                if (responses.data && responses.data.success) {
                    responses.data.data.forEach(encuesta => respondedSurveys.add(encuesta.id));
                }

                // Iterar sobre las asignaturas del usuario
                for (const subject of userData.subjects) {
                    const response = await axios.get(`http://localhost:4000/surveys/subject/${subject.asignatura}`);

                    if (response.data && response.data.success) {
                        for (const encuesta of response.data.data) {
                            // Llamar al endpoint que verifica si tiene un deadline asignado
                            const hasDeadlineResponse = await axios.get(`http://localhost:4000/survey-assignments/has-deadline/${encuesta.id}`);
                            
                            if (hasDeadlineResponse.data && hasDeadlineResponse.data === true && !respondedSurveys.has(encuesta.id)) {
                                encuestasAsignadas.push(encuesta);
                            }
                        }
                    }
                }

                setEncuestasPendientes(encuestasAsignadas);
                setEncuestasCargadas(true);

            } catch (error) {
                console.error('Error al obtener las encuestas:', error);
            }
        };

        fetchEncuestas();
    }, []);

    const manejarSeleccion = (id) => {
        // Encontrar el cuestionario seleccionado por ID
        const encuestaElegida = encuestasPendientes.find(c => c.id === id);
        if (encuestaElegida) {
            navigate(`/student/elegirEncuesta/responderEncuesta`, { state: { cuestionario: encuestaElegida } });
        }
    };

    const columns = [
        {
            name: 'Título',
            selector: row => row.title,
            sortable: true,
            width: '750px',
            cell: row => (
                <div className="font-bold">
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

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#164a5f',
                color: 'white',
                fontWeight: 'bold',
            },
        },
        table: {
            width: '100%',
            tableLayout: 'fixed',
        },
    };

    return (
        <div className="flex">
            <div>
                <StudentSidebar />
            </div>

            <div className="ml-[340px] mt-[30px] mr-36 w-full max-w-[900px] rounded-[10px]">
                <DataTable
                    title={<span className="text-3xl text-[#164a5f] font-bold">Listado de Cuestionarios Pendientes</span>}
                    columns={columns}
                    data={encuestasPendientes}
                    progressPending={!encuestasCargadas}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    noDataComponent="No se encontraron cuestionarios pendientes"
                    customStyles={customStyles}
                    progressComponent={
                        <div className="flex flex-col items-center justify-center mt-[180px]">
                            <RingLoader color="#164a5f" size={50} />
                            <div className="mt-2 font-bold">Cargando, por favor espere...</div>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default ListadoEncuestas;

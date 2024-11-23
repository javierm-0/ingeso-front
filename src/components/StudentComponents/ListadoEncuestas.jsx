import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';


//ESTE COMPONENTE ES SOLO PARA ESTUDIANTES(no mover de la carpeta StudentComponents xd)
/**
 * @typedef {Object} Item
 * @property {number} id - El ID del item.
 * @property {string} text - El texto del item.
 */

/**
 * @typedef {Object} Dimension
 * @property {number} id - El ID de la dimensión.
 * @property {string} name - El nombre de la dimensión.
 * @property {string} tipo - El tipo de la dimensión.
 * @property {Item[]} items - Un arreglo de items en esta dimensión.
 */

/**
 * @typedef {Object} Cuestionario
 * @property {number} id - El ID del cuestionario.
 * @property {string} title - El título del cuestionario.
 * @property {string} description - La descripción del cuestionario.
 * @property {Dimension[]} dimensions - Un arreglo de dimensiones en el cuestionario.
 */

const ListadoEncuestas = () => {
    const [jsonCuestionarios, setJsonCuestionarios] = useState([]);//json legendario que contiene todos los cuestionarios
    const [jsonCuestionarioSeleccionado, setJsonCuestionarioSeleccionado] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCuestionarios = async () => {
            try {
                const response = await axios.get('http://localhost:4000/surveys');
                setJsonCuestionarios(response.data);
            } catch (error) {
                console.error('Error al obtener los cuestionarios:', error);
            }
        };
        
        fetchCuestionarios();
    }, []);
        
    const manejarSeleccion = (id) => {
        // Encontrar el cuestionario seleccionado por ID
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
                    title={<span className="text-3xl text-[#164a5f] font-bold">Listado de Cuestionarios</span>}
                    columns={columns}
                    data={jsonCuestionarios}
                    progressPending={!jsonCuestionarios.length}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    noDataComponent="No se encontraron cuestionarios"
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

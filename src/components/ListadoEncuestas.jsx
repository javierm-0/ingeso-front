import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';


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
    const [jsonCuestionarioSeleccionado,setJsonCuestionarioSeleccionado] = useState(null);
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
        const encuestaElegida = jsonCuestionarios.find(c=>c.id === id);
        setJsonCuestionarioSeleccionado(encuestaElegida);
        //alert("haz seleccionado un cuestionario: "+encuestaElegida.title);
        navigate(`/student/elegirEncuesta/responderEncuesta`, { state: { cuestionario: encuestaElegida } }); // Redirigimos
    };

    
    return (
        <div className='flex'>
            <div className=''>
                <StudentSidebar></StudentSidebar>
            </div>

            <div className='ml-80 mt-16 mr-36 w-[50%]'>
                <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-4xl text-[#213547] font-bold text-center mb-4">Todas las encuestas</h2>
                    <ul className="space-y-2">
                        {jsonCuestionarios.map(cuestionario => (
                            <li key={cuestionario.id}>
                                <button 
                                    className="w-full px-4 py-8 text-2xl mb-8 bg-[#164a5f] text-white rounded hover:font-extrabold hover:scale-105 active:scale-95 transition duration-200"
                                    onClick={() => manejarSeleccion(cuestionario.id)}
                                >
                                    {cuestionario.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default ListadoEncuestas;

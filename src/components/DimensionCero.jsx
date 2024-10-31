import React, { useEffect, useState } from "react";
import axios from "axios";

const DimensionCero = () => {
    //const [preguntas, setPreguntas] = useState([]); //habilitar esto cuando se quiera testear conexion

    const [preguntas, setPreguntas] = useState([
        { id: 1, label: "Nombre de la Asignatura", respuesta: "" },
        { id: 2, label: "Profesor(a) de la Asignatura", respuesta: "" },
        { id: 3, label: "Nombre del alumno (opcional)", respuesta: "" }
    ]);
    /* de momento apagado, hasta que toque conectar front con back
    useEffect(() => {
        const fetchPreguntas = async () => {
            try {
                const response = await axios.get('https://backend');//luego cambiar por uri real
                const preguntasConRespuestas = response.data.map((pregunta, index) => ({
                    id: index + 1, //genera id para el map
                    label: pregunta.label,
                    respuesta: ""
                }));
                setPreguntas(preguntasConRespuestas);
            } catch (error) {
                console.error('Error al obtener las preguntas:', error);
            }
        };

        fetchPreguntas();
    }, []);
    */
    const handleInputChange = (id, value) => {
        setPreguntas(prevPreguntas =>
            prevPreguntas.map(pregunta =>
                pregunta.id === id ? { ...pregunta, respuesta: value } : pregunta
            )
        );
    };

    return (
        <div>
            <p className='mb-4'>
            Dimensión 0: Identificación y Caracterización
            </p>
            <div className="grid grid-cols-2 mb-12">
                <div className="border-black border-l-[1px] border-t-[1px] border-b-[1px] border-r-[1px] h-8 flex items-center justify-center">Nombre de la Asignatura</div>
                <div className="border-black border-r-[1px] border-t-[1px] border-b-[1px] h-8 flex items-center justify-center">
                    <input className="bg-white w-full h-full text-center hover:border-black border-[1px]" placeholder="Respuesta 1" />
                </div>

                <div className="border-black border-l-[1px] border-b-[1px] border-r-[1px] h-8 flex items-center justify-center">Profesor(a) de la Asignatura</div>
                <div className="border-black border-b-[1px] border-r-[1px] h-8 flex items-center justify-center">
                    <input className="bg-white w-full h-full text-center hover:border-black border-[1px]" placeholder="Respuesta 2" />
                </div>

                <div className="border-black border-l-[1px] border-b-[1px] border-r-[1px] h-8 flex items-center justify-center">Nombre del alumno (opcional)</div>
                <div className="border-black border-r-[1px] border-b-[1px] h-8 flex items-center justify-center">
                    <input className="bg-white w-full h-full text-center hover:border-black border-[1px]" placeholder="Respuesta 3" />
                </div>
            </div>
        </div>
    );
};

export default DimensionCero;

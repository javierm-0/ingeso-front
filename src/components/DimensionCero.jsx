import React, { useEffect, useState } from "react";
import axios from "axios";

const DimensionCero = ({dataRelevante , onResponseUpdate}) => {
    const placeholderUserID = 1;
    const [preguntas, setPreguntas] = useState(
        dataRelevante.items.map(item => ({ id: item.id, respuesta: "" }))
    );

    const handleInputChange = (id, value) => {
        setPreguntas(prevPreguntas =>
            prevPreguntas.map(pregunta =>
                pregunta.id === id ? { ...pregunta, respuesta: value } : pregunta
            )
        );
        onResponseUpdate(id, value);
    };
    const handleSaveResponses = () => {
        const responsesToSave = preguntas.map(pregunta => ({
            itemId: pregunta.id,
            answer: pregunta.respuesta
        }));

        localStorage.setItem('responses', JSON.stringify(responsesToSave));
        console.log("Respuestas guardadas en localStorage:", responsesToSave);
    };

    return (
        <div>
            <p className='mb-4'>
                Dimensión 0: {dataRelevante.name}
            </p>
            <div className="grid grid-cols-2 mb-12">
                {dataRelevante.items.map(item => (
                    <React.Fragment key={item.id}>
                        <div className="border-black border-l-[1px] border-t-[1px] border-b-[1px] border-r-[1px] h-8 flex items-center justify-center">
                            {item.text}
                        </div>
                        <div className="border-black border-r-[1px] border-t-[1px] border-b-[1px] h-8 flex items-center justify-center">
                            <input
                                className="bg-white w-full h-full text-center hover:border-black border-[1px]"
                                placeholder={`Responda aquí...`}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                            />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DimensionCero;

{
    /*
    

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
    */
}
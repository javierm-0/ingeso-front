import React, { useEffect, useState } from "react";
import axios from "axios";

const DimensionCero = ({dataRelevante , onResponseUpdate}) => {
    const placeholderUserID = 1;
    const [preguntas, setPreguntas] = useState(
        dataRelevante.items.map(item => ({ id: item.id, respuesta: "OPCIONAL" }))//inicializamos con opcional para saltar el control de datos para este componente
    );

    const handleInputChange = (id, value) => {
        const respuesta = value.trim() === "" ? "OPCIONAL" : value;
        setPreguntas(prevPreguntas =>
            prevPreguntas.map(pregunta =>
                pregunta.id === id ? { ...pregunta, respuesta } : pregunta
            )
        );
        onResponseUpdate(id, respuesta);
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
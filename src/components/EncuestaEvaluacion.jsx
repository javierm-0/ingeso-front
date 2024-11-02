import React, {useState, useEffect} from 'react';
import AdminSidebar from './AdminSidebar';
import logoUCN from '../assets/logoUCN2.png';
import HeaderEncuesta from './HeaderEncuesta';
import DimensionCero from './DimensionCero';
import DimensionUno from './DimensionUno';
import DimensionCinco from './DimensionCinco';
import DimensionSeis from './DimensionSeis';
import StudentSidebar from './StudentSidebar';
import axios from 'axios';


import { useLocation } from 'react-router-dom';



const options = [//esto es constante, se guardara en codigo
    "Muy en Desacuerdo", 
    "En desacuerdo", 
    "Ni de acuerdo ni en desacuerdo", 
    "De acuerdo", 
    "Muy de acuerdo", 
    "Sin información"
  ];

const EncuestaEvaluacion = () => {
  const [responses, setResponses] = useState({
    userId: 1, // id placeholder, luego usar localStorage para inicializar aca
    responses: [] //inicializamos como un arreglo vacío
});


  
  const location = useLocation();
  const { cuestionario } = location.state || {};




  const [dimensionCeroData, setDimensionCeroData] = useState([]);
  const [dimensionUnoData, setDimensionUnoData] = useState([]);
  const [dimensionSeisData, setDimensionSeisData] = useState([]);

  const handleResponseUpdate = (itemId, answer) => {
    setResponses(prevResponses => {
        // Verificamos si ya existe una respuesta para el itemId
        const existingResponse = prevResponses.responses.find(response => response.itemId === itemId);

        // Si existe, la actualizamos; si no, agregamos una nueva
        if (existingResponse) {
            return {
                ...prevResponses,
                responses: prevResponses.responses.map(response =>
                    response.itemId === itemId ? { ...response, answer } : response
                )
            };
        } else {
            return {
                ...prevResponses,
                responses: [...prevResponses.responses, { itemId, answer }]
            };
        }
    });
};

  const handleSubmit = async () => {
  console.log('Payload que se enviará:', JSON.stringify(responses, null, 2));
  try {
      const response = await axios.post('http://localhost:4000/responses/', responses);
      console.log("Responses submitted successfully:", response.data);
      // Manejar respuesta del servidor
  } catch (error) {
      console.error("Error submitting responses:", error);
      // Manejar error
  }
};



  return (
    <div className='flex'>
        <div className=''>
            <StudentSidebar></StudentSidebar>
        </div>

      <div className='ml-80 mt-16 mr-36 w-[50%]'>
        <HeaderEncuesta></HeaderEncuesta>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Encuesta de Evaluación</h1>
          {cuestionario ? (
            <div>
              {cuestionario.dimensions.map((dimension) => {
                const { tipo } = dimension;

                if (tipo === "Identidad") {
                  return <DimensionCero key={dimension.id} dataRelevante={dimension} onResponseUpdate={handleResponseUpdate}/>;
                }
                if (tipo === "Agreedlevel") {
                  return <DimensionUno key={dimension.id} dataRelevante={dimension} />;
                }
                if (tipo === "Agreedlevel2") {
                  return <DimensionCinco key={dimension.id} dataRelevante={dimension} />;
                }
                if (tipo === "freetext") {
                  return <DimensionSeis key={dimension.id} dataRelevante={dimension} />;
                }

                return null; // En caso de que el tipo no coincida
              })}
                <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
                    Enviar Respuestas!!
                </button>
            </div>
          ) : (
            <p>No se ha seleccionado un cuestionario.</p>
          )}
        </div>
      </div>

      </div>
  );
};

export default EncuestaEvaluacion;

{/*
        <div className=''>
            <StudentSidebar></StudentSidebar>
        </div>

        <div className='ml-80 mt-16 mr-36 w-[50%]'>
            <HeaderEncuesta></HeaderEncuesta>
            <p className='underline mt-3 mb-3'>
                Estimad@ Estudiante:
            </p>
            <p className='mb-3'>
            El mejoramiento de la función docente de postgrado, 
            se constituye en uno de los ejes del sistema de calidad de la Universidad Católica del Norte, 
            por tal razón se ha implementado un sistema de evaluación docente que permita recoger la percepción de los estudiantes 
            frente a algunas dimensiones de esta actividad. En este contexto, 
            la encuesta de evaluación es una forma de recibir retroalimentación y 
            posibilitar la identificación de oportunidades de mejoramiento. 
            </p>
            <p className='mb-8'>
            En consecuencia, le solicitamos responder las siguientes preguntas 
            tendiendo en consideración el curso en el cual usted ha participado.
            </p>
            <DimensionCero></DimensionCero>
            <DimensionUno></DimensionUno>
            <DimensionCinco></DimensionCinco>
            <DimensionSeis pregunta={"23. ¿Qué otros temas le resultarían interesantes y útiles de incluir en esta asignatura?"}
            onRespuestaChange={handleRespuestaDim6Change} 
            index={23}
            ></DimensionSeis>
            
            <DimensionSeis pregunta={"24. Ideas para mejorar futuras versiones de esta asignatura"}
            onRespuestaChange={handleRespuestaDim6Change} 
            index={24}
            ></DimensionSeis>

            <DimensionSeis pregunta={"25. Incorpore cualquier otro comentario u observación que permita mejorar la calidad del programa"}
            onRespuestaChange={handleRespuestaDim6Change} 
            index={25}
            ></DimensionSeis>

            <button 
                className="mb-8 ml-48 p-6 text-2xl bg-gray-950 hover:bg-gray-900 transition duration-100 transform active:scale-95 text-white rounded-md flex justify-center items-center"
                onClick={handleCuestionarioCompleto}

            >
                Enviar Encuesta
            </button>
        </div>
        */}
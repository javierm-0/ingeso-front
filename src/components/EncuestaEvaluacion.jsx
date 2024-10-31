import React, {useState} from 'react';
import AdminSidebar from './AdminSidebar';
import logoUCN from '../assets/logoUCN2.png';
import HeaderEncuesta from './HeaderEncuesta';
import DimensionCero from './DimensionCero';
import DimensionUno from './DimensionUno';
import DimensionCinco from './DimensionCinco';
import DimensionSeis from './DimensionSeis';
import StudentSidebar from './StudentSidebar';

const questionarioItems = [
    { id: 1, question: "El desarrollo de las sesiones refleja una adecuada planificación y organización de los contenidos por parte del profesor." },
    { id: 2, question: "El profesor explica y transmite adecuadamente los contenidos de la asignatura." },
    
  ];

const options = [
    "Muy en Desacuerdo", 
    "En desacuerdo", 
    "Ni de acuerdo ni en desacuerdo", 
    "De acuerdo", 
    "Muy de acuerdo", 
    "Sin información"
  ];

const ResponderEncuesta = () => {
  const [responses, setResponses] = useState({});

  const handleSelect = (itemId, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: optionIndex,
    }));
  };

  const handleRespuestaDim6Change = (index, value) => {
    setRespuestas((prev) => ({
        ...prev,
        [index]: value,
    }));
};

    const handleCuestionarioCompleto = () =>{
        console.log("piedad");
    };
    
  return(
    <div className="flex">
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
    </div>

  );
}
export default ResponderEncuesta;
import React, { useState } from 'react';

const surveyItems = [
    { id: 1, question: "El desarrollo de las sesiones refleja una adecuada planificación y organización de los contenidos por parte del profesor." },
    { id: 2, question: "El profesor explica y transmite adecuadamente los contenidos de la asignatura." },
    { id: 3, question: "El desempeño del profesor evidencia un óptimo conocimiento y manejo de los contenidos de la asignatura." },
    { id: 4, question: "El profesor resuelve satisfactoriamente las dudas y consultas planteadas por los estudiantes." },
    { id: 5, question: "Las evaluaciones son coherentes/congruentes con los objetivos de la asignatura." },
    { id: 6, question: "Se respetan las condiciones de evaluación establecidas en el inicio de la asignatura." },
    { id: 7, question: "La forma de evaluar es acorde con la metodología empleada." },
    { id: 8, question: "El inicio y término de las sesiones de clases se ajustan a los horarios programados." },
    { id: 9, question: "Se cumplieron los objetivos de la asignatura." },
    { id: 10, question: "Recomienda al profesor para impartir nuevamente el curso." },
    { id: 11, question: "El Material de Apoyo se entregó o estuvo disponible oportunamente." },
    { id: 12, question: "El Material de Apoyo contribuyó positivamente al logro de los aprendizajes." },
    { id: 13, question: "El material de apoyo contribuyó positivamente al logro de los objetivos del curso." },
    { id: 14, question: "La sala de clases en que se desarrolló la actividad cumple con un estándar adecuado (orden, higiene, tamaño de la sala, ventilación, luminosidad, etc.)." },
    { id: 15, question: "El mobiliario disponible cumple con un estándar adecuado (comodidad de sillas, mesas, pupitres)." },
    { id: 16, question: "El equipamiento de la sala se encuentra en óptimas condiciones para su funcionamiento." },
    { id: 17, question: "Los contenidos del curso son pertinentes, es decir, contribuyen a los objetivos de la asignatura." },
    { id: 18, question: "El tiempo y nivel de profundidad con que se trataron los contenidos es adecuado, vale decir, acorde a la naturaleza del programa (magister de ciencias o profesionalizante; o doctorado)." },
    { id: 19, question: "Los contenidos desarrollados aportan significativamente a la actividad de graduación o proyecto final." },
    { id: 20, question: "El programa de la asignatura fue desarrollado en su totalidad." },
  ];

const options = [
  "Muy en Desacuerdo", 
  "En desacuerdo", 
  "Ni de acuerdo ni en desacuerdo", 
  "De acuerdo", 
  "Muy de acuerdo", 
  "Sin información"
];

const DimensionUno = () => {
  const [responses, setResponses] = useState({});

  const handleSelect = (itemId, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: optionIndex,
    }));
  };

  const handleCuestionario = () => {
    Object.entries(responses).forEach(([itemId, optionIndex]) => {
      const question =  surveyItems.find(item => item.id === parseInt(itemId)).question;
      const answer = options[optionIndex];
      console.log(`Pregunta ${itemId}: ${question}`);
      console.log(`Respuesta: ${answer}`);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Responder Encuesta</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Items</th>
            {options.map((option, index) => (
              <th key={index} className="border border-gray-300 p-2 text-center">{option}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {surveyItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.id + ". " + item.question}</td>
              {options.map((_, index) => (
                <td key={index} className="border border-gray-300 p-2 text-center">
                  <input 
                    type="radio" 
                    name={`item-${item.id}`} 
                    checked={responses[item.id] === index} 
                    onChange={() => handleSelect(item.id, index)}
                    className='form-radio w-6 h-6 accent-[#164a5f]'
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default DimensionUno;

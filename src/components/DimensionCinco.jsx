import { useState } from "react";


const DimensionCinco = ({dataRelevante, onResponseUpdate}) => {
  const [notas, setNotas] = useState({});

  

  const handleInputChange = (id, value) => {
    const responseValue = value ? value.toString() : "SIN_RESPONDER"; // Usa "SIN_RESPONDER" si no hay respuesta
    setNotas((prev) => ({
      ...prev,
      [id]: responseValue,
    }));
    onResponseUpdate(id, responseValue); // Llama a la función de actualización con el nuevo valor
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Evaluación de la Asignatura</h2>
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Pregunta</th>
            <th className="border border-gray-300 p-2">Notas</th>
          </tr>
        </thead>
        <tbody>
          {dataRelevante.items.map((pregunta) => (
            <tr key={pregunta.id}>
              <td className="border border-gray-300 p-2">{pregunta.text}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={notas[pregunta.id] || ''}
                  onChange={(e) => handleInputChange(pregunta.id, e.target.value)}
                  className="border border-gray-300 p-1 rounded"
                  min="1"
                  max="7"
                  required
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DimensionCinco;

import { useState } from "react";

const preguntas = [
  { id: 21, question: "¿Con qué nota calificaría la relevancia y pertinencia de esta asignatura?" },
  { id: 22, question: "Si tuviera que colocar una nota general a la asignatura, ¿cuál sería?" },
];

const DimensionCinco = () => {
  const [notas, setNotas] = useState({});

  const handleInputChange = (index, value) => {
    setNotas((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Evaluación de la Asignatura</h2>
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Dimension Cinco</th>
            <th className="border border-gray-300 p-2">Notas</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((pregunta, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{pregunta.question}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={notas[pregunta.id] || ''} // Cambié index por pregunta.id para mantener la clave única
                  onChange={(e) => handleInputChange(pregunta.id, e.target.value)}
                  className="border border-gray-300 p-1 rounded"
                  min="1"
                  max="7"
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

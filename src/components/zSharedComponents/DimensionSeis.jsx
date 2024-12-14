import { useState } from "react";

const DimensionSeis = ({ dataRelevante, onResponseUpdate }) => {
    // Inicializa un objeto para almacenar respuestas por cada pregunta
    const [respuestas, setRespuestas] = useState({});

    const handleChange = (id, value) => {
        setRespuestas((prev) => ({
            ...prev,
            [id]: value,
        }));
        onResponseUpdate(id, value); // Envía la respuesta al componente padre
    };

      
    if (!dataRelevante?.items?.length) {
      return (
        <div>
          
        </div>
      );
    }

    return (
        <div className="p-4">
          <h2 className="text-xl font-bold">Respuestas Abiertas</h2>
          {dataRelevante.items.map((pregunta) => (
            <div key={pregunta.id} className="mb-4">
              <p className="font-semibold">
                {pregunta.text}
                {respuestas[pregunta.id] === undefined && (
                  <span className="text-red-600 font-extrabold">*</span>
                )}
              </p>
              <textarea
                value={respuestas[pregunta.id] || ''}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                className="border border-gray-300 w-full min-h-[100px] p-2"
                placeholder="Escribe tu respuesta..."
                required={true}
              />
            </div>
          ))}
        </div>
      );
      
};

export default DimensionSeis;
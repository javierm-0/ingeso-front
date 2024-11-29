import React, { useState,useEffect } from "react";

const NumericScaleEditable = ({ question, options, onOptionChange, onAddOption }) => {
  const [currentQuestion, setCurrentQuestion] = useState(question || '');

  useEffect(() => {
    if (question !== currentQuestion) {
      setCurrentQuestion(question);
    }
  }, [question]);

  const handleInputChange = (e) => {
    setCurrentQuestion(e.target.value);
    onOptionChange(e.target.value); // Comunica el cambio al componente padre
  };
  

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Configurar Pregunta Numérica (1 a 7)</h3>
      <input
        type="text"
        value={currentQuestion}
        onChange={handleInputChange}
        placeholder="Escribe tu pregunta aquí..."
        className="w-full border p-2 mb-4"
      />
      <p className="text-gray-600">Esta pregunta se responderá con un número del 1 al 7.</p>
    </div>
  );
};

export default NumericScaleEditable;

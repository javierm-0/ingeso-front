import React from 'react';

const OpenQuestionLongEditable = ({ question, onChange }) => {
  return (
    <div className="p-4 border rounded-lg">
      <input
        type="text"
        value={question.text}
        onChange={(e) => onChange('text', e.target.value)}
        placeholder="Editar contenido de la pregunta"
        className="border w-full p-2 mb-4"
      />
      <textarea
        className="border border-gray-300 w-full min-h-[100px] p-2"
        placeholder="Respuesta aquí (previsualización)..."
        disabled
      />
    </div>
  );
};

export default OpenQuestionLongEditable;

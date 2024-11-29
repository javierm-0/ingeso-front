import React, { useState } from 'react';

// Opciones constantes
const options = [
  "Muy en Desacuerdo", 
  "En Desacuerdo", 
  "Ni de acuerdo ni en desacuerdo", 
  "De acuerdo", 
  "Muy de acuerdo", 
  "Sin información"
];

const MultipleChoiceEditable = ({ question, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (optionIndex) => {
    setSelectedOption(optionIndex);
    onSelect(optionIndex); // Comunica el cambio al componente padre
  };

  return (
    <div className="p-4 border rounded-lg">
      <p className="font-bold">{question}</p>
      <table className="min-w-full border-collapse border border-gray-200 mt-2">
        <thead>
          <tr>
            {options.map((option, index) => (
              <th key={index} className="border border-gray-300 p-2 text-center">
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {options.map((_, index) => (
              <td key={index} className="border border-gray-300 p-2 text-center">
                <input
                  type="radio"
                  name={`question-${question}`}
                  checked={selectedOption === index}
                  onChange={() => handleOptionChange(index)}
                  className="form-radio w-6 h-6 accent-[#164a5f]"
                  disabled={true}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MultipleChoiceEditable;

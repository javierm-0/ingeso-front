import React, { useState } from 'react';



//esto es constante, se guarda en codigo
const options = [
  "Muy en Desacuerdo", 
  "En desacuerdo", 
  "Ni de acuerdo ni en desacuerdo", 
  "De acuerdo", 
  "Muy de acuerdo", 
  "Sin información"
];

const DimensionUno = ({ dataRelevante, onResponseUpdate }) => {
  const [responses, setResponses] = useState({});

  const handleSelect = (itemId, optionIndex) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: optionIndex,
    }));
    onResponseUpdate(itemId, optionIndex); // Actualiza al componente padre
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
          {dataRelevante.items.map((item, itemIndex) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">
                {itemIndex+1 + ". " + item.text}
                {responses[item.id] === undefined && (
                  <span className="text-red-600 font-extrabold">*</span>
                )}
              </td>
              {options.map((_, index) => (
                <td key={index} className="border border-gray-300 p-2 text-center">
                  <input 
                    type="radio" 
                    name={`item-${item.id}`} 
                    checked={responses[item.id] === index} 
                    onChange={() => handleSelect(item.id, index)}
                    className='form-radio w-6 h-6 accent-[#164a5f]' 
                    required={true}
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

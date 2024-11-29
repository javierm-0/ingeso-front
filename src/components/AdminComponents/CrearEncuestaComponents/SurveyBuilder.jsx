import React, { useState , useEffect} from 'react';
import AdminSidebar from '../AdminSidebar';
import MultipleChoiceEditable from './MultipleChoiceEditable';
import OpenQuestionLongEditable from './OpenQuestionLongEditable';
import HeaderEncuesta from '../../StudentComponents/HeaderEncuesta';
import NumericScaleEditable from './NumericScaleEditable';

const SurveyBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleGenerateQuestions = () => {
    const newQuestions = Array.from({ length: numQuestions }, (_, i) => ({
      id: questions.length + i + 1, // Asignar un ID único basado en la longitud actual
      text: '',
      type: 'open', // Por defecto
      options: [],
    }));
    setQuestions([...questions, ...newQuestions]); // Agregar nuevas preguntas sin eliminar las anteriores
  };

  const checkSubmitStatus = () => {
    const allQuestionsValid = questions.every(q => q.text.trim() !== ''); // Verificar si todas las preguntas tienen texto
    setIsSubmitDisabled(questions.length === 0 || !allQuestionsValid || !title.trim() || !description.trim()
    ); // Deshabilitar si alguna no tiene texto
  };
  

  const handleInputChange = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

    useEffect(() => {
        checkSubmitStatus();
    }, [questions, title, description]);
    //si se modifica questions, titulo o descrip, se ejecuta y verifica que todo este bien para el envio

  const handleAddOption = (id) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const handleOptionChange = (id, index, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { 
        ...q, 
        options: q.options.map((opt, idx) => idx === index ? value : opt)
      } : q
    ));
  };

  const handleRemoveQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id); // Eliminar la pregunta con el id específico
    // Reasignar los IDs de las preguntas restantes para asegurarse de que sean consecutivos
    const reindexedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      id: index + 1, // Asignar un nuevo ID secuencial
    }));
    setQuestions(reindexedQuestions); // Actualizar el estado con los nuevos IDs
  };

  const handleRemoveAllQuestions = () => {
    setQuestions([]); // Elimina todas las preguntas(reemplazando con un arreglo vacio xd)
  };
  

  const handleSubmit = () => {
    // Agrupar preguntas según el tipo seleccionado
    const groupedQuestions = {
      Agreedlevel: [],
      Agreedlevel2: [],
      freetext: []
    };
  
    questions.forEach(q => {
      if (q.text.trim()) {
        groupedQuestions[q.type === 'multiple' ? 'Agreedlevel' : q.type === 'numeric' ? 'Agreedlevel2' : 'freetext'].push({
          text: q.text.trim()
        });
      }
    });
  
    // Construir el JSON
    const surveyJSON = {
      title: title.trim(),
      description: description.trim(),
      dimensions: [
        {
          name: "Identificación y Caracterización",
          tipo: "Identidad",
          items: [
            { text: "Nombre Asignatura" },
            { text: "Profesor(a) de la Asignatura" },
            { text: "Nombre del alumno (opcional)" }
          ]
        },
        ...Object.entries(groupedQuestions).map(([key, items], index) => ({
          name: `Dimensión ${index + 1}`,
          tipo: key,
          items
        }))
      ]
    };
  
    console.log('Survey JSON:', JSON.stringify(surveyJSON, null, 2));
  };
  
  

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-72 h-screen">
        <AdminSidebar />
      </div>
  
      {/* Contenedor principal */}
      <div className="ml-72 px-12 mt-12 flex flex-col w-full space-y-4">
        {/* Header */}
        <HeaderEncuesta className="w-full object-contain" />

            {/* Inputs para título y descripción */}
        <input
            type="text"
            placeholder="Nombre de la encuesta"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <textarea
            placeholder="Ingrese descripción breve"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows={3}
        />

        {/* Formulario de preguntas */}
        <div className="p-4 w-full max-w-screen-xl mx-auto">
          <input 
            type="number"
            value={numQuestions} 
            onChange={(e) => 
                {
                let newValue = parseInt(e.target.value, 10)
                if (isNaN(newValue)) newValue = 1;
                if(newValue < 1) newValue = 1;
                if(newValue > 99) newValue = 99;
                setNumQuestions(newValue)
                }
            }
            className="border p-2"
            min="1"
            max="99"
          />
          <button 
            onClick={handleGenerateQuestions} 
            className="bg-[#164a5f] text-white px-4 py-2 font-medium rounded active:scale-95 hover:text-blue-400"
          >
            Agregar {numQuestions} {numQuestions> 1 ? "Preguntas" : "Pregunta"}
          </button>

            <button
            onClick={handleRemoveAllQuestions}
            className={`ml-2 mr-2 px-4 py-2 font-medium rounded ${questions.length === 0 ? 'bg-gray-400 cursor-not-allowed text-gray-600':'bg-red-600 active:scale-95 hover:text-blue-400 text-white'} ' `}
            disabled={questions.length === 0}
            >
            Eliminar todas las preguntas
            </button>

  
          {questions.map((q) => (
            <div key={q.id} className="border p-4 space-y-2 w-full">
              <input 
                type="text" 
                value={q.text} 
                onChange={(e) => handleInputChange(q.id, 'text', e.target.value)} 
                placeholder={`Pregunta ${q.id}`} 
                className="border w-full p-2"
              />
  
              <div>
                <label>
                  <input 
                    type="radio" 
                    name={`type-${q.id}`} 
                    value="open" 
                    checked={q.type === 'open'} 
                    onChange={() => handleInputChange(q.id, 'type', 'open')} 
                  /> Pregunta Abierta
                </label>
  
                <label className="ml-4">
                  <input 
                    type="radio" 
                    name={`type-${q.id}`} 
                    value="multiple" 
                    checked={q.type === 'multiple'} 
                    onChange={() => handleInputChange(q.id, 'type', 'multiple')} 
                  /> Selección Múltiple
                </label>
  
                <label className="ml-4">
                  <input 
                    type="radio" 
                    name={`type-${q.id}`} 
                    value="numeric" 
                    checked={q.type === 'numeric'} 
                    onChange={() => handleInputChange(q.id, 'type', 'numeric')} 
                  /> Evaluación del 1 al 7
                </label>
              </div>
  
              {q.type === 'open' && (
                <OpenQuestionLongEditable
                  question={q}
                  onChange={(field, value) => handleInputChange(q.id, field, value)}
                  className="w-full" // Ajustado a 100% de ancho
                />
              )}
  
              {q.type === 'multiple' && (
                <MultipleChoiceEditable
                  key={q.id}
                  question={q.text}
                  onSelect={(optionIndex) => handleSelectOption(q.id, optionIndex)}
                  className="w-full" // Ajustado a 100% de ancho
                />
              )}
  
              {q.type === 'numeric' && (
                <NumericScaleEditable
                  key={q.id}
                  question={q.text}
                  onOptionChange={(newQuestion) => handleInputChange(q.id, 'text', newQuestion)}
                  className="w-full" // Ajustado a 100% de ancho
                />
              )}

              {/* Botón de eliminar pregunta */}
              <button 
                onClick={() => handleRemoveQuestion(q.id)} 
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 font-medium active:scale-95 hover:text-blue-400"
              >
                Eliminar Pregunta
              </button>
            </div>
          ))}
  
            <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-4 py-2 rounded font-medium ${isSubmitDisabled? '':'active:scale-95'} ${isSubmitDisabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:text-blue-400'}`}
            >
            Enviar Encuesta
            </button>

        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;

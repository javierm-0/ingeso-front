import React, {useState, useEffect} from 'react';
import logoUCN from '../../assets/logoUCN2.png';
import HeaderEncuesta from './HeaderEncuesta';
import DimensionCero from '../zSharedComponents/DimensionCero';
import DimensionUno from '../zSharedComponents/DimensionUno';
import DimensionCinco from '../zSharedComponents/DimensionCinco';
import DimensionSeis from '../zSharedComponents/DimensionSeis';
import StudentSidebar from './StudentSidebar';
import axios from 'axios';
import Tostadas from '../zSharedComponents/Tostadas';
import { ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

//llamada a localstorage accessToken
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

//obtener el userId del token
function getUserIdFromToken() {
  const accessToken = getAccessToken();
  if (accessToken) {
    console.log("Hay access token: " + accessToken);
    try {
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.exp * 1000 > Date.now()) {
        console.log("userId: ",decodedToken.sub);
        return decodedToken.sub;  // Devuelve el userId (sub) del token
      } else {
        console.log("El token ha expirado");
        return null;
      }
    } catch (error) {
      console.error("Error al decodificar el token: ", error);
      return null;
    }
  } else {
    console.log("No hay access token disponible");
    return null;
  }
}


const options = [//esto es constante, se guardara en codigo
    "Muy en Desacuerdo", 
    "En desacuerdo", 
    "Ni de acuerdo ni en desacuerdo", 
    "De acuerdo", 
    "Muy de acuerdo", 
    "Sin información"
  ];

  const EncuestaEvaluacion = () => {
    const location = useLocation();
    const { cuestionario } = location.state || {};
    const [isBlocked, setIsBlocked] = useState(false);

    const [responses, setResponses] = useState({
      userId: null, 
      responses: [], //inicializamos con un arreglo vacío,
      subject: cuestionario.subject,
      surveyId: cuestionario.id,
    });

    const isAllRequiredFilled = () => {
      return cuestionario.dimensions.every(dimension => {
        return dimension.items.every(item => {
          if (dimension.tipo === "Agreedlevel" || dimension.tipo === "Agreedlevel2" || dimension.tipo === "freetext") {
            const response = responses.responses.find(response => response.itemId === item.id);
            if (response) {
              //si es string hace trim
              const cleanedAnswer = typeof response.answer === 'string' 
                ? response.answer.trim() 
                : String(response.answer).trim();
              
              if (!cleanedAnswer) {
                return false; // Si la respuesta está vacía o solo contiene espacios, no está llena
              }
            }
            return true; // Si hay una respuesta válida, consideramos que está llena
          }
          return true; // Si no es un tipo obligatorio, lo consideramos como válido
        });
      });
    };
    
    
    
  useEffect(() => {
    const userId = getUserIdFromToken();//inicializar el userId a partir del token
    if (userId) {
      setResponses((prevResponses) => ({
        ...prevResponses,
        userId: userId
      }));
    }
  }, []);
  
  //console.log("cuestionario: ",JSON.stringify(cuestionario,null,2));
  const navigate = useNavigate(); // Hook de react-router-dom para redirigir
  const [dimensionCeroData, setDimensionCeroData] = useState([]);
  const [dimensionUnoData, setDimensionUnoData] = useState([]);
  const [dimensionSeisData, setDimensionSeisData] = useState([]);

  const handleResponseUpdate = (itemId, answer) => {
    setResponses(prevResponses => {
        const existingResponse = prevResponses.responses.find(response => response.itemId === itemId);
        if (existingResponse) {
            return {
                ...prevResponses,
                responses: prevResponses.responses.map(response =>
                    response.itemId === itemId ? { ...response, answer } : response
                )
            };
        } else {
            return {
                ...prevResponses,
                responses: [...prevResponses.responses, { itemId, answer }]
            };
        }
    });
};

const handleSubmit = async () => {
  setIsBlocked(true);
  console.log(responses);
  if(responses.responses === null || responses.responses === undefined || responses.responses.length === 0){
    Tostadas.ToastWarning("No hay absolutamente nada respondido aca");
    setTimeout(() => {
      setIsBlocked(false);
    }, 5000);// por troll xd
    return;
  }
  if (!isAllRequiredFilled()) {
    setTimeout(() => {
      setIsBlocked(false);
    }, 1600);
    Tostadas.ToastWarning("Por favor, completa todas las preguntas obligatorias.");
    return;
  }

  //si pasa la validacion, enviar el payload
  //console.log('Payload que se enviará:', JSON.stringify(responses, null, 2));
  try {
    Tostadas.ToastInfo("Enviando respuestas...");
    const response = await axios.post('http://localhost:4000/responses/', responses);
    console.log("Responses submitted successfully:", response.data);

    const completeAssignmentPayload = {
      userId: responses.userId,
      surveyId: responses.surveyId,
    };

    // Llamada para completar la asignación
    const completeResponse = await axios.post('http://localhost:4000/survey-assignments/complete', completeAssignmentPayload);
    console.log("Survey assignment marked as complete:", completeResponse.data);

    // Si todo sale bien
    Tostadas.ToastSuccess("Respuestas enviadas con éxito");
    setTimeout(() => {
      navigate(`/student/elegirEncuesta/`);
    }, 1500);

  } catch (error) {
    console.error("Error:", error);
    Tostadas.ToastError("Error durante el envío de la encuesta, intente más tarde.");
    
  } finally {
    setResponses({
      userId: null,
      responses: [],
      subject: cuestionario.subject,
      surveyId: cuestionario.id,
    });
    setTimeout(() => {
      setIsBlocked(false);
    }, 1600);
  }
};





  return (
    <div className='flex'>
        <div className=''>
            <StudentSidebar></StudentSidebar>
        </div>

      <div className='ml-80 mt-16 mr-36 w-[50%]'>
        <HeaderEncuesta></HeaderEncuesta>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Encuesta de Evaluación</h1>
          {cuestionario ? (
            <div>
              {cuestionario.dimensions.map((dimension) => {
                const { tipo } = dimension;
                if (tipo === "Identidad") {
                  return <DimensionCero key={dimension.id} dataRelevante={dimension} onResponseUpdate={handleResponseUpdate}/>;
                }
                if (tipo === "Agreedlevel") {
                  return <DimensionUno key={dimension.id} dataRelevante={dimension} onResponseUpdate={handleResponseUpdate} />;
                }
                if (tipo === "Agreedlevel2") {
                  return <DimensionCinco key={dimension.id} dataRelevante={dimension} onResponseUpdate={handleResponseUpdate}/>;
                }
                if (tipo === "freetext") {
                  return <DimensionSeis key={dimension.id} dataRelevante={dimension} onResponseUpdate={handleResponseUpdate}/>;
                }

                return null; // En caso de que el tipo no coincida
              })}
              <div className="flex justify-center mt-4">
                <button onClick={handleSubmit} 
                  className={`bg-[#164a5f] text-white px-4 py-6 text-2xl mb-2 rounded-md
                    ${(isBlocked) ? 'opacity-50 cursor-not-allowed' : 'active:font-extrabold active:scale-95 hover:scale-105 transition duration-200'}`}
                disabled={isBlocked}
                >
                    Enviar Respuestas!!
                </button>
              </div>
              <div>
                <p className='font-bold flex justify-center mb-4 mt-2'>
                  ¡Muchas Gracias por su respuesta!
                </p>
              </div>

            </div>
          ) : (
            <p>No se ha seleccionado un cuestionario.</p>
          )}
        </div>
      </div>
        <ToastContainer/>
      </div>
  );
};

export default EncuestaEvaluacion;
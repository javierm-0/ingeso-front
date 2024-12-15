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


    const [responses, setResponses] = useState({
      userId: null, 
      responses: [], //inicializamos con un arreglo vacío,
      subject: cuestionario.subject,
      surveyId: cuestionario.id,
    });
    
  useEffect(() => {
    const userId = getUserIdFromToken();//inicializar el userId a partir del token
    if (userId) {
      setResponses((prevResponses) => ({
        ...prevResponses,
        userId: userId
      }));
    }
  }, []);
  
  console.log("cuestionario: ",JSON.stringify(cuestionario,null,2));
  const navigate = useNavigate(); // Hook de react-router-dom para redirigir


  const [dimensionCeroData, setDimensionCeroData] = useState([]);
  const [dimensionUnoData, setDimensionUnoData] = useState([]);
  const [dimensionSeisData, setDimensionSeisData] = useState([]);

  const handleResponseUpdate = (itemId, answer) => {
    setResponses(prevResponses => {
        //verificamos si ya existe una respuesta para el itemId
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
  // Validar que todas las preguntas obligatorias tengan respuestas
  const allRequiredFilled = cuestionario.dimensions.every(dimension => {
    return dimension.items.every(item => {
      if (dimension.tipo === "Agreedlevel" || dimension.tipo === "Agreedlevel2" || dimension.tipo === "freetext") {
        return responses.responses.some(response => response.itemId === item.id && response.answer !== undefined && response.answer !== "");
      }
      return true;//si fuese de otro tipo no se verifica, puesto que es opcional
    });
  });

  if (!allRequiredFilled) {
    Tostadas.ToastWarning("Por favor, completa todas las preguntas obligatorias.");
    return;
  }

  //si pasa la validacion, enviar el payload
  console.log('Payload que se enviará:', JSON.stringify(responses, null, 2));
  try {
    const response = await axios.post('http://localhost:4000/responses/', responses);
    console.log("Responses submitted successfully:", response.data);
     // Ahora hacemos el POST para marcar la encuesta como completada
     const completeAssignmentPayload = {
      userId: responses.userId,
      surveyId: responses.surveyId
    };

    // Llamada para completar la asignación
    await axios.post('http://localhost:4000/survey-assignments/complete', completeAssignmentPayload)
      .then(completeResponse => {
        console.log("Survey assignment marked as complete:", completeResponse.data);
      })
      .catch(error => {
        console.error("Error completing survey assignment:", error);
        Tostadas.ToastError("Error al completar la asignación de encuesta.");
      });
    Tostadas.ToastSuccess("Respuestas enviadas con éxito");

    setTimeout(() => {
      navigate(`/student/elegirEncuesta/`) //retrocede
    }, 2000); //2 segundos

  } catch (error) {
    console.error("Error submitting responses:", error);
    Tostadas.ToastError("Error durante el envio de cuestionario, intente más tarde");
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
                <button onClick={handleSubmit} className="bg-[#164a5f] text-white px-4 py-6 text-2xl mb-2 rounded-md hover:font-extrabold active:scale-95 hover:scale-105 transition duration-200">
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
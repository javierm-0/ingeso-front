import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RespuestaPorProfesor = () => {
  const [respuestasAgrupadas, setRespuestasAgrupadas] = useState({});
  const [loading, setLoading] = useState(true);

  console.log("Iniciando RespuestaPorProfesor...");

  const userData = JSON.parse(localStorage.getItem('userData'));
  const subjects = userData?.subjects || []; // Asegurar que subjects esté definido

  const fetchRespuestasPorAsignatura = async (subject) => {
    try {
      console.log(`Apunto de llamar a responses/subject/${subject.asignatura} GET`);
      const encodedAsignatura = encodeURIComponent(subject.asignatura);
      const { data: encuestas } = await axios.get(
        `http://localhost:4000/responses/subject/${encodedAsignatura}`
      );

      const respuestas = [];
      for (const encuesta of encuestas || []) { // Manejar casos donde encuestas sea undefined
        for (const dimension of encuesta.dimensions || []) {
          for (const item of dimension.items || []) {
            for (const response of item.responses || []) {
              respuestas.push({
                surveyId: encuesta.id,
                surveyTitle: encuesta.title,
                asignatura: subject.asignatura,
                pregunta: item.text,
                userId: response.userId,
                answer: response.answer,
              });
            }
          }
        }
      }
      return respuestas;
    } catch (error) {
      console.error(`Error al obtener respuestas para la asignatura ${subject.asignatura}:`, error);
      return [];
    }
  };

  const fetchUsuarioPorId = async (userId) => {
    try {
      console.log(`Apunto de llamar a /user/${userId} GET`);
      const { data: usuario } = await axios.get(`http://localhost:3000/user/${userId}`);
      return `${usuario.firstName} ${usuario.lastName} (RUT: ${usuario.rut})`;
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${userId}:`, error);
      return 'Usuario no encontrado';
    }
  };

  const fetchAllRespuestas = async () => {
    setLoading(true);
    const respuestasTotales = [];

    for (const subject of subjects) {
      const respuestas = await fetchRespuestasPorAsignatura(subject);
      for (const respuesta of respuestas) {
        const usuario = await fetchUsuarioPorId(respuesta.userId);
        respuestasTotales.push({
          ...respuesta,
          usuario,
        });
      }
    }

    // Agrupar respuestas por asignatura y encuesta
    const agrupadas = respuestasTotales.reduce((acc, respuesta) => {
      if (!acc[respuesta.asignatura]) {
        acc[respuesta.asignatura] = {};
      }
      if (!acc[respuesta.asignatura][respuesta.surveyId]) {
        acc[respuesta.asignatura][respuesta.surveyId] = {
          surveyTitle: respuesta.surveyTitle,
          respuestas: [],
        };
      }
      acc[respuesta.asignatura][respuesta.surveyId].respuestas.push({
        pregunta: respuesta.pregunta,
        answer: respuesta.answer,
        usuario: respuesta.usuario,
      });
      return acc;
    }, {});

    setRespuestasAgrupadas(agrupadas);
    setLoading(false);
  };

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      fetchAllRespuestas();
    }
  }, []); // Ejecutar solo una vez al montar

  if (loading) {
    return <p className="text-center text-gray-500">Cargando respuestas...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Respuestas Agrupadas por Asignatura y Encuesta</h1>
      {Object.keys(respuestasAgrupadas).length === 0 ? (
        <p className="text-gray-500">No hay respuestas disponibles.</p>
      ) : (
        Object.entries(respuestasAgrupadas).map(([asignatura, encuestas]) => (
          <div key={asignatura} className="border p-4 rounded-lg mb-4 shadow-md bg-gray-100">
            <h2 className="text-lg font-bold text-blue-800 mb-3">
              Asignatura: {asignatura}
            </h2>
            {Object.values(encuestas || {}).map((encuesta, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-4 shadow-sm bg-white"
              >
                <h3 className="text-md font-bold text-blue-700 mb-2">
                  Encuesta: {encuesta.surveyTitle}
                </h3>
                <div className="space-y-2">
                  {encuesta.respuestas?.map((respuesta, i) => (
                    <div key={i} className="p-2 border-b">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Pregunta:</span>{' '}
                        {respuesta.pregunta}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Respuesta:</span>{' '}
                        {respuesta.answer}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Usuario:</span>{' '}
                        {respuesta.usuario}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default RespuestaPorProfesor;

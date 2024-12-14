import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar'; // Usamos AdminSidebar en lugar de TeacherSidebar

const options = [
  "1 - Muy en desacuerdo",
  "2 - En desacuerdo",
  "3 - Neutral",
  "4 - De acuerdo",
  "5 - Muy de acuerdo",
  "6 - Totalmente de acuerdo",
  "7 - No aplicable"
];

const RespuestasAsignaturaAdmin = () => {
  const [respuestasAgrupadas, setRespuestasAgrupadas] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};
  const asignatura = subject.asignatura;

  const fetchRespuestasPorAsignatura = async () => {
    try {
      setLoading(true);
      const encodedAsignatura = encodeURIComponent(asignatura);
      const { data: encuestas } = await axios.get(
        `http://localhost:4000/responses/subject/${encodedAsignatura}`
      );

      const respuestasTotales = [];
      for (const encuesta of encuestas || []) {
        for (const dimension of encuesta.dimensions || []) {
          const isAgreedLevel = dimension.tipo === "Agreedlevel";

          for (const item of dimension.items || []) {
            for (const response of item.responses || []) {
              const { data: usuario } = await axios.get(
                `http://localhost:3000/user/${response.userId}`
              );

              const respuestaFinal = isAgreedLevel
                ? options[parseInt(response.answer)] 
                : response.answer;

              respuestasTotales.push({
                surveyId: encuesta.id,
                surveyTitle: encuesta.title,
                pregunta: item.text,
                answer: respuestaFinal,
                usuario: `${usuario.firstName} ${usuario.lastName} (RUT: ${usuario.rut})`,
              });
            }
          }
        }
      }

      const agrupadas = respuestasTotales.reduce((acc, respuesta) => {
        if (!acc[respuesta.surveyId]) {
          acc[respuesta.surveyId] = {
            surveyTitle: respuesta.surveyTitle,
            respuestasPorUsuario: {},
          };
        }

        const encuesta = acc[respuesta.surveyId];
        if (!encuesta.respuestasPorUsuario[respuesta.usuario]) {
          encuesta.respuestasPorUsuario[respuesta.usuario] = [];
        }

        encuesta.respuestasPorUsuario[respuesta.usuario].push({
          pregunta: respuesta.pregunta,
          answer: respuesta.answer,
        });

        return acc;
      }, {});

      setRespuestasAgrupadas(agrupadas);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar las respuestas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asignatura) {
      fetchRespuestasPorAsignatura();
    }
  }, [asignatura]);

  if (loading) {
    return <p>Cargando respuestas...</p>;
  }

  if (!Object.keys(respuestasAgrupadas).length) {
    return <p>No hay respuestas disponibles para esta asignatura.</p>;
  }

  return (
    <div className="flex">
      <div className='fixed top-0 left-0 w-72 h-screen'>
        <AdminSidebar /> {/* Cambiado de TeacherSidebar a AdminSidebar */}
      </div>

      <div className='ml-80 mt-12'>
        <button
          onClick={() => navigate(-1)} // Regresa a la página anterior
          className="bg-[#164a5f] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1f5c71] active:font-extrabold mb-4"
        >
          Regresar
        </button>
        <h2 className="text-lg font-bold mb-4">Respuestas para la Asignatura: {asignatura}</h2>
        {Object.entries(respuestasAgrupadas).map(([surveyId, encuesta]) => (
          <div key={surveyId} className="mb-4 border p-4 rounded shadow">
            <h3 className="text-md font-bold mb-2">Encuesta: {encuesta.surveyTitle}</h3>
            {Object.entries(encuesta.respuestasPorUsuario).map(([usuario, respuestas]) => (
              <div key={usuario} className="mb-5">
                <h4 className="font-semibold">Respuestas de {usuario}</h4>
                {respuestas.map((respuesta, i) => (
                  <div key={i} className="p-2 border-b">
                    <p className="text-sm">
                      <span className="font-semibold">Pregunta:</span> {respuesta.pregunta}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Respuesta:</span> {respuesta.answer}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RespuestasAsignaturaAdmin;
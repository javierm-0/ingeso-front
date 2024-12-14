import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Asignatura = ({ asignatura, encuestas }) => {
  console.log('Encuestas recibidas:', encuestas);

  // Estado para almacenar los nombres de los usuarios
  const [usuarios, setUsuarios] = useState({});
  // Set para almacenar los userIds ya procesados
  const [userIdsProcesados, setUserIdsProcesados] = useState(new Set());

  useEffect(() => {
    // Función para obtener los nombres de los usuarios
    const obtenerNombresUsuarios = async () => {
      // Extraemos todos los userIds únicos de las respuestas
      const userIds = new Set();
      if (Array.isArray(encuestas)) {
        encuestas.forEach((encuesta) => {
          if (Array.isArray(encuesta.dimensions)) {
            encuesta.dimensions.forEach((dimension) => {
              if (Array.isArray(dimension.items)) {
                dimension.items.forEach((item) => {
                  if (Array.isArray(item.responses)) {
                    item.responses.forEach((respuesta) => {
                      userIds.add(respuesta.userId);
                    });
                  }
                });
              }
            });
          }
        });
      }

      // Filtramos los userIds que no hemos procesado antes
      const userIdsPendientes = Array.from(userIds).filter(userId => !userIdsProcesados.has(userId));

      // Realizamos las solicitudes para obtener los nombres de los usuarios pendientes
      const usuariosPromises = userIdsPendientes.map(async (userId) => {
        const { data: usuario } = await axios.get(`http://localhost:3000/user/${userId}`);
        return { userId, nombre: usuario.nombre }; // Ajusta el campo "nombre" según la respuesta de tu API
      });

      // Esperamos a que todas las solicitudes se completen
      const usuariosData = await Promise.all(usuariosPromises);

      // Actualizamos el estado con los usuarios
      const usuariosMap = usuariosData.reduce((acc, { userId, nombre }) => {
        acc[userId] = nombre;
        return acc;
      }, {});

      setUsuarios(prevUsuarios => ({ ...prevUsuarios, ...usuariosMap })); // Agregamos nuevos usuarios al estado

      // Actualizamos el Set de userIds procesados
      setUserIdsProcesados(prevSet => new Set([...prevSet, ...userIdsPendientes]));
    };

    obtenerNombresUsuarios();
  }, [encuestas, userIdsProcesados]); // Dependencia para que se ejecute cada vez que cambian las encuestas o los userIds procesados

  // Verificar si 'encuestas' es un arreglo antes de hacer el map
  if (!Array.isArray(encuestas)) {
    return <p>No hay encuestas disponibles.</p>; // Mensaje si encuestas no es un arreglo
  }

  return (
    <div className="border p-4 rounded-lg mb-4 shadow-md bg-gray-100">
      <h2 className="text-lg font-bold text-blue-800 mb-3">Asignatura: {asignatura}</h2>

      {encuestas.map((encuesta) => {
        console.log("Procesando encuesta:", encuesta);

        return (
          <div key={encuesta.id} className="border p-4 rounded-lg mb-4 shadow-sm bg-white">
            <h3 className="text-md font-bold text-blue-700 mb-2">Encuesta: {encuesta.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{encuesta.description}</p>

            <div className="space-y-2">
              {/* Iterar sobre las dimensiones de cada encuesta */}
              {Array.isArray(encuesta.dimensions) &&
                encuesta.dimensions.map((dimension, idx) => {
                  // Verificar si hay items con respuestas
                  const itemsConRespuestas = Array.isArray(dimension.items)
                    ? dimension.items.filter(item => Array.isArray(item.responses) && item.responses.length > 0)
                    : [];

                  if (itemsConRespuestas.length === 0) {
                    return null; // No renderizamos si no hay respuestas
                  }

                  return (
                    <div key={idx} className="border p-4 rounded-lg mb-4 shadow-sm bg-white">
                      <div className="space-y-2">
                        {itemsConRespuestas.map((item, itemIdx) => (
                          <div key={itemIdx} className="space-y-2">
                            <h4 className="font-semibold text-gray-800">Pregunta: {item.text}</h4>
                            {Array.isArray(item.responses) && item.responses.map((respuesta, i) => {
                              const nombreUsuario = usuarios[respuesta.userId];
                              return (
                                <div key={i} className="p-2 border-b">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Respuesta de {nombreUsuario}:</span> {respuesta.answer}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Asignatura;

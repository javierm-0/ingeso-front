import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [uncompletedSurveys, setUncompletedSurveys] = useState([]);
    const [completedSurveys, setCompletedSurveys] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCompleted, setShowCompleted] = useState(false);
    const [showUncompleted, setShowUncompleted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uncompletedResponse = await axios.get('http://localhost:4000/survey-assignments/uncompleted');
                setUncompletedSurveys(uncompletedResponse.data);

                const completedResponse = await axios.get('http://localhost:4000/survey-assignments/completed');
                setCompletedSurveys(completedResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las encuestas:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalSurveys = completedSurveys.length + uncompletedSurveys.length;
    const completedPercentage = totalSurveys ? (completedSurveys.length / totalSurveys) * 100 : 0;
    const uncompletedPercentage = totalSurveys ? (uncompletedSurveys.length / totalSurveys) * 100 : 0;

    const allSubjects = Array.from(new Set([
        ...completedSurveys.map(survey => survey.survey.subject),
        ...uncompletedSurveys.map(survey => survey.survey.subject)
    ]));

    const getSurveyCountBySubject = (surveys, subject) => {
        return surveys.filter(survey => survey.survey.subject === subject).length;
    };

    // Datos para el gráfico de líneas (por asignatura)
    const lineData = {
        labels: allSubjects,
        datasets: [
            {
                label: 'Completadas',
                data: allSubjects.map(subject => getSurveyCountBySubject(completedSurveys, subject)),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'No Completadas',
                data: allSubjects.map(subject => getSurveyCountBySubject(uncompletedSurveys, subject)),
                borderColor: '#FF6347',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Opciones para los gráficos
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    // Función para alternar la visibilidad de las encuestas completadas
    const toggleCompleted = () => setShowCompleted(!showCompleted);

    // Función para alternar la visibilidad de las encuestas no completadas
    const toggleUncompleted = () => setShowUncompleted(!showUncompleted);

    return (
        <div className='flex'>
            <div className='w-1/5'>
                <AdminSidebar />
            </div>

            <div className='ml-40 mt-12 mr-36 w-[100%] bg-white p-8 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
                {loading ? (
                    <p className='text-lg text-gray-500'>Cargando...</p>
                ) : (
                    <div>
                        <div className="flex space-x-4 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                                <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Encuestas Completadas</h2>
                                <p className="text-3xl font-bold">{completedPercentage.toFixed(2)}%</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                                <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Encuestas No Completadas</h2>
                                <p className="text-3xl font-bold">{uncompletedPercentage.toFixed(2)}%</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
                            <h2 className='text-2xl font-semibold text-gray-700 mb-4'>Estado de las Encuestas por Asignatura</h2>
                            <Line data={lineData} options={options} />
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                            <button
                                onClick={toggleCompleted}
                                className="text-xl font-semibold text-gray-800 mb-4 w-full text-left"
                            >
                                Encuestas Completadas de Estudiantes
                            </button>
                            {showCompleted && (
                                <div>
                                    {completedSurveys.length > 0 ? (
                                        completedSurveys.map((survey) => (
                                            <div key={survey.id} className="border-b py-2">
                                                <h4 className="font-medium text-lg">{survey.survey.title}</h4>
                                                <p className="text-gray-600">Asignatura: {survey.survey.subject}</p>
                                                <p className="text-gray-600">Estudiante: {survey.userMail}</p>
                                                <p className="text-sm text-gray-500">Fecha de finalización: {survey.endDate}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">No hay encuestas completadas.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                            <button
                                onClick={toggleUncompleted}
                                className="text-xl font-semibold text-gray-800 mb-4 w-full text-left"
                            >
                                Encuestas Pendientes de Estudiantes
                            </button>
                            {showUncompleted && (
                                <div>
                                    {uncompletedSurveys.length > 0 ? (
                                        uncompletedSurveys.map((survey) => (
                                            <div key={survey.id} className="border-b py-2">
                                                <h4 className="font-medium text-lg">{survey.survey.title}</h4>
                                                <p className="text-gray-600">Asignatura: {survey.survey.subject}</p>
                                                <p className="text-gray-600">Estudiante: {survey.userMail}</p>
                                                <p className="text-sm text-gray-500">Fecha de finalización: {survey.endDate}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">No hay encuestas no completadas.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

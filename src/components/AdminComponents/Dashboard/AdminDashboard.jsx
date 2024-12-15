import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../AdminSidebar';

const AdminDashboard = () => {
    const [uncompletedSurveys, setUncompletedSurveys] = useState([]);
    const [completedSurveys, setCompletedSurveys] = useState([]);
    const [allSurveyAmount, setAllSurveyAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const uncompletedResponse = await axios.get('http://localhost:4000/survey-assignments/uncompleted');
                setUncompletedSurveys(uncompletedResponse.data);

                const completedResponse = await axios.get('http://localhost:4000/survey-assignments/completed');
                setCompletedSurveys(completedResponse.data);
                setAllSurveyAmount(uncompletedResponse.data.length + completedResponse.data.length);

                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las encuestas:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex'>
            <div className='w-1/4'>
                <AdminSidebar />
            </div>

            <div className='ml-4 w-3/4 mt-16'>
                <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div>
                        <p>Cantidad total de encuestas: {allSurveyAmount}</p>
                        <p>Cantidad de encuestas completadas: {completedSurveys.length}</p>
                        <p>Cantidad de encuestas no completadas: {uncompletedSurveys.length}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

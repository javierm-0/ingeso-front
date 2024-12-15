import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from 'react-toastify';
import Tostadas from "../zSharedComponents/Tostadas";
import axios from 'axios';

const AdminAddSubject = () => {
    const [subjectName, setSubjectName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setSubjectName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (subjectName.trim() === '') {
            Tostadas.ToastError('Ingrese una asignatura válida');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            };

            const response = await axios.post("http://localhost:3000/subjects/", 
                JSON.stringify({ asignatura: subjectName }),
                config
            );

            if (response.status === 201) {
                Tostadas.ToastSuccess('Asignatura agregada exitosamente');
                setSubjectName('');
            }
        } catch (err) {
            setError('Error al agregar la asignatura');
            Tostadas.ToastError('Error al agregar la asignatura');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="w-1/5">
                <AdminSidebar />
            </div>
            <div className="ml-40 mt-12 mr-36 w-[50%] bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">Agregar Asignatura</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">Nombre de la Asignatura</label>
                        <input
                            type="text"
                            value={subjectName}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            placeholder="Ingrese el nombre de la asignatura"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 mt-4 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Agregar Asignatura'}
                    </button>

                    {error && <p className="mt-4 text-red-600">{error}</p>}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminAddSubject;

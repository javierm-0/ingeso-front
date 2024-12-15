import { useState,useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer } from 'react-toastify';
import validarRut from "./validarRut";
import Tostadas from "../../zSharedComponents/Tostadas";
import axios from "axios";

const AdminAddUsers = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rut: '',
        role: 'student', // Valor por defecto
    });

    const [rutValido, setRutValido] = useState(true);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "rut") {
            const esValido = validarRut(value);
            setRutValido(validarRut(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rutValido) {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            };

            try {
                const response = await axios.post("http://localhost:3000/user/create", formData, config);
                console.log("Usuario creado:", response.data);
                Tostadas.ToastSuccess('Usuario creado exitosamente');
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                Tostadas.ToastError('Hubo un error al crear el usuario');
            }
        } else {
            Tostadas.ToastError('El RUT ingresado no es válido');
        }
    }
    

    return (
        <div className="flex">
            <div className="w-1/5">
                <AdminSidebar />
            </div>
            <div className="ml-40 mt-12 mr-36 w-[50%] bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">Agregar Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                Nombres
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Apellidos
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
                                Rut
                            </label>
                            <input
                                type="text"
                                id="rut"
                                name="rut"
                                value={formData.rut}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            {!rutValido && <p className="text-red-500 text-sm">Escriba un rut válido sin puntos y con guión.</p>}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Rol
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="student">Estudiante</option>
                                <option value="teacher">Profesor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Agregar Usuario
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminAddUsers;
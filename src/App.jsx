import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx'
import Teacher from './components/TeacherComponents/Teacher.jsx';
import TeacherPerfil from './components/TeacherComponents/TeacherPerfil.jsx';
import Student from './components/StudentComponents/Student.jsx';
import StudentPerfil from './components/StudentComponents/StudentPerfil.jsx';
import Admin from './components/AdminComponents/Admin.jsx';
import AdminPerfil from './components/AdminComponents/AdminPerfil.jsx';
import EncuestaEvaluacion from './components/StudentComponents/EncuestaEvaluacion.jsx';
import ListadoEncuestas from './components/StudentComponents/ListadoEncuestas.jsx';

import Logout from './components/zSharedComponents/Logout.js';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/zSharedComponents/ProtectedRoute.jsx';
import AccessDenied from './components/zSharedComponents/AccessDenied.jsx';
import SurveyBuilder from './components/AdminComponents/CrearEncuestaComponents/SurveyBuilder.jsx';

import StudentList from './components/AdminComponents/AsignarAsignaturaEnEstudiante/StudentList.jsx'
import TeacherList from './components/AdminComponents/AsignarAsignaturaEnProfesor/TeacherList.jsx';
import AsignarAsignaturaProf from './components/AdminComponents/AsignarAsignaturaEnProfesor/AsignarAsignaturaProf.jsx';
import EliminarAsignaturaProf from './components/AdminComponents/AsignarAsignaturaEnProfesor/EliminarAsignaturaProf.jsx';
import AsignarAsignaturaEstudiante from './components/AdminComponents/AsignarAsignaturaEnEstudiante/AsignarAsignaturaEstudiante.jsx';
import EliminarAsignaturaEstudiante from './components/AdminComponents/AsignarAsignaturaEnEstudiante/EliminarAsignaturaEstudiante.jsx';

const App = () => {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}><Teacher /></ProtectedRoute>} />
          <Route path="/teacher/teacherProfile" element={
            <ProtectedRoute allowedRoles={['teacher']}><TeacherPerfil /></ProtectedRoute>} />

          
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}><Student /></ProtectedRoute>} />
          <Route path="/student/studentProfile" element={
            <ProtectedRoute allowedRoles={['student']}><StudentPerfil /></ProtectedRoute>} />
          <Route path="/student/elegirEncuesta" element={
            <ProtectedRoute allowedRoles={['student']}><ListadoEncuestas /></ProtectedRoute>} />
          <Route path="/student/elegirEncuesta/responderEncuesta" element={
            <ProtectedRoute allowedRoles={['student']}><EncuestaEvaluacion /></ProtectedRoute>} />


          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/admin/adminProfile" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminPerfil /></ProtectedRoute>} />
          <Route path="/admin/crearEncuesta" element={
            <ProtectedRoute allowedRoles={['admin']}><SurveyBuilder /></ProtectedRoute>} />


          <Route path="/admin/elegirEstudiante" element={
            <ProtectedRoute allowedRoles={['admin']}><StudentList/></ProtectedRoute>} />
          <Route path="/admin/elegirEstudiante/asignarAsignatura" element={
            <ProtectedRoute allowedRoles={['admin']}><AsignarAsignaturaEstudiante /></ProtectedRoute>} />
          <Route path="/admin/elegirEstudiante/quitarAsignatura" element={
            <ProtectedRoute allowedRoles={['admin']}><EliminarAsignaturaEstudiante /></ProtectedRoute>} />

          <Route path="/admin/elegirProfesor" element={
            <ProtectedRoute allowedRoles={['admin']}><TeacherList /></ProtectedRoute>} />
          <Route path="/admin/elegirProfesor/asignarAsignaturaProfesor" element={
            <ProtectedRoute allowedRoles={['admin']}><AsignarAsignaturaProf /></ProtectedRoute>} />
          <Route path="/admin/elegirProfesor/quitarAsignatura" element={
            <ProtectedRoute allowedRoles={['admin']}><EliminarAsignaturaProf /></ProtectedRoute>} />



          <Route path="*" element={<Login></Login>} />
        </Routes>
      </AuthProvider>
    </Router>
  );  
};

export default App

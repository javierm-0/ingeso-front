import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx'
import Teacher from './components/Teacher.jsx';
import TeacherPerfil from './components/TeacherPerfil.jsx';
import Student from './components/Student.jsx';
import StudentPerfil from './components/StudentPerfil.jsx';
import Admin from './components/Admin.jsx';
import AdminPerfil from './components/AdminPerfil.jsx';
import ResponderEncuesta from './components/EncuestaEvaluacion.jsx';

const App = () => {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/teacher" element={<Teacher />} />
      <Route path="/teacher/teacherProfile" element={<TeacherPerfil/>} />

      <Route path="/student" element={<Student />} />
      <Route path="/student/studentProfile" element={<StudentPerfil />} />
      <Route path="/student/responderEncuesta" element={<ResponderEncuesta />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/adminProfile" element={<AdminPerfil />} />
    </Routes>
  </Router>
  );

  /*
    <div className="flex items-center justify-center h-screen">
      <div className="bg-cyan-400 p-6 rounded">
        <img>

        </img>
        <h1>
          ¡Bienvenid@ al Sistema!
        </h1>
      </div>
    </div>
  
  )
    */
};

export default App

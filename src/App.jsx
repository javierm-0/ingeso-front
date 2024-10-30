import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx'
import Teacher from './components/Teacher.jsx';
import Student from './components/Student.jsx';
import StudentSidebar from './components/StudentSidebar.jsx';
import TeacherSidebar from './components/TeacherSidebar.jsx';


const App = () => {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/teacher" element={<Teacher />} />
      <Route path="/student" element={<Student />} />
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

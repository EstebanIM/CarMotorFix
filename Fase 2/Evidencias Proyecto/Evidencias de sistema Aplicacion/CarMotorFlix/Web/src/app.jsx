import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de React Toastify
import Login from './pages/login/login';
import EmailVerification from './pages/login/Verif';
import Dashboard from './pages/all/dashboard'; // Importa el componente Dashboard
import Dashboardadmin from './pages/admin/admin_dashboard';
import DashboardMecanico from './pages/mecanico/mecanico_dashboard';
import ConfigUsser from './pages/all/config_users';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Ruta principal de login */}
          <Route path="/" element={<Login />} />
          {/* Ruta para la verificación de correo */}
          <Route path="/verify-email" element={<EmailVerification />} />
          {/* Ruta para el dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<Dashboardadmin />} /> 
          <Route path="/mecanico-dashboard" element={<DashboardMecanico />} /> 
          <Route path="/Config" element={<ConfigUsser />} /> 
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
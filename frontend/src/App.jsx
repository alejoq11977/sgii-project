import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CssBaseline } from '@mui/material';

// Importación de componentes
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './components/layout/MainLayout';
import PrivateRoutes from './utils/PrivateRoutes';
import IncapacityList from './pages/Incapacities/IncapacityList';
import IncapacityForm from './pages/Incapacities/IncapacityForm';
import IncapacityDetail from './pages/Incapacities/IncapacityDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssBaseline />
        <Routes>
          {/* Ruta Pública: Login */}
          <Route path="/" element={<Login />} />

          {/* Rutas Privadas (Protegidas) */}
          <Route element={<PrivateRoutes />}>
            {/* Layout Principal que envuelve las páginas internas */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incapacities" element={<IncapacityList />} />
              <Route path="/incapacities/new" element={<IncapacityForm />} />
              <Route path="/incapacities/:id" element={<IncapacityDetail />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
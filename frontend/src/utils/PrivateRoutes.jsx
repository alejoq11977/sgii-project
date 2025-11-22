import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoutes = () => {
    const { user } = useContext(AuthContext);

    // Si hay usuario (token válido), muestra el contenido (Outlet)
    // Si no, redirige a la raíz (Login)
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
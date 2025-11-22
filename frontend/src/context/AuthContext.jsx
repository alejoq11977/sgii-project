import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Intentamos leer el token del almacenamiento local al iniciar
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        try {
            // Petición a Django para obtener tokens
            const response = await api.post('token/', { username, password });
            
            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));
                
                // Guardar en navegador
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                localStorage.setItem('access_token', response.data.access);
                
                return { success: true };
            }
        } catch (error) {
            console.error("Error login:", error);
            return { success: false, error: "Usuario o contraseña incorrectos" };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('access_token');
    };

    useEffect(() => {
        if (authTokens) {
            try {
                setUser(jwtDecode(authTokens.access));
            } catch (error) {
                logoutUser();
            }
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importación correcta
import AuthContext from '../../context/AuthContext';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    Box, 
    Alert 
} from '@mui/material';

const Login = () => {
    // 2. LOS HOOKS VAN AQUÍ ARRIBA (Al inicio del componente)
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate(); // <--- Aquí es donde debe declararse
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Llamamos a la función del contexto
        const result = await loginUser(username, password);
        
        if (result.success) {
            // 3. Aquí solo USAMOS la variable 'navigate', no llamamos al hook
            navigate('/dashboard'); 
        } else {
            setError(result.error);
        }
    };

    return (
        <Box 
            sx={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                        SGII - Acceso
                    </Typography>
                    
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
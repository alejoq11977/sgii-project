import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    Box, 
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Avatar,
    Divider,
    Fade
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            const result = await loginUser(username, password);
            
            if (result.success) {
                navigate('/dashboard'); 
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error de conexión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f7fa',
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}
        >
            {/* Elementos decorativos de fondo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    bgcolor: '#1976d2',
                    opacity: 0.05,
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -150,
                    left: -150,
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    bgcolor: '#9c27b0',
                    opacity: 0.05,
                    zIndex: 0
                }}
            />

            <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in={true} timeout={800}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'white',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                        }}
                    >
                        {/* Logo y Header */}
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                bgcolor: '#1976d2',
                                mb: 2,
                                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            <LocalHospitalIcon sx={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 800,
                                color: '#1a237e',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            SGII
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ 
                                mb: 1,
                                textAlign: 'center',
                                fontWeight: 500
                            }}
                        >
                            Sistema de Gestión de Incapacidades
                        </Typography>

                        <Divider sx={{ width: '100%', my: 3 }} />

                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 3,
                                alignSelf: 'flex-start'
                            }}
                        >
                            Iniciar Sesión
                        </Typography>

                        {/* Alerta de Error */}
                        {error && (
                            <Fade in={true}>
                                <Alert 
                                    severity="error" 
                                    onClose={() => setError(null)}
                                    sx={{ 
                                        width: '100%',
                                        mb: 3,
                                        borderRadius: 2
                                    }}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Formulario */}
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit} 
                            sx={{ width: '100%' }}
                        >
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
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#1976d2'
                                            }
                                        }
                                    }
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                                disabled={loading}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#1976d2'
                                            }
                                        }
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                sx={{ 
                                    mt: 4,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    bgcolor: '#1976d2',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        bgcolor: '#1565c0',
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                                    },
                                    '&:disabled': {
                                        bgcolor: '#90caf9'
                                    }
                                }}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </Box>

                        
                    </Paper>
                </Fade>

                {/* Información adicional */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'white'
                        }}
                    >
                    
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
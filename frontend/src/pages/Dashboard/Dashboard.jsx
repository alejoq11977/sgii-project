import { useEffect, useState, useContext } from 'react';
import { getDashboardStats } from '../../api/incapacities';
import AuthContext from '../../context/AuthContext';
import { 
    Typography, Grid, Box, CircularProgress, 
    Card, CardContent, Avatar, Chip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Componente de Tarjeta rediseñado (Sin barra de progreso)
const StatCard = ({ title, value, icon, color, subtext }) => (
    <Card 
        elevation={0} 
        sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            border: `1px solid ${color}30`,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 24px ${color}25`,
                border: `1px solid ${color}50`,
            }
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography 
                        color="textSecondary" 
                        gutterBottom 
                        variant="body2"
                        sx={{ 
                            fontWeight: 600, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.75rem'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700, 
                            color: color,
                            fontSize: '2.5rem',
                            lineHeight: 1,
                            mt: 1
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
                <Avatar 
                    sx={{ 
                        bgcolor: `${color}20`,
                        width: 56,
                        height: 56,
                        boxShadow: `0 4px 14px ${color}30`
                    }}
                >
                    {icon}
                </Avatar>
            </Box>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                    {subtext}
                </Typography>
            </Box>
        </CardContent>
        
        {/* Efecto visual de fondo */}
        <Box 
            sx={{ 
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `${color}10`,
                filter: 'blur(30px)',
            }}
        />
    </Card>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error cargando stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '60vh',
                gap: 2
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" color="textSecondary">
                    Cargando información...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Sección de Encabezado */}
            <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #1976d2 0%, #1976d2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 0.5
                            }}
                        >
                            Bienvenido, {user?.username}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <Chip 
                        label={user?.role || 'Usuario'}
                        color="primary"
                        sx={{ 
                            fontWeight: 600,
                            px: 1,
                            fontSize: '0.875rem'
                        }}
                    />
                </Box>
                <Typography variant="h6" color="textSecondary" sx={{ mt: 2, fontWeight: 400 }}>
                    Panel de Control - Gestión de Incapacidades
                </Typography>
            </Box>

            {/* Grid de Tarjetas Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Pendientes de Revisión" 
                        value={stats?.pending || 0} 
                        icon={<WarningIcon sx={{ fontSize: 28, color: '#ed6c02' }} />}
                        color="#ed6c02"
                        subtext="Nuevas radicaciones que requieren atención inmediata"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="En Trámite EPS" 
                        value={stats?.in_process || 0} 
                        icon={<PendingActionsIcon sx={{ fontSize: 28, color: '#0288d1' }} />}
                        color="#0288d1"
                        subtext="Actualmente transcritas o en gestión con la entidad"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Pagadas / Cerradas" 
                        value={stats?.paid || 0} 
                        icon={<CheckCircleIcon sx={{ fontSize: 28, color: '#2e7d32' }} />}
                        color="#2e7d32"
                        subtext="Ciclo completado con pago verificado"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Histórico" 
                        value={stats?.total || 0} 
                        icon={<AssignmentIcon sx={{ fontSize: 28, color: '#9c27b0' }} />}
                        color="#9c27b0"
                        subtext="Registro histórico acumulado"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
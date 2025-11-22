import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncapacityById, updateIncapacityStatus } from '../../api/incapacities';
import AuthContext from '../../context/AuthContext';
import { 
    Typography, Paper, Grid, Box, Chip, Button, 
    Divider, TextField, Card, CardContent, CardActions, 
    Tab, Tabs, Avatar, Stack, IconButton, Tooltip,
    Alert, Fade, LinearProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FinanceTab from './components/FinanceTab';

const InfoCard = ({ icon: Icon, label, value, color = '#1976d2' }) => (
    <Card 
        elevation={0}
        sx={{ 
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: color,
                boxShadow: `0 4px 12px ${color}20`,
                transform: 'translateY(-2px)'
            }
        }}
    >
        <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Avatar 
                    sx={{ 
                        bgcolor: `${color}15`,
                        width: 40,
                        height: 40
                    }}
                >
                    <Icon sx={{ color: color, fontSize: 20 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{ 
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem'
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            mt: 0.5,
                            wordBreak: 'break-word'
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const StatusChip = ({ status }) => {
    const statusConfig = {
        'REPORTED': { label: 'Reportada', color: '#ed6c02', bgcolor: '#ed6c0215' },
        'TRANSCRIBED': { label: 'Transcrita', color: '#0288d1', bgcolor: '#0288d115' },
        'FILED': { label: 'Radicada', color: '#0288d1', bgcolor: '#0288d115' },
        'PAID': { label: 'Pagada', color: '#2e7d32', bgcolor: '#2e7d3215' },
        'REJECTED': { label: 'Rechazada', color: '#d32f2f', bgcolor: '#d32f2f15' }
    };

    const config = statusConfig[status] || { label: status, color: '#757575', bgcolor: '#75757515' };

    return (
        <Chip 
            label={config.label}
            sx={{ 
                bgcolor: config.bgcolor,
                color: config.color,
                fontWeight: 700,
                fontSize: '0.875rem',
                px: 1,
                height: 32,
                border: `1.5px solid ${config.color}40`
            }}
        />
    );
};

const IncapacityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [incapacity, setIncapacity] = useState(null);
    const [observation, setObservation] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const data = await getIncapacityById(id);
            setIncapacity(data);
        } catch (error) {
            console.error("Error", error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;
        setLoading(true);
        try {
            await updateIncapacityStatus(id, newStatus, observation);
            alert('Estado actualizado');
            setObservation('');
            loadData(); 
        } catch (error) {
            alert('Error actualizando estado');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!incapacity) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <LinearProgress sx={{ width: 200, mb: 2 }} />
                    <Typography color="textSecondary">Cargando información...</Typography>
                </Box>
            </Box>
        );
    }

    const isAdmin = user?.role === 'RRHH' || user?.role === 'ADMIN' || user?.role === 'TREASURY';

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
            {/* HEADER */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            onClick={() => navigate('/incapacities')}
                            sx={{ 
                                bgcolor: 'background.paper',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                                Incapacidad #{incapacity.id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                Empleado: {incapacity.employee_name}
                            </Typography>
                        </Box>
                    </Box>
                    <StatusChip status={incapacity.status} />
                </Box>
            </Paper>

            {/* TABS */}
            <Paper 
                elevation={0} 
                sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{ 
                        px: 2,
                        '& .MuiTab-root': {
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            minHeight: 64
                        }
                    }}
                >
                    <Tab icon={<DescriptionIcon />} iconPosition="start" label="Información General" />
                    <Tab icon={<HistoryIcon />} iconPosition="start" label="Historial y Gestión" />
                    <Tab icon={<AccountBalanceIcon />} iconPosition="start" label="Finanzas y Pagos" />
                </Tabs>
            </Paper>

            {/* CONTENIDO DE TABS */}
            <Fade in={true} timeout={500}>
                <Box>
                    {/* PESTAÑA 0: INFORMACIÓN GENERAL */}
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {/* Información Principal */}
                            <Grid item xs={12}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
                                        Datos del Reporte
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={PersonIcon}
                                                label="Empleado"
                                                value={incapacity.employee_name}
                                                color="#1976d2"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={LocalHospitalIcon}
                                                label="Tipo de Incapacidad"
                                                value={incapacity.incapacity_type}
                                                color="#9c27b0"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={BusinessIcon}
                                                label="Entidad"
                                                value={incapacity.entity_name}
                                                color="#0288d1"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={LocalHospitalIcon}
                                                label="Código Diagnóstico"
                                                value={incapacity.diagnosis_code}
                                                color="#d32f2f"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={CalendarTodayIcon}
                                                label="Días de Incapacidad"
                                                value={`${incapacity.days} días`}
                                                color="#ed6c02"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <InfoCard 
                                                icon={AttachMoneyIcon}
                                                label="Salario Base (IBC)"
                                                value={`$${incapacity.ibc_value?.toLocaleString()}`}
                                                color="#2e7d32"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoCard 
                                                icon={CalendarTodayIcon}
                                                label="Periodo"
                                                value={`${incapacity.start_date} al ${incapacity.end_date}`}
                                                color="#5e35b1"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Documentos */}
                            <Grid item xs={12}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
                                        Documentos Soporte
                                    </Typography>
                                    {incapacity.documents.length === 0 ? (
                                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                                            No hay documentos cargados para esta incapacidad.
                                        </Alert>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {incapacity.documents.map((doc) => (
                                                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                                                    <Card 
                                                        elevation={0}
                                                        sx={{ 
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            borderRadius: 2,
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                borderColor: '#1976d2',
                                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                <Avatar sx={{ bgcolor: '#1976d215', width: 36, height: 36 }}>
                                                                    <DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                                                </Avatar>
                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                                                                        {doc.document_type}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="textSecondary">
                                                                        {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button 
                                                                size="small" 
                                                                startIcon={<DownloadIcon />} 
                                                                href={doc.file} 
                                                                target="_blank"
                                                                sx={{ fontWeight: 600 }}
                                                            >
                                                                Ver Archivo
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {/* PESTAÑA 1: HISTORIAL Y GESTIÓN */}
                    {tabValue === 1 && (
                        <Box>
                            {/* Panel de Gestión Administrativa */}
                            {isAdmin && (
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 3, 
                                        mb: 3,
                                        borderRadius: 3,
                                        border: '2px solid #ed6c02',
                                        bgcolor: '#fff3e0'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <EditNoteIcon sx={{ color: '#e65100' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#e65100' }}>
                                            Gestión Administrativa
                                        </Typography>
                                    </Box>
                                    
                                    <TextField 
                                        fullWidth 
                                        label="Observaciones / Motivo / Núm. Radicado"
                                        multiline
                                        rows={3}
                                        value={observation}
                                        onChange={(e) => setObservation(e.target.value)}
                                        sx={{ 
                                            mb: 2, 
                                            bgcolor: 'white',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                        placeholder="Ingrese observaciones, número de radicado o motivo del cambio..."
                                    />

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleStatusChange('TRANSCRIBED')}
                                            disabled={loading}
                                            fullWidth
                                            sx={{ 
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 600
                                            }}
                                        >
                                            Transcribir / Aprobar
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            startIcon={<CancelIcon />}
                                            onClick={() => handleStatusChange('REJECTED')}
                                            disabled={loading}
                                            fullWidth
                                            sx={{ 
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 600
                                            }}
                                        >
                                            Rechazar
                                        </Button>
                                    </Stack>
                                </Paper>
                            )}

                            {/* Bitácora */}
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
                                    Bitácora de Cambios
                                </Typography>
                                
                                {incapacity.history && incapacity.history.length > 0 ? (
                                    <Stack spacing={2}>
                                        {incapacity.history.map((item, index) => (
                                            <Card 
                                                key={item.id}
                                                elevation={0}
                                                sx={{ 
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 2,
                                                    borderLeft: '4px solid #1976d2'
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: '#1976d215', width: 40, height: 40 }}>
                                                            <HistoryIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                                {item.changed_by_name || 'Sistema'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                                Cambió de <Chip label={item.previous_status} size="small" sx={{ mx: 0.5 }} /> 
                                                                a <Chip label={item.new_status} size="small" sx={{ mx: 0.5 }} />
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {new Date(item.change_date).toLocaleString('es-ES', {
                                                                    dateStyle: 'long',
                                                                    timeStyle: 'short'
                                                                })}
                                                            </Typography>
                                                            {item.observation && (
                                                                <Paper 
                                                                    sx={{ 
                                                                        mt: 2, 
                                                                        p: 2, 
                                                                        bgcolor: '#f5f5f5',
                                                                        borderRadius: 2,
                                                                        border: '1px solid #e0e0e0'
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                                        "{item.observation}"
                                                                    </Typography>
                                                                </Paper>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        No hay movimientos registrados en el historial.
                                    </Alert>
                                )}
                            </Paper>
                        </Box>
                    )}

                    {/* PESTAÑA 2: FINANZAS */}
                    {tabValue === 2 && (
                        <FinanceTab 
                            incapacityId={id} 
                            status={incapacity.status} 
                        />
                    )}
                </Box>
            </Fade>
        </Box>
    );
};

export default IncapacityDetail;
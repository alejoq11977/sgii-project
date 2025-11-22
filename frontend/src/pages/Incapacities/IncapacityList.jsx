import { useEffect, useState } from 'react';
import { getIncapacities } from '../../api/incapacities';
import { 
    Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, Button, Box,
    TextField, InputAdornment, MenuItem, Avatar, Stack,
    Card, CardContent, Grid, CircularProgress, Fade,
    IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

const StatusChip = ({ status }) => {
    const statusConfig = {
        'REPORTED': { 
            label: 'Reportada', 
            color: '#ed6c02', 
            bgcolor: '#ed6c0215',
            borderColor: '#ed6c0240'
        },
        'TRANSCRIBED': { 
            label: 'Transcrita', 
            color: '#0288d1', 
            bgcolor: '#0288d115',
            borderColor: '#0288d140'
        },
        'FILED': { 
            label: 'Radicada', 
            color: '#0288d1', 
            bgcolor: '#0288d115',
            borderColor: '#0288d140'
        },
        'PAID': { 
            label: 'Pagada', 
            color: '#2e7d32', 
            bgcolor: '#2e7d3215',
            borderColor: '#2e7d3240'
        },
        'REJECTED': { 
            label: 'Rechazada', 
            color: '#d32f2f', 
            bgcolor: '#d32f2f15',
            borderColor: '#d32f2f40'
        }
    };

    const config = statusConfig[status] || { 
        label: status, 
        color: '#757575', 
        bgcolor: '#75757515',
        borderColor: '#75757540'
    };

    return (
        <Chip 
            label={config.label}
            size="small"
            sx={{ 
                bgcolor: config.bgcolor,
                color: config.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                border: `1px solid ${config.borderColor}`,
                '& .MuiChip-label': {
                    px: 1.5
                }
            }}
        />
    );
};

const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: `${color}15`, width: 44, height: 44 }}>
                    <Icon sx={{ color: color, fontSize: 22 }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: color }}>
                        {value}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{ 
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontSize: '0.65rem'
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                {trend && (
                    <Chip 
                        label={trend}
                        size="small"
                        sx={{ 
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            bgcolor: '#2e7d3215',
                            color: '#2e7d32'
                        }}
                    />
                )}
            </Box>
        </CardContent>
    </Card>
);

const IncapacityList = () => {
    const [incapacities, setIncapacities] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchTerm, statusFilter, incapacities]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getIncapacities();
            setIncapacities(data.results || data); 
            setFilteredData(data.results || data);
        } catch (error) {
            console.error("Error cargando incapacidades", error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = incapacities;

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id?.toString().includes(searchTerm) ||
                item.diagnosis_code?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por estado
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredData(filtered);
    };

    const getStats = () => {
        return {
            total: incapacities.length,
            reported: incapacities.filter(i => i.status === 'REPORTED').length,
            transcribed: incapacities.filter(i => i.status === 'TRANSCRIBED' || i.status === 'FILED').length,
            paid: incapacities.filter(i => i.status === 'PAID').length
        };
    };

    const stats = getStats();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Cargando incapacidades...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5 }}>
                            Gestión de Incapacidades
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Administre y consulte todas las incapacidades registradas
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/incapacities/new')}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6b3f92 100%)',
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                            }
                        }}
                    >
                        Nueva Radicación
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                        <StatsCard 
                            title="Total"
                            value={stats.total}
                            icon={LocalHospitalIcon}
                            color="#9c27b0"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatsCard 
                            title="Reportadas"
                            value={stats.reported}
                            icon={TrendingUpIcon}
                            color="#ed6c02"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatsCard 
                            title="En Trámite"
                            value={stats.transcribed}
                            icon={CalendarTodayIcon}
                            color="#0288d1"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatsCard 
                            title="Pagadas"
                            value={stats.paid}
                            icon={TrendingUpIcon}
                            color="#2e7d32"
                            trend="+5%"
                        />
                    </Grid>
                </Grid>

                {/* Filtros y Búsqueda */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por empleado, ID o diagnóstico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'background.paper'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Filtrar por Estado"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FilterListIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'background.paper'
                                    }
                                }}
                            >
                                <MenuItem value="ALL">Todos los Estados</MenuItem>
                                <MenuItem value="REPORTED">Reportadas</MenuItem>
                                <MenuItem value="TRANSCRIBED">Transcritas</MenuItem>
                                <MenuItem value="FILED">Radicadas</MenuItem>
                                <MenuItem value="PAID">Pagadas</MenuItem>
                                <MenuItem value="REJECTED">Rechazadas</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                                <strong>{filteredData.length}</strong> de <strong>{incapacities.length}</strong> registros
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Tabla */}
            <Fade in={true} timeout={500}>
                <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>Empleado</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>Fecha Inicio</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>Fecha Fin</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }} align="center">Días</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.875rem' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <LocalHospitalIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                                No se encontraron registros
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {searchTerm || statusFilter !== 'ALL' 
                                                    ? 'Intente ajustar los filtros de búsqueda'
                                                    : 'Comience agregando una nueva incapacidad'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((row) => (
                                    <TableRow 
                                        key={row.id} 
                                        hover
                                        sx={{ 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: '#f5f5f5'
                                            }
                                        }}
                                        onClick={() => navigate(`/incapacities/${row.id}`)}
                                    >
                                        <TableCell>
                                            <Chip 
                                                label={`#${row.id}`}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    bgcolor: '#e3f2fd',
                                                    color: '#1976d2'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d215' }}>
                                                    <PersonIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {row.employee_name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {row.incapacity_type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">
                                                {row.start_date}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">
                                                {row.end_date}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={row.days}
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    minWidth: 45,
                                                    bgcolor: '#f3e5f5',
                                                    color: '#9c27b0'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip status={row.status} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Ver detalles">
                                                <IconButton 
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/incapacities/${row.id}`);
                                                    }}
                                                    sx={{
                                                        color: '#1976d2',
                                                        '&:hover': {
                                                            bgcolor: '#1976d215'
                                                        }
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fade>
        </Box>
    );
};

export default IncapacityList;
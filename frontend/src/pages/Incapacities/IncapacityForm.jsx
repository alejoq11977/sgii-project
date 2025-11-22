import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncapacity, uploadDocument } from '../../api/incapacities';
import { 
    Typography, Paper, TextField, Button, Grid, 
    MenuItem, Box, Alert, CircularProgress, Stepper,
    Step, StepLabel, Card, CardContent, Chip, Divider,
    InputAdornment, Fade, Collapse
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';

const IncapacityForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        incapacity_type: 'EG',
        diagnosis_code: '',
        start_date: '',
        end_date: '',
        days: 0,
        entity_name: '',
        ibc_value: 0 
    });

    const [file, setFile] = useState(null);
    const [calculatedDays, setCalculatedDays] = useState(0);

    // Calcular días automáticamente cuando cambian las fechas
    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setCalculatedDays(diffDays);
            setFormData(prev => ({ ...prev, days: diffDays }));
        }
    }, [formData.start_date, formData.end_date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validar tamaño (máximo 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('El archivo no debe superar los 10MB');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const newIncapacity = await createIncapacity(formData);
            
            if (file) {
                await uploadDocument(newIncapacity.id, file, 'CERT');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/incapacities');
            }, 2000);

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorMsg = typeof err.response.data === 'object' 
                    ? JSON.stringify(err.response.data, null, 2)
                    : err.response.data;
                setError(`Error del servidor: ${errorMsg}`);
            } else {
                setError('Error al guardar. Verifique la conexión.');
            }
        } finally {
            setLoading(false);
        }
    };

    const incapacityTypes = [
        { value: 'EG', label: 'Enfermedad General', color: '#1976d2' },
        { value: 'AL', label: 'Accidente Laboral', color: '#d32f2f' },
        { value: 'AT', label: 'Accidente de Tránsito', color: '#f57c00' },
        { value: 'LM', label: 'Licencia Maternidad', color: '#e91e63' },
        { value: 'LP', label: 'Licencia Paternidad', color: '#7b1fa2' }
    ];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
            {/* Header con diseño moderno */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4, 
                    mb: 3,
                    background: 'linear-gradient(135deg,rgb(60, 90, 224) 100%, #764ba2 0%)',
                    color: 'white',
                    borderRadius: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <LocalHospitalIcon sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Nueva Incapacidad
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                            Complete el formulario para radicar una nueva incapacidad
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Alertas */}
            <Collapse in={!!error}>
                <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            </Collapse>

            <Collapse in={success}>
                <Alert 
                    severity="success" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    icon={<CheckCircleOutlineIcon />}
                >
                    ¡Incapacidad radicada con éxito! Redirigiendo...
                </Alert>
            </Collapse>

            {/* Formulario */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        
                        {/* Sección: Información General */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DescriptionIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Información General
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* Tipo de Incapacidad */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Tipo de Incapacidad"
                                name="incapacity_type"
                                value={formData.incapacity_type}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalHospitalIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            >
                                {incapacityTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box 
                                                sx={{ 
                                                    width: 12, 
                                                    height: 12, 
                                                    borderRadius: '50%', 
                                                    bgcolor: type.color 
                                                }} 
                                            />
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Entidad */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Entidad (EPS/ARL)"
                                name="entity_name"
                                value={formData.entity_name}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Sura, Sanitas, Compensar"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>

                        {/* Sección: Información Médica */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalHospitalIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Información Médica
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* Código Diagnóstico */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Código CIE-10 (Diagnóstico)"
                                name="diagnosis_code"
                                value={formData.diagnosis_code}
                                onChange={handleChange}
                                required
                                placeholder="Ej: J06.9, M54.5"
                                helperText="Ingrese el código de diagnóstico según clasificación internacional CIE-10"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>

                        {/* Sección: Periodo y Duración */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarTodayIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Periodo y Duración
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* Fechas */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha Inicio"
                                name="start_date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fecha Fin"
                                name="end_date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Días Totales"
                                name="days"
                                value={formData.days}
                                onChange={handleChange}
                                required
                                helperText={calculatedDays > 0 ? `Calculados: ${calculatedDays} días` : ''}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>

                        {/* Sección: Información Financiera */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AttachMoneyIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Información Financiera
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* IBC */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Salario Base (IBC)"
                                name="ibc_value"
                                value={formData.ibc_value}
                                onChange={handleChange}
                                required
                                helperText="Valor mensual sin auxilio de transporte"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography variant="body2" color="textSecondary">$</Typography>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Grid>

                        {/* Sección: Documentación */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CloudUploadIcon color="primary" />
                                
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Documentación
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* Subida de Archivo */}
                        <Grid item xs={12}>
                            <Card 
                                variant="outlined" 
                                sx={{ 
                                    borderRadius: 2,
                                    border: file ? '2px solid #4caf50' : '2px dashed #bdbdbd',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#1976d2',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Button
                                        variant={file ? "contained" : "outlined"}
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        size="large"
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5
                                        }}
                                    >
                                        {file ? 'Cambiar Certificado' : 'Subir Certificado'}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                            accept="application/pdf,image/*"
                                        />
                                    </Button>
                                    {file && (
                                        <Fade in={!!file}>
                                            <Box sx={{ mt: 2 }}>
                                                <Chip 
                                                    label={file.name}
                                                    onDelete={() => setFile(null)}
                                                    color="success"
                                                    icon={<CheckCircleOutlineIcon />}
                                                    sx={{ maxWidth: '100%' }}
                                                />
                                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </Typography>
                                            </Box>
                                        </Fade>
                                    )}
                                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 2 }}>
                                        Formatos aceptados: PDF, JPG, PNG (Máximo 10MB)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Botones de Acción */}
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button 
                                    onClick={() => navigate('/incapacities')} 
                                    disabled={loading}
                                    startIcon={<CancelIcon />}
                                    size="large"
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    size="large"
                                    sx={{ 
                                        borderRadius: 2,
                                        px: 4,
                                        background: 'linear-gradient(135deg,rgb(41, 68, 190) 100%, #764ba2 0%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg,rgb(65, 90, 235) 100%, #6b3f92 0%)',
                                        }
                                    }}
                                >
                                    {loading ? 'Guardando...' : 'Radicar Incapacidad'}
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default IncapacityForm;
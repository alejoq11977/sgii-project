import { useEffect, useState } from 'react';
import { getReconciliation, registerPayment } from '../../../api/finance';
import { 
    Box, Typography, Grid, Paper, Button, TextField, 
    Divider, Alert, CircularProgress, Card, CardContent,
    Avatar, Stack, Chip, Fade, InputAdornment
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save';

const FinancialSummaryCard = ({ title, value, icon: Icon, color, subtitle, isHighlight }) => (
    <Card 
        elevation={0}
        sx={{ 
            height: '100%',
            border: isHighlight ? `2px solid ${color}` : '1px solid',
            borderColor: isHighlight ? color : 'divider',
            borderRadius: 3,
            background: isHighlight ? `${color}08` : 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 24px ${color}25`
            }
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: 'text.secondary',
                            fontSize: '0.7rem'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 700,
                            color: color,
                            mt: 1,
                            fontSize: { xs: '1.75rem', md: '2.5rem' }
                        }}
                    >
                        ${value?.toLocaleString()}
                    </Typography>
                </Box>
                <Avatar 
                    sx={{ 
                        bgcolor: `${color}20`,
                        width: 56,
                        height: 56
                    }}
                >
                    <Icon sx={{ color: color, fontSize: 28 }} />
                </Avatar>
            </Box>
            {subtitle && (
                <Chip 
                    label={subtitle}
                    size="small"
                    sx={{ 
                        bgcolor: `${color}20`,
                        color: color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                    }}
                />
            )}
        </CardContent>
    </Card>
);

const FinanceTab = ({ incapacityId, status }) => { 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [amount, setAmount] = useState('');
    const [refDate, setRefDate] = useState('');
    const [refNum, setRefNum] = useState('');

    useEffect(() => {
        loadReconciliation();
    }, [incapacityId]);

    const loadReconciliation = async () => {
        setLoading(true);
        try {
            const result = await getReconciliation(incapacityId);
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const canRegisterPayment = status !== 'REPORTED' && status !== 'REJECTED';

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!confirm("¿Registrar este pago?")) return;

        setSubmitting(true);
        try {
            await registerPayment({
                incapacity: incapacityId,
                amount_paid: amount,
                payment_date: refDate,
                reference_number: refNum
            });
            alert("Pago registrado exitosamente");
            setAmount(''); 
            setRefDate(''); 
            setRefNum('');
            loadReconciliation();
        } catch (error) {
            console.error(error);
            
            if (error.response && error.response.data) {
                const data = error.response.data;
                let errorMessage = "Error desconocido";

                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    const firstKey = Object.keys(data)[0];
                    errorMessage = `${firstKey}: ${data[firstKey]}`;
                }

                alert(`🛑 ${errorMessage}`);
            } else {
                alert("Error de conexión al registrar pago");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Cargando información financiera...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!data) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                No se pudo cargar la información financiera
            </Alert>
        );
    }

    const isBalanced = data.balance <= 0;
    const balanceColor = isBalanced ? '#2e7d32' : '#d32f2f';
    const balanceIcon = isBalanced ? CheckCircleIcon : ErrorIcon;

    return (
        <Fade in={true} timeout={500}>
            <Box>
                {/* RESUMEN FINANCIERO */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
                        Resumen Financiero
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <FinancialSummaryCard 
                                title="Valor Esperado"
                                value={data.expected_amount}
                                icon={TrendingUpIcon}
                                color="#1976d2"
                                subtitle="Según Ley"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FinancialSummaryCard 
                                title="Total Recibido"
                                value={data.paid_amount}
                                icon={AttachMoneyIcon}
                                color="#2e7d32"
                                subtitle="Pagos EPS"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FinancialSummaryCard 
                                title="Saldo Pendiente"
                                value={data.balance}
                                icon={balanceIcon}
                                color={balanceColor}
                                subtitle={isBalanced ? 'PAZ Y SALVO' : 'DEUDA ACTIVA'}
                                isHighlight
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* ESTADO DE CUENTA */}
                {!isBalanced && (
                    <Alert 
                        severity="warning" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: '1px solid #ed6c02'
                        }}
                        icon={<ErrorIcon />}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Atención: Saldo pendiente de ${Math.abs(data.balance).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                            La EPS debe completar el pago para cerrar esta incapacidad.
                        </Typography>
                    </Alert>
                )}

                {isBalanced && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            border: '1px solid #2e7d32'
                        }}
                        icon={<CheckCircleIcon />}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            ¡Incapacidad saldada completamente!
                        </Typography>
                        <Typography variant="body2">
                            El valor recibido cubre el monto esperado.
                        </Typography>
                    </Alert>
                )}

                <Divider sx={{ my: 3 }} />

                {/* FORMULARIO DE REGISTRO DE PAGO */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: canRegisterPayment ? 'divider' : '#ed6c02',
                        bgcolor: canRegisterPayment ? 'background.paper' : '#fff3e0',
                        opacity: canRegisterPayment ? 1 : 0.85
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptIcon sx={{ color: canRegisterPayment ? '#1976d2' : '#e65100' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: canRegisterPayment ? '#1a237e' : '#e65100' }}>
                            Registrar Nuevo Pago
                        </Typography>
                    </Box>

                    {!canRegisterPayment && (
                        <Alert 
                            severity="warning" 
                            sx={{ mb: 3, borderRadius: 2 }}
                        >
                            <Typography variant="body2">
                                <strong>Atención:</strong> No es posible registrar pagos. La incapacidad está en estado <strong>{status}</strong>.
                                Debe ser gestionada (Transcrita/Aprobada) primero.
                            </Typography>
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handlePayment}>
                        <fieldset 
                            disabled={!canRegisterPayment || submitting} 
                            style={{ border: 'none', padding: 0, margin: 0 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        fullWidth 
                                        label="Valor Pagado" 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon fontSize="small" />
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
                                <Grid item xs={12} md={3}>
                                    <TextField 
                                        fullWidth 
                                        label="Fecha de Pago" 
                                        type="date" 
                                        InputLabelProps={{ shrink: true }}
                                        value={refDate} 
                                        onChange={(e) => setRefDate(e.target.value)} 
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarTodayIcon fontSize="small" />
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
                                <Grid item xs={12} md={3}>
                                    <TextField 
                                        fullWidth 
                                        label="Número de Comprobante" 
                                        value={refNum} 
                                        onChange={(e) => setRefNum(e.target.value)} 
                                        required
                                        placeholder="Ej: COMP-2024-001"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ReceiptIcon fontSize="small" />
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
                                <Grid item xs={12} md={2}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        size="large"
                                        disabled={!canRegisterPayment || submitting}
                                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        sx={{ 
                                            height: 56,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            bgcolor: '#2e7d32',
                                            '&:hover': {
                                                bgcolor: '#1b5e20'
                                            }
                                        }}
                                    >
                                        {submitting ? 'Guardando...' : 'Registrar'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </fieldset>
                    </Box>

                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                        * Todos los campos son obligatorios. Verifique la información antes de registrar.
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
};

export default FinanceTab;
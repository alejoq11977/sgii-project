import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { 
    AppBar, Box, Toolbar, Typography, Button, IconButton, 
    Drawer, List, ListItem, ListItemIcon, ListItemText, 
    Divider, Container, Avatar, Chip, Menu, MenuItem,
    Paper, Stack, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const MainLayout = () => {
    const { logoutUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        logoutUser();
        navigate('/');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', color: '#1976d2' },
        { text: 'Reportar Incapacidad', icon: <AddCircleIcon />, path: '/incapacities/new', color: '#2e7d32' },
        { text: 'Incapacidades', icon: <DescriptionIcon />, path: '/incapacities', color: '#9c27b0' },
    ];

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const getRoleColor = (role) => {
        const colors = {
            'ADMIN': '#d32f2f',
            'RRHH': '#1976d2',
            'TREASURY': '#2e7d32',
            'EMPLOYEE': '#757575'
        };
        return colors[role] || '#757575';
    };

    const drawerWidth = 280;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            {/* AppBar Superior */}
            <AppBar 
                position="fixed" 
                elevation={0}
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(135deg,rgb(80, 103, 207) 100%, #764ba2 0%)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ 
                                mr: 1,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar 
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: 40,
                                    height: 40
                                }}
                            >
                                <LocalHospitalIcon />
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    SGII
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                                    Sistema de Gestión de Incapacidades
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        
                        {/* Botón de Perfil */}
                        <Button
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                            startIcon={
                                <Avatar 
                                    sx={{ 
                                        width: 32, 
                                        height: 32,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        fontSize: '0.875rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            }
                            sx={{
                                textTransform: 'none',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                px: 2,
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <Box sx={{ textAlign: 'left', ml: 1, display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                    {user?.username}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                                    {user?.role || 'Usuario'}
                                </Typography>
                            </Box>
                        </Button>

                        {/* Menú Desplegable Simplificado */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 2,
                                    overflow: 'visible',
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user?.username}
                                </Typography>
                                <Chip 
                                    label={user?.role || 'Usuario'}
                                    size="small"
                                    sx={{ 
                                        mt: 0.5,
                                        height: 20,
                                        fontSize: '0.7rem',
                                        bgcolor: `${getRoleColor(user?.role)}15`,
                                        color: getRoleColor(user?.role),
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                            
                            {/* Opciones eliminadas: Mi Perfil y Configuración */}
                            
                            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main', mt: 1 }}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText>Cerrar Sesión</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Drawer Lateral */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#ffffff'
                    },
                }}
            >
                <Toolbar />
                
                <Box sx={{ overflow: 'auto', p: 2 }}>
                    {/* Header del Drawer */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a237e' }}>
                            MENÚ PRINCIPAL
                        </Typography>
                        <IconButton size="small" onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Box>

                    {/* Items del Menú */}
                    <List sx={{ px: 0 }}>
                        {menuItems.map((item) => {
                            const isActive = isActiveRoute(item.path);
                            return (
                                <ListItem
                                    button
                                    key={item.text}
                                    onClick={() => {
                                        navigate(item.path);
                                        if (isMobile) toggleDrawer();
                                    }}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        bgcolor: isActive ? `${item.color}15` : 'transparent',
                                        border: isActive ? `2px solid ${item.color}40` : '2px solid transparent',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: isActive ? `${item.color}20` : `${item.color}08`,
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: isActive ? `${item.color}20` : 'transparent',
                                                width: 36,
                                                height: 36,
                                                color: isActive ? item.color : 'text.secondary'
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? item.color : 'text.primary',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Info del Usuario en el Drawer */}
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Avatar 
                                sx={{ 
                                    width: 44,
                                    height: 44,
                                    bgcolor: '#667eea',
                                    fontWeight: 700
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                                    {user?.username}
                                </Typography>
                                <Chip 
                                    label={user?.role || 'Usuario'}
                                    size="small"
                                    sx={{ 
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        bgcolor: `${getRoleColor(user?.role)}20`,
                                        color: getRoleColor(user?.role)
                                    }}
                                />
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: 'divider',
                                color: 'text.secondary',
                                '&:hover': {
                                    borderColor: 'error.main',
                                    color: 'error.main',
                                    bgcolor: 'error.lighter'
                                }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Paper>
                </Box>
            </Drawer>

            {/* Contenido Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    minHeight: '100vh',
                    bgcolor: '#f5f7fa'
                }}
            >
                <Toolbar />
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        mt: 4,
                        mb: 4,
                        px: { xs: 2, sm: 3 }
                    }}
                >
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { 
    AppBar, Box, Toolbar, Typography, Button, IconButton, 
    Drawer, List, ListItem, ListItemIcon, ListItemText, 
    Divider, Container 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';

const MainLayout = () => {
    const { logoutUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    // Opciones del menú
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Reportar Incapacidad', icon: <AddCircleIcon />, path: '/incapacities/new' },
        { text: 'Mis Incapacidades', icon: <DescriptionIcon />, path: '/incapacities' },
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Barra Superior */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SGII - Gestión de Incapacidades
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        Hola, {user?.username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Menú Lateral (Drawer) */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>

            {/* Contenido de las páginas */}
            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;
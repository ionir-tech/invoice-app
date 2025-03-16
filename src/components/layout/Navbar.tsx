import React from 'react';
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4,
    Brightness7,
    AccountCircle,
    Settings,
    ExitToApp,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { authService } from '../../services/authService';

interface NavbarProps {
    onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleTheme }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        navigate('/profile');
    };

    const handleSettings = () => {
        handleClose();
        navigate('/settings');
    };

    const handleLogout = () => {
        handleClose();
        authService.logout();
        dispatch(logout());
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Invoice System
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" onClick={onToggleTheme}>
                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        {user?.company?.logo ? (
                            <Avatar
                                alt={user.company.name}
                                src={user.company.logo}
                                sx={{ width: 32, height: 32 }}
                            />
                        ) : (
                            <AccountCircle />
                        )}
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfile}>
                            <AccountCircle sx={{ mr: 2 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleSettings}>
                            <Settings sx={{ mr: 2 }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ExitToApp sx={{ mr: 2 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 
import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useTheme,
} from '@mui/material';
import {
    Dashboard,
    Receipt,
    People,
    Inventory,
    Assessment,
    Settings,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
    { text: 'Clients', icon: <People />, path: '/clients' },
    { text: 'Products', icon: <Inventory />, path: '/products' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.default,
                    borderRight: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.action.selected,
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: theme.palette.action.selected,
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: location.pathname === item.path
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: location.pathname === item.path
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                            fontWeight: location.pathname === item.path
                                                ? 600
                                                : 400,
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 
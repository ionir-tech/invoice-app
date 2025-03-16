import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { selectAllClients } from '../../features/clients/clientSlice';
import { formatCurrency } from '../../utils/formatters';

const ClientList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clients = useSelector(selectAllClients);
    const [searchTerm, setSearchTerm] = React.useState('');

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Client Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'totalBilled',
            headerName: 'Total Billed',
            width: 130,
            valueFormatter: (params) => formatCurrency(params.value),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/clients/${params.row.id}`)}
                        >
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/clients/${params.row.id}/edit`)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                        <IconButton
                            size="small"
                            onClick={() => handleSendEmail(params.row.id)}
                        >
                            <EmailIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    const handleSendEmail = async (clientId: string) => {
        // Implementation will be added later
    };

    const handleDelete = async (clientId: string) => {
        // Implementation will be added later
    };

    const filteredClients = React.useMemo(() => {
        if (!searchTerm) return clients;
        const lowerSearch = searchTerm.toLowerCase();
        return clients.filter(
            (client) =>
                client.name.toLowerCase().includes(lowerSearch) ||
                client.email.toLowerCase().includes(lowerSearch) ||
                client.phone?.toLowerCase().includes(lowerSearch)
        );
    }, [clients, searchTerm]);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Clients
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/clients/new')}
                >
                    Add Client
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                    </Box>

                    <DataGrid
                        rows={filteredClients}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        checkboxSelection
                        disableSelectionOnClick
                        autoHeight
                        sx={{
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClientList; 
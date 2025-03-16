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
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { selectAllProducts } from '../../features/products/productSlice';
import { formatCurrency } from '../../utils/formatters';

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const [searchTerm, setSearchTerm] = React.useState('');

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Product Name', width: 250 },
        { field: 'sku', headerName: 'SKU', width: 120 },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            valueFormatter: (params) => formatCurrency(params.value),
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'PRODUCT' ? 'primary' : 'secondary'}
                    size="small"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
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
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/products/${params.row.id}`)}
                        >
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/products/${params.row.id}/edit`)}
                        >
                            <EditIcon />
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

    const handleDelete = async (productId: string) => {
        // Implementation will be added later
    };

    const filteredProducts = React.useMemo(() => {
        if (!searchTerm) return products;
        const lowerSearch = searchTerm.toLowerCase();
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(lowerSearch) ||
                product.sku?.toLowerCase().includes(lowerSearch) ||
                product.description?.toLowerCase().includes(lowerSearch)
        );
    }, [products, searchTerm]);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Products & Services
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/products/new')}
                >
                    Add Product
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                    </Box>

                    <DataGrid
                        rows={filteredProducts}
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

export default ProductList; 
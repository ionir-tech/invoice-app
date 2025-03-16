import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import {
    Edit as EditIcon,
    LocalOffer as PriceIcon,
    Inventory as InventoryIcon,
    Category as TypeIcon,
} from '@mui/icons-material';
import { selectProductById } from '../../features/products/productSlice';
import { selectInvoicesByProduct } from '../../features/invoices/invoiceSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = useSelector((state) => id ? selectProductById(state, id) : null);
    const invoices = useSelector((state) => id ? selectInvoicesByProduct(state, id) : []);

    if (!product) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography>Product not found</Typography>
            </Box>
        );
    }

    const totalRevenue = invoices.reduce((sum, invoice) => {
        const productItems = invoice.items.filter(item => item.productId === id);
        return sum + productItems.reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0);
    }, 0);

    const totalQuantitySold = invoices.reduce((sum, invoice) => {
        const productItems = invoice.items.filter(item => item.productId === id);
        return sum + productItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {product.name}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/products/${id}/edit`)}
                >
                    Edit Product
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PriceIcon sx={{ mr: 1 }} />
                                        <Typography>
                                            Price: {formatCurrency(product.price)}
                                        </Typography>
                                    </Box>
                                    {product.sku && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <InventoryIcon sx={{ mr: 1 }} />
                                            <Typography>SKU: {product.sku}</Typography>
                                        </Box>
                                    )}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TypeIcon sx={{ mr: 1 }} />
                                        <Typography>Type: {product.type}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip
                                            label={product.status}
                                            color={product.status === 'ACTIVE' ? 'success' : 'default'}
                                            sx={{ mb: 2 }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {product.description && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                        {product.description}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Usage History
                            </Typography>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Invoice #</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Client</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoices.map((invoice) => {
                                            const productItems = invoice.items.filter(
                                                item => item.productId === id
                                            );
                                            return productItems.map((item) => (
                                                <TableRow
                                                    key={`${invoice.id}-${item.id}`}
                                                    hover
                                                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell>{invoice.invoiceNumber}</TableCell>
                                                    <TableCell>
                                                        {formatDate(invoice.invoiceDate)}
                                                    </TableCell>
                                                    <TableCell>{invoice.client.name}</TableCell>
                                                    <TableCell align="right">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(item.quantity * item.price)}
                                                    </TableCell>
                                                </TableRow>
                                            ));
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Statistics
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Revenue
                                </Typography>
                                <Typography variant="h5">
                                    {formatCurrency(totalRevenue)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Quantity Sold
                                </Typography>
                                <Typography variant="h5">
                                    {totalQuantitySold}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetail; 
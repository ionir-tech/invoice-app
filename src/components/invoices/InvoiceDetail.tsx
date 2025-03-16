import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
    Receipt as ReceiptIcon,
    Payment as PaymentIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { selectInvoiceById } from '../../features/invoices/invoiceSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const invoice = useSelector((state) => id ? selectInvoiceById(state, id) : null);

    if (!invoice) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography>Invoice not found</Typography>
            </Box>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'OVERDUE':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleDownloadPDF = async () => {
        // Implementation will be added later
    };

    const handleSendEmail = async () => {
        // Implementation will be added later
    };

    const handleRecordPayment = () => {
        navigate(`/invoices/${id}/payment`);
    };

    const calculateTotal = () => {
        return invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const calculatePaidAmount = () => {
        return invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    };

    const calculateBalance = () => {
        return calculateTotal() - calculatePaidAmount();
    };

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Invoice #{invoice.invoiceNumber}
                    </Typography>
                    <Chip
                        label={invoice.status}
                        color={getStatusColor(invoice.status)}
                        sx={{ mr: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<SendIcon />}
                        onClick={handleSendEmail}
                    >
                        Send Email
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ReceiptIcon />}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PaymentIcon />}
                        onClick={handleRecordPayment}
                        disabled={invoice.status === 'PAID'}
                    >
                        Record Payment
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/invoices/${id}/edit`)}
                    >
                        Edit Invoice
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Bill To
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {invoice.client.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {invoice.client.email}
                                    </Typography>
                                    {invoice.client.phone && (
                                        <Typography variant="body2" color="textSecondary">
                                            {invoice.client.phone}
                                        </Typography>
                                    )}
                                    {invoice.client.address && (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ whiteSpace: 'pre-line', mt: 1 }}
                                        >
                                            {invoice.client.address}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Invoice Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {formatDate(invoice.invoiceDate)}
                                        </Typography>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Due Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(invoice.dueDate)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Items
                            </Typography>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Typography variant="body1">
                                                        {item.product.name}
                                                    </Typography>
                                                    {item.product.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            {item.product.description}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(item.price)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(item.quantity * item.price)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={3} align="right">
                                                <Typography variant="subtitle1">Total:</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle1">
                                                    {formatCurrency(calculateTotal())}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {invoice.notes && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Notes
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                        {invoice.notes}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Payment Summary
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Amount
                                </Typography>
                                <Typography variant="h5">
                                    {formatCurrency(calculateTotal())}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Amount Paid
                                </Typography>
                                <Typography variant="h5" color="success.main">
                                    {formatCurrency(calculatePaidAmount())}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Balance Due
                                </Typography>
                                <Typography variant="h5" color="error.main">
                                    {formatCurrency(calculateBalance())}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {invoice.payments && invoice.payments.length > 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Payment History
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoice.payments.map((payment, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {formatDate(payment.date)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(payment.amount)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvoiceDetail; 
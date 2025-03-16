import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { selectAllPayments } from '../../features/payments/paymentSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentHistory: React.FC = () => {
    const navigate = useNavigate();
    const payments = useSelector(selectAllPayments);
    const [searchTerm, setSearchTerm] = React.useState('');

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'CREDIT_CARD':
                return 'primary';
            case 'BANK_TRANSFER':
                return 'secondary';
            case 'CASH':
                return 'success';
            case 'CHECK':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getMethodLabel = (method: string) => {
        return method.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const filteredPayments = React.useMemo(() => {
        if (!searchTerm) return payments;
        const lowerSearch = searchTerm.toLowerCase();
        return payments.filter(
            (payment) =>
                payment.invoice.invoiceNumber.toLowerCase().includes(lowerSearch) ||
                payment.invoice.client.name.toLowerCase().includes(lowerSearch) ||
                payment.reference?.toLowerCase().includes(lowerSearch)
        );
    }, [payments, searchTerm]);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Payment History
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search payments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Invoice #</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Method</TableCell>
                                    <TableCell>Reference</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow
                                        key={payment.id}
                                        hover
                                        onClick={() => navigate(`/invoices/${payment.invoice.id}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            {formatDate(payment.date)}
                                        </TableCell>
                                        <TableCell>
                                            #{payment.invoice.invoiceNumber}
                                        </TableCell>
                                        <TableCell>
                                            {payment.invoice.client.name}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getMethodLabel(payment.method)}
                                                color={getMethodColor(payment.method)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {payment.reference || '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(payment.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="textSecondary">
                                                No payments found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentHistory; 
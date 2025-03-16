import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    IconButton,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { selectInvoices } from '../../features/invoices/invoiceSlice';
import { selectPayments } from '../../features/payments/paymentSlice';
import { selectClients } from '../../features/clients/clientSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MetricsCard } from './MetricsCard';
import { RevenueChart } from './RevenueChart';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const recentInvoices = useSelector(selectInvoices);
    const recentPayments = useSelector(selectPayments);
    const clients = useSelector(selectClients);

    const calculateMetrics = () => {
        const totalRevenue = recentInvoices.reduce((sum, invoice) =>
            sum + invoice.items.reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0), 0);

        const totalPaid = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);

        const totalOutstanding = recentInvoices.reduce((sum, invoice) => {
            const invoiceTotal = invoice.items.reduce((itemSum, item) => itemSum + (item.quantity * item.price), 0);
            const paidAmount = invoice.payments?.reduce((paymentSum, payment) => paymentSum + payment.amount, 0) || 0;
            return sum + (invoiceTotal - paidAmount);
        }, 0);

        return {
            totalRevenue,
            totalPaid,
            totalOutstanding,
            totalClients: clients.length,
        };
    };

    const metrics = calculateMetrics();

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Metrics Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Total Revenue"
                        value={formatCurrency(metrics.totalRevenue)}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Total Paid"
                        value={formatCurrency(metrics.totalPaid)}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Outstanding"
                        value={formatCurrency(metrics.totalOutstanding)}
                        color="error"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricsCard
                        title="Active Clients"
                        value={metrics.totalClients.toString()}
                        color="info"
                    />
                </Grid>

                {/* Revenue Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Revenue Overview
                            </Typography>
                            <RevenueChart />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Invoices */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Recent Invoices
                                </Typography>
                                <IconButton size="small" onClick={() => navigate('/invoices')}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Invoice #</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentInvoices.slice(0, 5).map((invoice) => (
                                        <TableRow
                                            key={invoice.id}
                                            hover
                                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>#{invoice.invoiceNumber}</TableCell>
                                            <TableCell>{invoice.client.name}</TableCell>
                                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(
                                                    invoice.items.reduce((sum, item) =>
                                                        sum + (item.quantity * item.price), 0)
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Payments */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Recent Payments
                                </Typography>
                                <IconButton size="small" onClick={() => navigate('/payments')}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Method</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentPayments.slice(0, 5).map((payment) => (
                                        <TableRow
                                            key={payment.id}
                                            hover
                                            onClick={() => navigate(`/invoices/${payment.invoice.id}`)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{formatDate(payment.date)}</TableCell>
                                            <TableCell>{payment.invoice.client.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.method}
                                                    size="small"
                                                    color={payment.method === 'CREDIT_CARD' ? 'primary' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 
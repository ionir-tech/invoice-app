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
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { selectClientById } from '../../features/clients/clientSlice';
import { selectInvoicesByClient } from '../../features/invoices/invoiceSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ClientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const client = useSelector((state) => id ? selectClientById(state, id) : null);
    const invoices = useSelector((state) => id ? selectInvoicesByClient(state, id) : []);

    if (!client) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography>Client not found</Typography>
            </Box>
        );
    }

    const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalPaid = invoices.reduce(
        (sum, invoice) =>
            sum + (invoice.payments || []).reduce((pSum, payment) => pSum + payment.amount, 0),
        0
    );
    const totalOutstanding = totalBilled - totalPaid;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {client.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        onClick={() => window.location.href = `mailto:${client.email}`}
                    >
                        Send Email
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/clients/${id}/edit`)}
                    >
                        Edit Client
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <EmailIcon sx={{ mr: 1 }} />
                                        <Typography>{client.email}</Typography>
                                    </Box>
                                    {client.phone && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PhoneIcon sx={{ mr: 1 }} />
                                            <Typography>{client.phone}</Typography>
                                        </Box>
                                    )}
                                    {client.company && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <BusinessIcon sx={{ mr: 1 }} />
                                            <Typography>{client.company}</Typography>
                                        </Box>
                                    )}
                                    {client.address && (
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                            <LocationIcon sx={{ mr: 1, mt: 0.5 }} />
                                            <Typography sx={{ whiteSpace: 'pre-line' }}>
                                                {client.address}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip
                                            label={client.status}
                                            color={client.status === 'ACTIVE' ? 'success' : 'default'}
                                            sx={{ mb: 2 }}
                                        />
                                        {client.taxId && (
                                            <Typography variant="body2" color="textSecondary">
                                                Tax ID: {client.taxId}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                            {client.notes && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Notes
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                        {client.notes}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Invoices</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/invoices/new', { state: { clientId: id } })}
                                >
                                    Create Invoice
                                </Button>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Invoice #</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Due Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow
                                                key={invoice.id}
                                                hover
                                                onClick={() => navigate(`/invoices/${invoice.id}`)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                                <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(invoice.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={invoice.status}
                                                        color={
                                                            invoice.status === 'PAID'
                                                                ? 'success'
                                                                : invoice.status === 'PENDING'
                                                                    ? 'warning'
                                                                    : 'error'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                                            </TableRow>
                                        ))}
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
                                Financial Summary
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Billed
                                </Typography>
                                <Typography variant="h5">
                                    {formatCurrency(totalBilled)}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Paid
                                </Typography>
                                <Typography variant="h5" color="success.main">
                                    {formatCurrency(totalPaid)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Outstanding Balance
                                </Typography>
                                <Typography variant="h5" color="error.main">
                                    {formatCurrency(totalOutstanding)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ClientDetail; 
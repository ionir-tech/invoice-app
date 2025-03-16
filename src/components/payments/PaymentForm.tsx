import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    MenuItem,
} from '@mui/material';
import { addPayment } from '../../features/payments/paymentSlice';
import { selectInvoiceById } from '../../features/invoices/invoiceSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const validationSchema = yup.object({
    amount: yup
        .number()
        .required('Amount is required')
        .min(0.01, 'Amount must be greater than 0'),
    date: yup.date().required('Payment date is required'),
    method: yup.string().required('Payment method is required'),
    reference: yup.string(),
    notes: yup.string(),
});

const paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' },
    { value: 'CHECK', label: 'Check' },
    { value: 'OTHER', label: 'Other' },
];

const PaymentForm: React.FC = () => {
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

    const calculateBalance = () => {
        const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const paid = invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
        return total - paid;
    };

    const formik = useFormik({
        initialValues: {
            amount: calculateBalance(),
            date: new Date().toISOString().split('T')[0],
            method: 'CREDIT_CARD',
            reference: '',
            notes: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(addPayment({ invoiceId: id, ...values }));
                navigate(`/invoices/${id}`);
            } catch (error) {
                console.error('Failed to record payment:', error);
            }
        },
    });

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Record Payment
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <form onSubmit={formik.handleSubmit}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="amount"
                                            label="Payment Amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                            InputProps={{
                                                startAdornment: '$',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            name="date"
                                            label="Payment Date"
                                            value={formik.values.date}
                                            onChange={formik.handleChange}
                                            error={formik.touched.date && Boolean(formik.errors.date)}
                                            helperText={formik.touched.date && formik.errors.date}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            name="method"
                                            label="Payment Method"
                                            value={formik.values.method}
                                            onChange={formik.handleChange}
                                            error={formik.touched.method && Boolean(formik.errors.method)}
                                            helperText={formik.touched.method && formik.errors.method}
                                        >
                                            {paymentMethods.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            name="reference"
                                            label="Reference Number"
                                            value={formik.values.reference}
                                            onChange={formik.handleChange}
                                            error={formik.touched.reference && Boolean(formik.errors.reference)}
                                            helperText={formik.touched.reference && formik.errors.reference}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            name="notes"
                                            label="Notes"
                                            value={formik.values.notes}
                                            onChange={formik.handleChange}
                                            error={formik.touched.notes && Boolean(formik.errors.notes)}
                                            helperText={formik.touched.notes && formik.errors.notes}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/invoices/${id}`)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={formik.isSubmitting}
                            >
                                Record Payment
                            </Button>
                        </Box>
                    </form>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Invoice Summary
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Invoice Number
                                </Typography>
                                <Typography variant="body1">
                                    #{invoice.invoiceNumber}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Client
                                </Typography>
                                <Typography variant="body1">
                                    {invoice.client.name}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Due Date
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(invoice.dueDate)}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Balance Due
                                </Typography>
                                <Typography variant="h5" color="error.main">
                                    {formatCurrency(calculateBalance())}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PaymentForm; 
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
import { addClient, updateClient, selectClientById } from '../../features/clients/clientSlice';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    phone: yup.string(),
    company: yup.string(),
    address: yup.string(),
    taxId: yup.string(),
    notes: yup.string(),
    status: yup.string().required('Status is required'),
});

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

const ClientForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const existingClient = useSelector((state) => id ? selectClientById(state, id) : null);

    const formik = useFormik({
        initialValues: {
            name: existingClient?.name || '',
            email: existingClient?.email || '',
            phone: existingClient?.phone || '',
            company: existingClient?.company || '',
            address: existingClient?.address || '',
            taxId: existingClient?.taxId || '',
            notes: existingClient?.notes || '',
            status: existingClient?.status || 'ACTIVE',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (id) {
                    await dispatch(updateClient({ id, ...values }));
                } else {
                    await dispatch(addClient(values));
                }
                navigate('/clients');
            } catch (error) {
                console.error('Failed to save client:', error);
            }
        },
    });

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {id ? 'Edit Client' : 'Add Client'}
                </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Client Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email Address"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    label="Phone Number"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="company"
                                    label="Company Name"
                                    value={formik.values.company}
                                    onChange={formik.handleChange}
                                    error={formik.touched.company && Boolean(formik.errors.company)}
                                    helperText={formik.touched.company && formik.errors.company}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    name="address"
                                    label="Address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="taxId"
                                    label="Tax ID / VAT Number"
                                    value={formik.values.taxId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.taxId && Boolean(formik.errors.taxId)}
                                    helperText={formik.touched.taxId && formik.errors.taxId}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    name="status"
                                    label="Status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    helperText={formik.touched.status && formik.errors.status}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                        onClick={() => navigate('/clients')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                    >
                        {id ? 'Update Client' : 'Add Client'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ClientForm; 
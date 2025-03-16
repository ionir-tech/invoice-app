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
import { addProduct, updateProduct, selectProductById } from '../../features/products/productSlice';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    sku: yup.string(),
    price: yup
        .number()
        .required('Price is required')
        .min(0, 'Price must be greater than or equal to 0'),
    description: yup.string(),
    type: yup.string().required('Type is required'),
    status: yup.string().required('Status is required'),
});

const typeOptions = [
    { value: 'PRODUCT', label: 'Product' },
    { value: 'SERVICE', label: 'Service' },
];

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const existingProduct = useSelector((state) => id ? selectProductById(state, id) : null);

    const formik = useFormik({
        initialValues: {
            name: existingProduct?.name || '',
            sku: existingProduct?.sku || '',
            price: existingProduct?.price || '',
            description: existingProduct?.description || '',
            type: existingProduct?.type || 'PRODUCT',
            status: existingProduct?.status || 'ACTIVE',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (id) {
                    await dispatch(updateProduct({ id, ...values }));
                } else {
                    await dispatch(addProduct(values));
                }
                navigate('/products');
            } catch (error) {
                console.error('Failed to save product:', error);
            }
        },
    });

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {id ? 'Edit Product' : 'Add Product'}
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
                                    label="Product Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="sku"
                                    label="SKU"
                                    value={formik.values.sku}
                                    onChange={formik.handleChange}
                                    error={formik.touched.sku && Boolean(formik.errors.sku)}
                                    helperText={formik.touched.sku && formik.errors.sku}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    InputProps={{
                                        startAdornment: '$',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    name="type"
                                    label="Type"
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                    helperText={formik.touched.type && formik.errors.type}
                                >
                                    {typeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                    name="description"
                                    label="Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/products')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                    >
                        {id ? 'Update Product' : 'Add Product'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ProductForm; 
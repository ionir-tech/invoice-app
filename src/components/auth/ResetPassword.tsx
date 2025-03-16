import React from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Button,
    Container,
    Link,
    TextField,
    Typography,
    Alert,
    Paper,
} from '@mui/material';
import { authService } from '../../services/authService';

const validationSchema = yup.object({
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setError(null);
                if (!token) {
                    setError('Invalid reset token');
                    return;
                }
                await authService.resetPassword(token, values.password);
                setSuccess('Your password has been successfully reset.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    'An error occurred while resetting your password'
                );
            }
        },
    });

    if (!token) {
        return (
            <Container component="main" maxWidth="xs">
                <Box sx={{ mt: 8 }}>
                    <Alert severity="error">Invalid reset token</Alert>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link component={RouterLink} to="/forgot-password" variant="body2">
                            Request a new password reset
                        </Link>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                            {success}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ mt: 3, width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            fullWidth
                            id="password"
                            name="password"
                            label="New Password"
                            type="password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.confirmPassword &&
                                Boolean(formik.errors.confirmPassword)
                            }
                            helperText={
                                formik.touched.confirmPassword && formik.errors.confirmPassword
                            }
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={formik.isSubmitting}
                        >
                            Reset Password
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Back to Sign In
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ResetPassword; 
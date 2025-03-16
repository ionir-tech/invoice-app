import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Payment } from './paymentSlice';

const API_URL = '/api/payments';

// Fetch all payments
export const fetchPayments = createAsyncThunk(
    'payments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Payment[]>(API_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
);

// Fetch a single payment by ID
export const fetchPaymentById = createAsyncThunk(
    'payments/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<Payment>(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
        }
    }
);

// Create a new payment
export const createPayment = createAsyncThunk(
    'payments/create',
    async (payment: Omit<Payment, 'id'>, { rejectWithValue }) => {
        try {
            const response = await axios.post<Payment>(API_URL, payment);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
        }
    }
);

// Update an existing payment
export const updatePayment = createAsyncThunk(
    'payments/update',
    async (payment: Payment, { rejectWithValue }) => {
        try {
            const response = await axios.put<Payment>(`${API_URL}/${payment.id}`, payment);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update payment');
        }
    }
);

// Delete a payment
export const deletePayment = createAsyncThunk(
    'payments/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
        }
    }
);

// Fetch payments by invoice ID
export const fetchPaymentsByInvoice = createAsyncThunk(
    'payments/fetchByInvoice',
    async (invoiceId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<Payment[]>(`${API_URL}/invoice/${invoiceId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments for invoice');
        }
    }
); 
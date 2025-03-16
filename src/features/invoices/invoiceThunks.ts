import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Invoice } from './invoiceSlice';

const API_URL = '/api/invoices';

// Fetch all invoices
export const fetchInvoices = createAsyncThunk(
    'invoices/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Invoice[]>(API_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
        }
    }
);

// Fetch a single invoice by ID
export const fetchInvoiceById = createAsyncThunk(
    'invoices/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<Invoice>(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice');
        }
    }
);

// Create a new invoice
export const createInvoice = createAsyncThunk(
    'invoices/create',
    async (invoice: Omit<Invoice, 'id'>, { rejectWithValue }) => {
        try {
            const response = await axios.post<Invoice>(API_URL, invoice);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
        }
    }
);

// Update an existing invoice
export const updateInvoice = createAsyncThunk(
    'invoices/update',
    async (invoice: Invoice, { rejectWithValue }) => {
        try {
            const response = await axios.put<Invoice>(`${API_URL}/${invoice.id}`, invoice);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update invoice');
        }
    }
);

// Delete an invoice
export const deleteInvoice = createAsyncThunk(
    'invoices/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice');
        }
    }
);

// Update invoice status
export const updateInvoiceStatus = createAsyncThunk(
    'invoices/updateStatus',
    async ({ id, status }: { id: string; status: Invoice['status'] }, { rejectWithValue }) => {
        try {
            const response = await axios.patch<Invoice>(`${API_URL}/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update invoice status');
        }
    }
);

// Generate invoice PDF
export const generateInvoicePdf = createAsyncThunk(
    'invoices/generatePdf',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/pdf`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate PDF');
        }
    }
); 
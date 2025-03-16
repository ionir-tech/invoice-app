import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Client } from './clientSlice';

const API_URL = '/api/clients';

// Fetch all clients
export const fetchClients = createAsyncThunk(
    'clients/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Client[]>(API_URL);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
        }
    }
);

// Fetch a single client by ID
export const fetchClientById = createAsyncThunk(
    'clients/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<Client>(`${API_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
        }
    }
);

// Create a new client
export const createClient = createAsyncThunk(
    'clients/create',
    async (client: Omit<Client, 'id'>, { rejectWithValue }) => {
        try {
            const response = await axios.post<Client>(API_URL, client);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create client');
        }
    }
);

// Update an existing client
export const updateClient = createAsyncThunk(
    'clients/update',
    async (client: Client, { rejectWithValue }) => {
        try {
            const response = await axios.put<Client>(`${API_URL}/${client.id}`, client);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update client');
        }
    }
);

// Delete a client
export const deleteClient = createAsyncThunk(
    'clients/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
        }
    }
);

// Fetch client's invoices
export const fetchClientInvoices = createAsyncThunk(
    'clients/fetchInvoices',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/invoices`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client invoices');
        }
    }
);

// Fetch client's payment history
export const fetchClientPayments = createAsyncThunk(
    'clients/fetchPayments',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/payments`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client payments');
        }
    }
);

export const searchClients = createAsyncThunk(
    'clients/search',
    async (query: string, { rejectWithValue }) => {
        try {
            return await clientService.search(query);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search clients');
        }
    }
);

export const updateClientStatus = createAsyncThunk(
    'clients/updateStatus',
    async ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }, { rejectWithValue }) => {
        try {
            return await clientService.updateStatus(id, status);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update client status');
        }
    }
); 
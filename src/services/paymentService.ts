import api from './api';
import { Payment } from '../features/payments/paymentSlice';

export const paymentService = {
    getAll: async () => {
        const response = await api.get<Payment[]>('/payments');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Payment>(`/payments/${id}`);
        return response.data;
    },

    create: async (payment: Omit<Payment, 'id'>) => {
        const response = await api.post<Payment>('/payments', payment);
        return response.data;
    },

    update: async (id: string, payment: Partial<Payment>) => {
        const response = await api.put<Payment>(`/payments/${id}`, payment);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/payments/${id}`);
    },

    getByInvoiceId: async (invoiceId: string) => {
        const response = await api.get<Payment[]>(`/payments/invoice/${invoiceId}`);
        return response.data;
    },

    getByClientId: async (clientId: string) => {
        const response = await api.get<Payment[]>(`/payments/client/${clientId}`);
        return response.data;
    },
}; 
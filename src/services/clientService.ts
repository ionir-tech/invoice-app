import api from './api';
import { Client } from '../features/clients/clientSlice';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  notes?: string;
  currency?: string;
  paymentTerms?: number;
  customFields?: Array<{
    key: string;
    value: string;
  }>;
}

interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}

interface ClientFilters {
  search?: string;
  company?: string;
  country?: string;
  hasOverdueInvoices?: boolean;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const clientService = {
  getAll: async () => {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (client: Omit<Client, 'id'>) => {
    const response = await api.post<Client>('/clients', client);
    return response.data;
  },

  update: async (id: string, client: Partial<Client>) => {
    const response = await api.put<Client>(`/clients/${id}`, client);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/clients/${id}`);
  },

  search: async (query: string) => {
    const response = await api.get<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  updateStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    const response = await api.patch<Client>(`/clients/${id}/status`, { status });
    return response.data;
  },

  async getClients(filters: ClientFilters, pagination: PaginationOptions) {
    const params = {
      ...(filters.search && { search: filters.search }),
      ...(filters.company && { company: filters.company }),
      ...(filters.country && { country: filters.country }),
      ...(filters.hasOverdueInvoices !== undefined && { 
        hasOverdueInvoices: filters.hasOverdueInvoices.toString() 
      }),
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.sortBy && { sortBy: pagination.sortBy }),
      ...(pagination.sortOrder && { sortOrder: pagination.sortOrder }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/clients?${queryString}`);
    return response.data;
  },

  async getClientStatistics(id: string) {
    const response = await api.get(`/clients/${id}/statistics`);
    return response.data;
  },

  async getClientInvoices(id: string, filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const params = {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/clients/${id}/invoices?${queryString}`);
    return response.data;
  },

  async importClients(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/clients/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async exportClients(filters: ClientFilters) {
    const params = {
      ...(filters.search && { search: filters.search }),
      ...(filters.company && { company: filters.company }),
      ...(filters.country && { country: filters.country }),
      ...(filters.hasOverdueInvoices !== undefined && { 
        hasOverdueInvoices: filters.hasOverdueInvoices.toString() 
      }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/clients/export?${queryString}`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 
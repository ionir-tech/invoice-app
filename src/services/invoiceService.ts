import api from './api';
import { Invoice } from '../features/invoices/invoiceSlice';

interface InvoiceItem {
  product: string;
  quantity: number;
  price: number;
  description?: string;
  taxRate: number;
}

interface CreateInvoiceData {
  client: string;
  items: InvoiceItem[];
  dueDate: Date;
  notes?: string;
  terms?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  customFields?: Array<{
    key: string;
    value: string;
  }>;
}

interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  id: string;
}

interface InvoiceFilters {
  status?: string;
  client?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const invoiceService = {
  getAll: async () => {
    const response = await api.get<Invoice[]>('/invoices');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (invoice: Omit<Invoice, 'id'>) => {
    const response = await api.post<Invoice>('/invoices', invoice);
    return response.data;
  },

  update: async (id: string, invoice: Partial<Invoice>) => {
    const response = await api.put<Invoice>(`/invoices/${id}`, invoice);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  },

  getByClientId: async (clientId: string) => {
    const response = await api.get<Invoice[]>(`/invoices/client/${clientId}`);
    return response.data;
  },

  markAsPaid: async (id: string) => {
    const response = await api.patch<Invoice>(`/invoices/${id}/paid`);
    return response.data;
  },

  markAsOverdue: async (id: string) => {
    const response = await api.patch<Invoice>(`/invoices/${id}/overdue`);
    return response.data;
  },

  async getInvoices(filters: InvoiceFilters, pagination: PaginationOptions) {
    const params = {
      ...(filters.status && { status: filters.status }),
      ...(filters.client && { client: filters.client }),
      ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters.minAmount && { minAmount: filters.minAmount.toString() }),
      ...(filters.maxAmount && { maxAmount: filters.maxAmount.toString() }),
      ...(filters.search && { search: filters.search }),
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.sortBy && { sortBy: pagination.sortBy }),
      ...(pagination.sortOrder && { sortOrder: pagination.sortOrder }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/invoices?${queryString}`);
    return response.data;
  },

  async generatePDF(id: string) {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async sendInvoice(id: string, emailData: { to: string; message?: string }) {
    const response = await api.post(`/invoices/${id}/send`, emailData);
    return response.data;
  },

  async recordPayment(id: string, paymentData: {
    amount: number;
    date: Date;
    method: string;
    reference?: string;
    notes?: string;
  }) {
    const response = await api.post(`/invoices/${id}/payments`, paymentData);
    return response.data;
  },

  async getInvoiceStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
    client?: string;
  }) {
    const params = {
      ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters?.client && { client: filters.client }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/invoices/statistics?${queryString}`);
    return response.data;
  },

  async downloadInvoices(filters: InvoiceFilters) {
    const params = {
      ...(filters.status && { status: filters.status }),
      ...(filters.client && { client: filters.client }),
      ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters.minAmount && { minAmount: filters.minAmount.toString() }),
      ...(filters.maxAmount && { maxAmount: filters.maxAmount.toString() }),
      ...(filters.search && { search: filters.search }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/invoices/download?${queryString}`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 
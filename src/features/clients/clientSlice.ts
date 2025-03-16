import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    fetchClientInvoices,
    fetchClientPayments
} from './clientThunks';
import { Invoice } from '../invoices/invoiceSlice';
import { Payment } from '../payments/paymentSlice';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    company?: {
        name: string;
        taxId?: string;
        registrationNumber?: string;
    };
    notes?: string;
    createdAt: string;
    updatedAt: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    creditLimit?: number;
    paymentTerms?: number; // Days
    currency: string;
    tags?: string[];
}

interface ClientsState {
    items: Client[];
    selectedClient: Client | null;
    selectedClientInvoices: Invoice[];
    selectedClientPayments: Payment[];
    loading: boolean;
    error: string | null;
    filters: {
        status: Client['status'] | null;
        search: string | null;
        tags: string[];
    };
    sort: {
        field: keyof Client | null;
        direction: 'asc' | 'desc';
    };
}

const initialState: ClientsState = {
    items: [],
    selectedClient: null,
    selectedClientInvoices: [],
    selectedClientPayments: [],
    loading: false,
    error: null,
    filters: {
        status: null,
        search: null,
        tags: []
    },
    sort: {
        field: null,
        direction: 'asc'
    }
};

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedClient: (state) => {
            state.selectedClient = null;
            state.selectedClientInvoices = [];
            state.selectedClientPayments = [];
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setSortOrder: (state, action) => {
            state.sort = action.payload;
        },
        addTag: (state, action) => {
            if (!state.filters.tags.includes(action.payload)) {
                state.filters.tags.push(action.payload);
            }
        },
        removeTag: (state, action) => {
            state.filters.tags = state.filters.tags.filter(tag => tag !== action.payload);
        }
    },
    extraReducers: (builder) => {
        // Fetch all clients
        builder.addCase(fetchClients.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchClients.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchClients.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch single client
        builder.addCase(fetchClientById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchClientById.fulfilled, (state, action) => {
            state.selectedClient = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchClientById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create client
        builder.addCase(createClient.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createClient.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.loading = false;
        });
        builder.addCase(createClient.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update client
        builder.addCase(updateClient.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateClient.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedClient?.id === action.payload.id) {
                state.selectedClient = action.payload;
            }
            state.loading = false;
        });
        builder.addCase(updateClient.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete client
        builder.addCase(deleteClient.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteClient.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            if (state.selectedClient?.id === action.payload) {
                state.selectedClient = null;
            }
            state.loading = false;
        });
        builder.addCase(deleteClient.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch client invoices
        builder.addCase(fetchClientInvoices.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchClientInvoices.fulfilled, (state, action) => {
            state.selectedClientInvoices = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchClientInvoices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch client payments
        builder.addCase(fetchClientPayments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchClientPayments.fulfilled, (state, action) => {
            state.selectedClientPayments = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchClientPayments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const {
    clearError,
    clearSelectedClient,
    setFilters,
    clearFilters,
    setSortOrder,
    addTag,
    removeTag
} = clientSlice.actions;

// Basic selectors
export const selectClients = (state: RootState) => state.clients.items;
export const selectSelectedClient = (state: RootState) => state.clients.selectedClient;
export const selectSelectedClientInvoices = (state: RootState) => state.clients.selectedClientInvoices;
export const selectSelectedClientPayments = (state: RootState) => state.clients.selectedClientPayments;
export const selectClientsLoading = (state: RootState) => state.clients.loading;
export const selectClientsError = (state: RootState) => state.clients.error;
export const selectClientsFilters = (state: RootState) => state.clients.filters;
export const selectClientsSort = (state: RootState) => state.clients.sort;

// Filtered and sorted selectors
export const selectFilteredClients = (state: RootState) => {
    let filtered = state.clients.items;
    const { status, search, tags } = state.clients.filters;

    if (status) {
        filtered = filtered.filter(client => client.status === status);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(client =>
            client.name.toLowerCase().includes(searchLower) ||
            client.email.toLowerCase().includes(searchLower) ||
            client.company?.name.toLowerCase().includes(searchLower)
        );
    }

    if (tags.length > 0) {
        filtered = filtered.filter(client =>
            client.tags?.some(tag => tags.includes(tag))
        );
    }

    const { field, direction } = state.clients.sort;
    if (field) {
        filtered.sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });
    }

    return filtered;
};

// Analytics selectors
export const selectClientAnalytics = (state: RootState) => {
    const analytics = {
        totalClients: state.clients.items.length,
        activeClients: 0,
        inactiveClients: 0,
        blockedClients: 0,
        averageCreditLimit: 0,
        totalCreditLimit: 0,
        clientsByCountry: {} as Record<string, number>,
        clientsByStatus: {
            ACTIVE: 0,
            INACTIVE: 0,
            BLOCKED: 0
        }
    };

    let clientsWithCreditLimit = 0;

    state.clients.items.forEach(client => {
        // Status counts
        analytics.clientsByStatus[client.status]++;
        switch (client.status) {
            case 'ACTIVE':
                analytics.activeClients++;
                break;
            case 'INACTIVE':
                analytics.inactiveClients++;
                break;
            case 'BLOCKED':
                analytics.blockedClients++;
                break;
        }

        // Credit limit statistics
        if (client.creditLimit) {
            analytics.totalCreditLimit += client.creditLimit;
            clientsWithCreditLimit++;
        }

        // Country statistics
        const country = client.address.country;
        analytics.clientsByCountry[country] = (analytics.clientsByCountry[country] || 0) + 1;
    });

    analytics.averageCreditLimit = clientsWithCreditLimit > 0
        ? analytics.totalCreditLimit / clientsWithCreditLimit
        : 0;

    return analytics;
};

export default clientSlice.reducer; 
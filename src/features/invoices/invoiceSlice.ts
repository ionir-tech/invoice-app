import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    generateInvoicePdf
} from './invoiceThunks';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
    tax?: number;
    discount?: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    client: {
        id: string;
        name: string;
        email: string;
        address: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    createdAt: string;
    dueDate: string;
    status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';
    notes?: string;
    terms?: string;
    payments?: {
        id: string;
        amount: number;
        date: string;
        method: string;
    }[];
}

interface InvoicesState {
    items: Invoice[];
    selectedInvoice: Invoice | null;
    loading: boolean;
    error: string | null;
    filters: {
        status: Invoice['status'] | null;
        startDate: string | null;
        endDate: string | null;
        clientId: string | null;
    };
    sort: {
        field: keyof Invoice | null;
        direction: 'asc' | 'desc';
    };
}

const initialState: InvoicesState = {
    items: [],
    selectedInvoice: null,
    loading: false,
    error: null,
    filters: {
        status: null,
        startDate: null,
        endDate: null,
        clientId: null
    },
    sort: {
        field: null,
        direction: 'desc'
    }
};

const invoiceSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedInvoice: (state) => {
            state.selectedInvoice = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setSortOrder: (state, action) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Fetch all invoices
        builder.addCase(fetchInvoices.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchInvoices.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchInvoices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch single invoice
        builder.addCase(fetchInvoiceById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchInvoiceById.fulfilled, (state, action) => {
            state.selectedInvoice = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchInvoiceById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create invoice
        builder.addCase(createInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createInvoice.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.loading = false;
        });
        builder.addCase(createInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update invoice
        builder.addCase(updateInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateInvoice.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedInvoice?.id === action.payload.id) {
                state.selectedInvoice = action.payload;
            }
            state.loading = false;
        });
        builder.addCase(updateInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete invoice
        builder.addCase(deleteInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteInvoice.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            if (state.selectedInvoice?.id === action.payload) {
                state.selectedInvoice = null;
            }
            state.loading = false;
        });
        builder.addCase(deleteInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update invoice status
        builder.addCase(updateInvoiceStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateInvoiceStatus.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedInvoice?.id === action.payload.id) {
                state.selectedInvoice = action.payload;
            }
            state.loading = false;
        });
        builder.addCase(updateInvoiceStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const {
    clearError,
    clearSelectedInvoice,
    setFilters,
    clearFilters,
    setSortOrder
} = invoiceSlice.actions;

// Basic selectors
export const selectInvoices = (state: RootState) => state.invoices.items;
export const selectSelectedInvoice = (state: RootState) => state.invoices.selectedInvoice;
export const selectInvoicesLoading = (state: RootState) => state.invoices.loading;
export const selectInvoicesError = (state: RootState) => state.invoices.error;
export const selectInvoicesFilters = (state: RootState) => state.invoices.filters;
export const selectInvoicesSort = (state: RootState) => state.invoices.sort;

// Filtered and sorted selectors
export const selectFilteredInvoices = (state: RootState) => {
    let filtered = state.invoices.items;
    const { status, startDate, endDate, clientId } = state.invoices.filters;
    
    if (status) {
        filtered = filtered.filter(invoice => invoice.status === status);
    }
    
    if (startDate) {
        filtered = filtered.filter(invoice => new Date(invoice.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
        filtered = filtered.filter(invoice => new Date(invoice.createdAt) <= new Date(endDate));
    }
    
    if (clientId) {
        filtered = filtered.filter(invoice => invoice.client.id === clientId);
    }
    
    const { field, direction } = state.invoices.sort;
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
            
            if (aValue instanceof Date && bValue instanceof Date) {
                return direction === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }
            
            return 0;
        });
    }
    
    return filtered;
};

// Analytics selectors
export const selectInvoiceStats = (state: RootState) => {
    const stats = {
        total: 0,
        paid: 0,
        overdue: 0,
        pending: 0,
        draft: 0,
        totalAmount: 0,
        paidAmount: 0,
        overdueAmount: 0,
        pendingAmount: 0
    };
    
    state.invoices.items.forEach(invoice => {
        stats.total++;
        stats.totalAmount += invoice.total;
        
        switch (invoice.status) {
            case 'PAID':
                stats.paid++;
                stats.paidAmount += invoice.total;
                break;
            case 'OVERDUE':
                stats.overdue++;
                stats.overdueAmount += invoice.total;
                break;
            case 'PENDING':
                stats.pending++;
                stats.pendingAmount += invoice.total;
                break;
            case 'DRAFT':
                stats.draft++;
                break;
        }
    });
    
    return stats;
};

export const selectInvoicesByClient = (state: RootState, clientId: string) =>
    state.invoices.items.filter(invoice => invoice.client.id === clientId);

export const selectClientStats = (state: RootState) => {
    const stats: Record<string, {
        clientName: string;
        invoiceCount: number;
        totalAmount: number;
        paidAmount: number;
        overdueAmount: number;
    }> = {};
    
    state.invoices.items.forEach(invoice => {
        const clientId = invoice.client.id;
        if (!stats[clientId]) {
            stats[clientId] = {
                clientName: invoice.client.name,
                invoiceCount: 0,
                totalAmount: 0,
                paidAmount: 0,
                overdueAmount: 0
            };
        }
        
        stats[clientId].invoiceCount++;
        stats[clientId].totalAmount += invoice.total;
        
        if (invoice.status === 'PAID') {
            stats[clientId].paidAmount += invoice.total;
        } else if (invoice.status === 'OVERDUE') {
            stats[clientId].overdueAmount += invoice.total;
        }
    });
    
    return stats;
};

export default invoiceSlice.reducer; 
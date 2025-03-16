import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
    fetchPayments,
    fetchPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    fetchPaymentsByInvoice,
} from './paymentThunks';

export interface Payment {
    id: string;
    invoice: {
        id: string;
        invoiceNumber: string;
        client: {
            id: string;
            name: string;
        };
        total: number;
    };
    amount: number;
    date: string;
    method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'OTHER';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    reference?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface PaymentsState {
    items: Payment[];
    selectedPayment: Payment | null;
    loading: boolean;
    error: string | null;
    filters: {
        startDate: string | null;
        endDate: string | null;
        method: Payment['method'] | null;
        status: Payment['status'] | null;
    };
}

const initialState: PaymentsState = {
    items: [],
    selectedPayment: null,
    loading: false,
    error: null,
    filters: {
        startDate: null,
        endDate: null,
        method: null,
        status: null
    }
};

const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedPayment: (state) => {
            state.selectedPayment = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        sortPayments: (state, action) => {
            const { field, direction } = action.payload;
            state.items = [...state.items].sort((a, b) => {
                if (field === 'date' || field === 'createdAt' || field === 'updatedAt') {
                    return direction === 'asc' 
                        ? new Date(a[field]).getTime() - new Date(b[field]).getTime()
                        : new Date(b[field]).getTime() - new Date(a[field]).getTime();
                }
                return direction === 'asc'
                    ? String(a[field]).localeCompare(String(b[field]))
                    : String(b[field]).localeCompare(String(a[field]));
            });
        }
    },
    extraReducers: (builder) => {
        // Fetch all payments
        builder.addCase(fetchPayments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPayments.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPayments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch single payment
        builder.addCase(fetchPaymentById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPaymentById.fulfilled, (state, action) => {
            state.selectedPayment = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPaymentById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create payment
        builder.addCase(createPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createPayment.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.loading = false;
        });
        builder.addCase(createPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update payment
        builder.addCase(updatePayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updatePayment.fulfilled, (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedPayment?.id === action.payload.id) {
                state.selectedPayment = action.payload;
            }
            state.loading = false;
        });
        builder.addCase(updatePayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete payment
        builder.addCase(deletePayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deletePayment.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            if (state.selectedPayment?.id === action.payload) {
                state.selectedPayment = null;
            }
            state.loading = false;
        });
        builder.addCase(deletePayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch payments by invoice
        builder.addCase(fetchPaymentsByInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPaymentsByInvoice.fulfilled, (state, action) => {
            state.items = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPaymentsByInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { 
    clearError, 
    clearSelectedPayment, 
    setFilters, 
    clearFilters,
    sortPayments 
} = paymentSlice.actions;

// Enhanced selectors
export const selectPayments = (state: RootState) => state.payments.items;
export const selectSelectedPayment = (state: RootState) => state.payments.selectedPayment;
export const selectPaymentById = (state: RootState, id: string) =>
    state.payments.items.find(payment => payment.id === id);
export const selectPaymentsLoading = (state: RootState) => state.payments.loading;
export const selectPaymentsError = (state: RootState) => state.payments.error;
export const selectPaymentsFilters = (state: RootState) => state.payments.filters;

// Filtered selectors
export const selectFilteredPayments = (state: RootState) => {
    const { items } = state.payments;
    const { startDate, endDate, method, status } = state.payments.filters;
    
    return items.filter(payment => {
        const matchesDateRange = (!startDate || new Date(payment.date) >= new Date(startDate)) &&
                               (!endDate || new Date(payment.date) <= new Date(endDate));
        const matchesMethod = !method || payment.method === method;
        const matchesStatus = !status || payment.status === status;
        
        return matchesDateRange && matchesMethod && matchesStatus;
    });
};

// Additional selectors for invoice-payment relationships
export const selectPaymentsByInvoiceId = (state: RootState, invoiceId: string) =>
    state.payments.items.filter(payment => payment.invoice.id === invoiceId);

export const selectTotalPaymentsByInvoiceId = (state: RootState, invoiceId: string) =>
    selectPaymentsByInvoiceId(state, invoiceId).reduce((total, payment) => total + payment.amount, 0);

export const selectPaymentMethodStats = (state: RootState) => {
    const stats: Record<Payment['method'], { count: number; total: number }> = {
        CREDIT_CARD: { count: 0, total: 0 },
        BANK_TRANSFER: { count: 0, total: 0 },
        CASH: { count: 0, total: 0 },
        CHECK: { count: 0, total: 0 },
        OTHER: { count: 0, total: 0 }
    };
    
    state.payments.items.forEach(payment => {
        stats[payment.method].count++;
        stats[payment.method].total += payment.amount;
    });
    
    return stats;
};

// Get payments within a date range
export const selectPaymentsByDateRange = (state: RootState, startDate: string, endDate: string) =>
    state.payments.items.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    });

// Get payments by client
export const selectPaymentsByClientId = (state: RootState, clientId: string) =>
    state.payments.items.filter(payment => payment.invoice.client.id === clientId);

// Get total payments by client
export const selectTotalPaymentsByClientId = (state: RootState, clientId: string) =>
    selectPaymentsByClientId(state, clientId).reduce((total, payment) => total + payment.amount, 0);

// Get recent payments (last 30 days by default)
export const selectRecentPayments = (state: RootState, days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return state.payments.items
        .filter(payment => new Date(payment.date) >= cutoffDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get payment trends by month
export const selectPaymentTrendsByMonth = (state: RootState) => {
    const trends: Record<string, { count: number; total: number }> = {};
    
    state.payments.items.forEach(payment => {
        const monthYear = new Date(payment.date).toISOString().slice(0, 7); // YYYY-MM format
        if (!trends[monthYear]) {
            trends[monthYear] = { count: 0, total: 0 };
        }
        trends[monthYear].count++;
        trends[monthYear].total += payment.amount;
    });
    
    return Object.entries(trends)
        .sort(([a], [b]) => b.localeCompare(a))
        .reduce((acc, [month, data]) => ({
            ...acc,
            [month]: data
        }), {});
};

// New selectors for analytics
export const selectPaymentStatusStats = (state: RootState) => {
    const stats: Record<Payment['status'], { count: number; total: number }> = {
        PENDING: { count: 0, total: 0 },
        COMPLETED: { count: 0, total: 0 },
        FAILED: { count: 0, total: 0 },
        REFUNDED: { count: 0, total: 0 }
    };
    
    state.payments.items.forEach(payment => {
        stats[payment.status].count++;
        stats[payment.status].total += payment.amount;
    });
    
    return stats;
};

export const selectOverpaidInvoices = (state: RootState) =>
    state.payments.items.reduce((acc, payment) => {
        const invoiceId = payment.invoice.id;
        if (!acc[invoiceId]) {
            acc[invoiceId] = {
                invoiceNumber: payment.invoice.invoiceNumber,
                invoiceTotal: payment.invoice.total,
                totalPaid: 0
            };
        }
        acc[invoiceId].totalPaid += payment.amount;
        return acc;
    }, {} as Record<string, { invoiceNumber: string; invoiceTotal: number; totalPaid: number }>);

export default paymentSlice.reducer; 
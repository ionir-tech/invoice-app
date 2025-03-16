import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './features/invoices/invoiceSlice';
import paymentReducer from './features/payments/paymentSlice';
import clientReducer from './features/clients/clientSlice';

export const store = configureStore({
    reducer: {
        invoices: invoiceReducer,
        payments: paymentReducer,
        clients: clientReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['invoices/generatePdf/fulfilled'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.data'],
                // Ignore these paths in the state
                ignoredPaths: ['invoices.pdfData'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
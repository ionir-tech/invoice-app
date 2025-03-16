import React from 'react';
import { useSelector } from 'react-redux';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';
import { selectInvoices } from '../../features/invoices/invoiceSlice';
import { formatCurrency } from '../../utils/formatters';

export const RevenueChart: React.FC = () => {
    const invoices = useSelector(selectInvoices);

    const chartData = React.useMemo(() => {
        const monthlyData = new Map<string, number>();

        invoices.forEach(invoice => {
            const date = new Date(invoice.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const amount = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

            monthlyData.set(
                monthKey,
                (monthlyData.get(monthKey) || 0) + amount
            );
        });

        return Array.from(monthlyData.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, amount]) => ({
                month,
                amount,
            }));
    }, [invoices]);

    const formatXAxis = (tickItem: string) => {
        const [year, month] = tickItem.split('-');
        return `${month}/${year.slice(2)}`;
    };

    const formatTooltip = (value: number) => [formatCurrency(value), 'Revenue'];

    return (
        <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={formatXAxis}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip
                        formatter={formatTooltip}
                    />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#1976d2"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RevenueChart; 
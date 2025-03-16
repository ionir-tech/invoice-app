import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from '../shared/Table';
import { Select } from '../shared/Select';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { Alert } from '../shared/Alert';
import { RootState } from '../../store';
import { fetchInvoices } from '../../slices/invoiceSlice';

const Container = styled.div`
    padding: 24px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin: 0;
`;

const Filters = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
`;

const FilterItem = styled.div`
    flex: 1;
`;

const columns = [
    { id: 'invoiceNumber', label: 'Invoice #' },
    { id: 'client', label: 'Client' },
    { id: 'amount', label: 'Amount' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'paid':
            return 'success';
        case 'sent':
            return 'info';
        case 'overdue':
            return 'danger';
        default:
            return 'secondary';
    }
};

export const InvoiceList: React.FC = () => {
    const dispatch = useDispatch();
    const { invoices, loading, error } = useSelector((state: RootState) => state.invoices);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState({ field: 'dueDate', direction: 'desc' });

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        // Add filter logic here
    };

    const handleSort = (field: string) => {
        setSortBy(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        // Add sort logic here
    };

    const handleCreateInvoice = () => {
        // Add navigation to create invoice page
    };

    const handleViewInvoice = (id: string) => {
        // Add navigation to invoice details page
    };

    const renderStatus = (status: string) => (
        <Badge variant={getStatusBadgeVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );

    const renderActions = (id: string) => (
        <Button
            variant="secondary"
            size="small"
            onClick={() => handleViewInvoice(id)}
        >
            View
        </Button>
    );

    return (
        <Container>
            <Header>
                <Title>Invoices</Title>
                <Button
                    variant="primary"
                    onClick={handleCreateInvoice}
                >
                    Create Invoice
                </Button>
            </Header>

            <Card>
                <Filters>
                    <FilterItem>
                        <Select
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            placeholder="Filter by status"
                        />
                    </FilterItem>
                    {/* Add more filters as needed */}
                </Filters>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        closable={false}
                    />
                )}

                <Table
                    columns={columns}
                    data={invoices.map(invoice => ({
                        ...invoice,
                        status: renderStatus(invoice.status),
                        actions: renderActions(invoice.id)
                    }))}
                    loading={loading}
                    sortable={true}
                    onSort={handleSort}
                />
            </Card>
        </Container>
    );
}; 
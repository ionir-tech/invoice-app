import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { Alert } from '../shared/Alert';
import { Tooltip } from '../shared/Tooltip';
import { RootState } from '../../store';
import { updateInvoiceStatus } from '../../slices/invoiceSlice';

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

const Actions = styled.div`
    display: flex;
    gap: 12px;
`;

const Section = styled.div`
    margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 16px 0;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
`;

const Field = styled.div`
    margin-bottom: 16px;
`;

const Label = styled.div`
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
`;

const Value = styled.div`
    font-size: 16px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
`;

const Th = styled.th`
    text-align: left;
    padding: 12px;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 500;
`;

const Td = styled.td`
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
`;

const Total = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
`;

const TotalAmount = styled.div`
    font-size: 20px;
    font-weight: 600;
`;

export const InvoiceDetails: React.FC<{ id: string }> = ({ id }) => {
    const dispatch = useDispatch();
    const { invoice, loading, error } = useSelector((state: RootState) => state.invoices);

    const handleStatusUpdate = (newStatus: string) => {
        dispatch(updateInvoiceStatus({ id, status: newStatus }));
    };

    const handleDownloadPDF = () => {
        // Add PDF download logic
    };

    const handleSendEmail = () => {
        // Add email sending logic
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    if (!invoice) {
        return <Alert type="error" message="Invoice not found" />;
    }

    return (
        <Container>
            <Header>
                <div>
                    <Title>Invoice #{invoice.invoiceNumber}</Title>
                    <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                        {invoice.status}
                    </Badge>
                </div>
                <Actions>
                    <Tooltip content="Download PDF">
                        <Button variant="secondary" onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                    </Tooltip>
                    <Tooltip content="Send via email">
                        <Button variant="secondary" onClick={handleSendEmail}>
                            Send Email
                        </Button>
                    </Tooltip>
                    {invoice.status !== 'paid' && (
                        <Button
                            variant="primary"
                            onClick={() => handleStatusUpdate('paid')}
                        >
                            Mark as Paid
                        </Button>
                    )}
                </Actions>
            </Header>

            <Grid>
                <Card>
                    <Section>
                        <SectionTitle>Client Information</SectionTitle>
                        <Field>
                            <Label>Name</Label>
                            <Value>{invoice.client.name}</Value>
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <Value>{invoice.client.email}</Value>
                        </Field>
                        <Field>
                            <Label>Phone</Label>
                            <Value>{invoice.client.phone}</Value>
                        </Field>
                    </Section>
                </Card>

                <Card>
                    <Section>
                        <SectionTitle>Invoice Details</SectionTitle>
                        <Field>
                            <Label>Invoice Date</Label>
                            <Value>{new Date(invoice.invoiceDate).toLocaleDateString()}</Value>
                        </Field>
                        <Field>
                            <Label>Due Date</Label>
                            <Value>{new Date(invoice.dueDate).toLocaleDateString()}</Value>
                        </Field>
                        <Field>
                            <Label>Payment Terms</Label>
                            <Value>{invoice.paymentTerms}</Value>
                        </Field>
                    </Section>
                </Card>
            </Grid>

            <Card>
                <Section>
                    <SectionTitle>Items</SectionTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Description</Th>
                                <Th>Quantity</Th>
                                <Th>Unit Price</Th>
                                <Th>Total</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index}>
                                    <Td>{item.description}</Td>
                                    <Td>{item.quantity}</Td>
                                    <Td>${item.unitPrice.toFixed(2)}</Td>
                                    <Td>${(item.quantity * item.unitPrice).toFixed(2)}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Total>
                        <TotalAmount>
                            Total: ${invoice.total.toFixed(2)}
                        </TotalAmount>
                    </Total>
                </Section>
            </Card>
        </Container>
    );
}; 
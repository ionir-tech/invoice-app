import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { Alert } from '../shared/Alert';
import { createInvoice, updateInvoice } from '../../slices/invoiceSlice';

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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
`;

const Input = styled.input<{ hasError?: boolean }>`
    padding: 8px 12px;
    border: 1px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
    border-radius: 6px;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
`;

const ErrorText = styled.span`
    color: #ef4444;
    font-size: 12px;
`;

const ItemsTable = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
`;

const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 16px;
    padding: 12px;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.div`
    padding: 12px;
`;

const ItemRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 16px;
    margin-bottom: 12px;
`;

const Total = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    font-size: 18px;
    font-weight: 600;
`;

interface InvoiceFormProps {
    invoice?: any; // Replace with proper type
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
    invoice,
    onSubmit,
    onCancel
}) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(invoice || {
        client: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        notes: ''
    });
    const [errors, setErrors] = useState<any>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum: number, item: any) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.client) {
            newErrors.client = 'Client is required';
        }
        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }
        if (formData.items.length === 0) {
            newErrors.items = 'At least one item is required';
        }

        formData.items.forEach((item: any, index: number) => {
            if (!item.description) {
                newErrors[`item-${index}-description`] = 'Description is required';
            }
            if (item.quantity <= 0) {
                newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
            }
            if (item.unitPrice <= 0) {
                newErrors[`item-${index}-unitPrice`] = 'Price must be greater than 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (invoice) {
            dispatch(updateInvoice({ ...formData, id: invoice.id }));
        } else {
            dispatch(createInvoice(formData));
        }

        onSubmit(formData);
    };

    return (
        <Container>
            <Header>
                <Title>{invoice ? 'Edit Invoice' : 'Create Invoice'}</Title>
            </Header>

            <Form onSubmit={handleSubmit}>
                <Card>
                    <Grid>
                        <FormGroup>
                            <Label>Client</Label>
                            <Select
                                options={[]} // Add client options
                                value={formData.client}
                                onChange={(value) => handleInputChange({
                                    target: { name: 'client', value }
                                } as any)}
                                error={errors.client}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Due Date</Label>
                            <Input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                hasError={!!errors.dueDate}
                            />
                            {errors.dueDate && <ErrorText>{errors.dueDate}</ErrorText>}
                        </FormGroup>
                    </Grid>
                </Card>

                <Card>
                    <ItemsTable>
                        <TableHeader>
                            <div>Description</div>
                            <div>Quantity</div>
                            <div>Unit Price</div>
                            <div>Total</div>
                            <div></div>
                        </TableHeader>

                        <TableBody>
                            {formData.items.map((item: any, index: number) => (
                                <ItemRow key={index}>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            hasError={!!errors[`item-${index}-description`]}
                                            placeholder="Item description"
                                        />
                                        {errors[`item-${index}-description`] && (
                                            <ErrorText>{errors[`item-${index}-description`]}</ErrorText>
                                        )}
                                    </FormGroup>

                                    <FormGroup>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                            hasError={!!errors[`item-${index}-quantity`]}
                                            min="1"
                                        />
                                        {errors[`item-${index}-quantity`] && (
                                            <ErrorText>{errors[`item-${index}-quantity`]}</ErrorText>
                                        )}
                                    </FormGroup>

                                    <FormGroup>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                            hasError={!!errors[`item-${index}-unitPrice`]}
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors[`item-${index}-unitPrice`] && (
                                            <ErrorText>{errors[`item-${index}-unitPrice`]}</ErrorText>
                                        )}
                                    </FormGroup>

                                    <div>
                                        ${(item.quantity * item.unitPrice).toFixed(2)}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="small"
                                        onClick={() => removeItem(index)}
                                        disabled={formData.items.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </ItemRow>
                            ))}
                        </TableBody>
                    </ItemsTable>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addItem}
                        style={{ marginTop: '16px' }}
                    >
                        Add Item
                    </Button>

                    <Total>
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </Total>
                </Card>

                <Card>
                    <FormGroup>
                        <Label>Notes</Label>
                        <Input
                            as="textarea"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            style={{ minHeight: '100px' }}
                        />
                    </FormGroup>
                </Card>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {invoice ? 'Update Invoice' : 'Create Invoice'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
}; 
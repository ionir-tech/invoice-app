import React from 'react';
import styled from 'styled-components';

// Form Container
const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

// Form Group
const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

// Label
const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #374151;
`;

// Input
const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 16px;
    color: #1f2937;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`;

// Select
const Select = styled.select`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 16px;
    color: #1f2937;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
    }
`;

// Textarea
const Textarea = styled.textarea`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 16px;
    color: #1f2937;
    min-height: 100px;
    resize: vertical;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`;

// Error Message
const ErrorMessage = styled.span`
    font-size: 14px;
    color: #ef4444;
`;

// Helper Text
const HelperText = styled.span`
    font-size: 14px;
    color: #6b7280;
`;

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Form = {
    Container: FormContainer,
    Group: FormGroup,
    Label: Label,
    Input: React.forwardRef<HTMLInputElement, FormFieldProps>(
        ({ label, error, helperText, ...props }, ref) => (
            <FormGroup>
                {label && <Label>{label}</Label>}
                <Input ref={ref} {...props} />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {helperText && <HelperText>{helperText}</HelperText>}
            </FormGroup>
        )
    ),
    Select: React.forwardRef<HTMLSelectElement, FormFieldProps>(
        ({ label, error, helperText, children, ...props }, ref) => (
            <FormGroup>
                {label && <Label>{label}</Label>}
                <Select ref={ref} {...props}>
                    {children}
                </Select>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {helperText && <HelperText>{helperText}</HelperText>}
            </FormGroup>
        )
    ),
    Textarea: React.forwardRef<HTMLTextAreaElement, FormFieldProps>(
        ({ label, error, helperText, ...props }, ref) => (
            <FormGroup>
                {label && <Label>{label}</Label>}
                <Textarea ref={ref} {...props} />
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {helperText && <HelperText>{helperText}</HelperText>}
            </FormGroup>
        )
    ),
}; 
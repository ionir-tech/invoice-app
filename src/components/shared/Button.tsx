import React from 'react';
import { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    outline: none;
    
    ${props => props.fullWidth && css`
        width: 100%;
    `}
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    padding: 8px 16px;
                    font-size: 14px;
                `;
            case 'large':
                return css`
                    padding: 16px 32px;
                    font-size: 18px;
                `;
            default:
                return css`
                    padding: 12px 24px;
                    font-size: 16px;
                `;
        }
    }}
    
    ${props => {
        switch (props.variant) {
            case 'secondary':
                return css`
                    background-color: #f3f4f6;
                    color: #374151;
                    &:hover {
                        background-color: #e5e7eb;
                    }
                `;
            case 'danger':
                return css`
                    background-color: #ef4444;
                    color: white;
                    &:hover {
                        background-color: #dc2626;
                    }
                `;
            case 'success':
                return css`
                    background-color: #10b981;
                    color: white;
                    &:hover {
                        background-color: #059669;
                    }
                `;
            case 'warning':
                return css`
                    background-color: #f59e0b;
                    color: white;
                    &:hover {
                        background-color: #d97706;
                    }
                `;
            default:
                return css`
                    background-color: #3b82f6;
                    color: white;
                    &:hover {
                        background-color: #2563eb;
                    }
                `;
        }
    }}
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const LoadingSpinner = styled.div`
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 2px solid white;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled,
    ...props
}) => {
    return (
        <StyledButton
            variant={variant}
            size={size}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <LoadingSpinner />}
            {children}
        </StyledButton>
    );
}; 
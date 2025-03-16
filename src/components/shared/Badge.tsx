import React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    rounded?: boolean;
    outlined?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    children: React.ReactNode;
}

const Container = styled.span<{
    variant: string;
    size: string;
    rounded: boolean;
    outlined: boolean;
}>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    border-radius: ${props => props.rounded ? '9999px' : '4px'};
    white-space: nowrap;
    transition: all 0.2s;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    padding: 2px 6px;
                    font-size: 12px;
                `;
            case 'large':
                return css`
                    padding: 6px 12px;
                    font-size: 16px;
                `;
            default:
                return css`
                    padding: 4px 8px;
                    font-size: 14px;
                `;
        }
    }}
    
    ${props => {
        const colors = {
            primary: { bg: '#3b82f6', text: '#ffffff', border: '#2563eb' },
            secondary: { bg: '#6b7280', text: '#ffffff', border: '#4b5563' },
            success: { bg: '#10b981', text: '#ffffff', border: '#059669' },
            danger: { bg: '#ef4444', text: '#ffffff', border: '#dc2626' },
            warning: { bg: '#f59e0b', text: '#ffffff', border: '#d97706' },
            info: { bg: '#3b82f6', text: '#ffffff', border: '#2563eb' }
        };

        const color = colors[props.variant as keyof typeof colors];

        if (props.outlined) {
            return css`
                background-color: transparent;
                border: 1px solid ${color.border};
                color: ${color.border};
            `;
        }

        return css`
            background-color: ${color.bg};
            color: ${color.text};
        `;
    }}
`;

const RemoveButton = styled.button<{ size: string }>`
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
        opacity: 1;
    }
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    width: 14px;
                    height: 14px;
                    font-size: 12px;
                `;
            case 'large':
                return css`
                    width: 18px;
                    height: 18px;
                    font-size: 16px;
                `;
            default:
                return css`
                    width: 16px;
                    height: 16px;
                    font-size: 14px;
                `;
        }
    }}
`;

export const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'medium',
    rounded = false,
    outlined = false,
    removable = false,
    onRemove,
    children
}) => {
    return (
        <Container
            variant={variant}
            size={size}
            rounded={rounded}
            outlined={outlined}
        >
            {children}
            {removable && onRemove && (
                <RemoveButton
                    size={size}
                    onClick={onRemove}
                    aria-label="Remove"
                >
                    ×
                </RemoveButton>
            )}
        </Container>
    );
}; 
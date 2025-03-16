import React from 'react';
import styled, { css, keyframes } from 'styled-components';

interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message: string;
    onClose?: () => void;
    closable?: boolean;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Container = styled.div<{ type: string }>`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 6px;
    animation: ${slideIn} 0.2s ease-out;
    
    ${props => {
        switch (props.type) {
            case 'success':
                return css`
                    background-color: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    color: #047857;
                `;
            case 'warning':
                return css`
                    background-color: #fffbeb;
                    border: 1px solid #fcd34d;
                    color: #b45309;
                `;
            case 'error':
                return css`
                    background-color: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                `;
            default:
                return css`
                    background-color: #eff6ff;
                    border: 1px solid #bfdbfe;
                    color: #1e40af;
                `;
        }
    }}
`;

const IconContainer = styled.div<{ type: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    
    svg {
        width: 20px;
        height: 20px;
    }
`;

const Content = styled.div`
    flex: 1;
`;

const Title = styled.h4`
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
`;

const Message = styled.p`
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: currentColor;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
        opacity: 1;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

const ActionContainer = styled.div`
    margin-top: 12px;
`;

const getIcon = (type: string) => {
    switch (type) {
        case 'success':
            return (
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        case 'warning':
            return (
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            );
        case 'error':
            return (
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            );
    }
};

export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    title,
    message,
    onClose,
    closable = true,
    icon,
    action
}) => {
    return (
        <Container type={type}>
            <IconContainer type={type}>
                {icon || getIcon(type)}
            </IconContainer>
            <Content>
                {title && <Title>{title}</Title>}
                <Message>{message}</Message>
                {action && <ActionContainer>{action}</ActionContainer>}
            </Content>
            {closable && onClose && (
                <CloseButton onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </CloseButton>
            )}
        </Container>
    );
}; 
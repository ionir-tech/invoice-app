import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { createPortal } from 'react-dom';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const slideIn = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideOut = keyframes`
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
`;

const ToastContainer = styled.div<{ position: string }>`
    position: fixed;
    z-index: 1100;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
    
    ${props => {
        switch (props.position) {
            case 'top-left':
                return css`
                    top: 0;
                    left: 0;
                `;
            case 'bottom-right':
                return css`
                    bottom: 0;
                    right: 0;
                `;
            case 'bottom-left':
                return css`
                    bottom: 0;
                    left: 0;
                `;
            default:
                return css`
                    top: 0;
                    right: 0;
                `;
        }
    }}
`;

const ToastContent = styled.div<{ type: string; isExiting: boolean }>`
    min-width: 300px;
    padding: 12px 16px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: auto;
    animation: ${slideIn} 0.3s ease forwards;
    
    ${props => props.isExiting && css`
        animation: ${slideOut} 0.3s ease forwards;
    `}
    
    ${props => {
        switch (props.type) {
            case 'error':
                return css`
                    background-color: #fee2e2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                `;
            case 'warning':
                return css`
                    background-color: #fef3c7;
                    border: 1px solid #fde68a;
                    color: #d97706;
                `;
            case 'info':
                return css`
                    background-color: #dbeafe;
                    border: 1px solid #bfdbfe;
                    color: #2563eb;
                `;
            default:
                return css`
                    background-color: #dcfce7;
                    border: 1px solid #bbf7d0;
                    color: #16a34a;
                `;
        }
    }}
`;

const Message = styled.span`
    font-size: 14px;
    font-weight: 500;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    
    &:hover {
        opacity: 1;
    }
`;

const Icon = styled.span`
    margin-right: 8px;
`;

const getIcon = (type: string) => {
    switch (type) {
        case 'error':
            return '✕';
        case 'warning':
            return '⚠';
        case 'info':
            return 'ℹ';
        default:
            return '✓';
    }
};

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 5000,
    onClose,
    position = 'top-right'
}) => {
    const [isExiting, setIsExiting] = React.useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return createPortal(
        <ToastContainer position={position}>
            <ToastContent type={type} isExiting={isExiting}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon>{getIcon(type)}</Icon>
                    <Message>{message}</Message>
                </div>
                <CloseButton onClick={() => {
                    setIsExiting(true);
                    setTimeout(onClose, 300);
                }}>
                    ✕
                </CloseButton>
            </ToastContent>
        </ToastContainer>,
        document.body
    );
}; 
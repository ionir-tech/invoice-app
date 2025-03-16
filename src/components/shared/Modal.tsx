import React, { useEffect } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div<{ size: 'small' | 'medium' | 'large' }>`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-height: 90vh;
    overflow-y: auto;
    width: ${props => {
        switch (props.size) {
            case 'small':
                return '400px';
            case 'large':
                return '800px';
            default:
                return '600px';
        }
    }};
`;

const ModalHeader = styled.div`
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #6b7280;
    
    &:hover {
        color: #374151;
    }
    
    &:focus {
        outline: none;
    }
`;

const ModalContent = styled.div`
    padding: 24px;
`;

const ModalFooter = styled.div`
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

export const Modal: React.FC<ModalProps> & {
    Footer: typeof ModalFooter;
} = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium'
}) => {
        useEffect(() => {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            if (isOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }, [isOpen, onClose]);

        if (!isOpen) return null;

        return createPortal(
            <Overlay onClick={onClose}>
                <ModalContainer
                    size={size}
                    onClick={e => e.stopPropagation()}
                >
                    <ModalHeader>
                        <ModalTitle>{title}</ModalTitle>
                        <CloseButton onClick={onClose}>✕</CloseButton>
                    </ModalHeader>
                    <ModalContent>
                        {children}
                    </ModalContent>
                </ModalContainer>
            </Overlay>,
            document.body
        );
    };

Modal.Footer = ModalFooter; 
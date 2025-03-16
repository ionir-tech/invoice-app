import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    className?: string;
    children: React.ReactNode;
}

const StyledCard = styled.div<CardProps>`
    background: white;
    border-radius: 8px;
    overflow: hidden;
    
    ${props => props.fullWidth && css`
        width: 100%;
    `}
    
    ${props => {
        switch (props.padding) {
            case 'none':
                return css`padding: 0;`;
            case 'small':
                return css`padding: 12px;`;
            case 'large':
                return css`padding: 24px;`;
            default:
                return css`padding: 16px;`;
        }
    }}
    
    ${props => {
        switch (props.variant) {
            case 'outlined':
                return css`
                    border: 1px solid #e5e7eb;
                `;
            case 'elevated':
                return css`
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                               0 2px 4px -1px rgba(0, 0, 0, 0.06);
                `;
            default:
                return css`
                    border: none;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                               0 1px 2px 0 rgba(0, 0, 0, 0.06);
                `;
        }
    }}
`;

const CardHeader = styled.div`
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 18px;
`;

const CardFooter = styled.div`
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
`;

const CardContent = styled.div`
    padding: 16px;
`;

export const Card: React.FC<CardProps> & {
    Header: typeof CardHeader;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
} = ({
    variant = 'default',
    padding = 'medium',
    fullWidth = false,
    className,
    children,
}) => {
        return (
            <StyledCard
                variant={variant}
                padding={padding}
                fullWidth={fullWidth}
                className={className}
            >
                {children}
            </StyledCard>
        );
    };

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter; 
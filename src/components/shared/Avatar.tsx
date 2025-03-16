import React, { useState } from 'react';
import styled, { css } from 'styled-components';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    shape?: 'circle' | 'square';
    status?: 'online' | 'offline' | 'busy' | 'away';
    backgroundColor?: string;
}

const Container = styled.div<{ size: string; shape: string }>`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-weight: 500;
    border-radius: ${props => props.shape === 'circle' ? '50%' : '8px'};
    overflow: hidden;
    user-select: none;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                `;
            case 'large':
                return css`
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                `;
            case 'xlarge':
                return css`
                    width: 64px;
                    height: 64px;
                    font-size: 24px;
                `;
            default:
                return css`
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                `;
        }
    }}
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Fallback = styled.div<{ backgroundColor: string }>`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.backgroundColor};
    color: white;
    text-transform: uppercase;
`;

const StatusIndicator = styled.div<{ status: string; size: string }>`
    position: absolute;
    bottom: 0;
    right: 0;
    width: ${props => props.size === 'xlarge' ? '14px' : '10px'};
    height: ${props => props.size === 'xlarge' ? '14px' : '10px'};
    border-radius: 50%;
    border: 2px solid white;
    
    ${props => {
        switch (props.status) {
            case 'online':
                return css`background-color: #10b981;`;
            case 'offline':
                return css`background-color: #6b7280;`;
            case 'busy':
                return css`background-color: #ef4444;`;
            case 'away':
                return css`background-color: #f59e0b;`;
            default:
                return '';
        }
    }}
`;

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

const getRandomColor = (name: string): string => {
    const colors = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    const index = name.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0) % colors.length;

    return colors[index];
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = '',
    name = '',
    size = 'medium',
    shape = 'circle',
    status,
    backgroundColor
}) => {
    const [imageError, setImageError] = useState(false);
    const showFallback = !src || imageError;
    const bgColor = backgroundColor || (name ? getRandomColor(name) : '#6b7280');

    return (
        <Container size={size} shape={shape}>
            {showFallback ? (
                <Fallback backgroundColor={bgColor}>
                    {name ? getInitials(name) : '?'}
                </Fallback>
            ) : (
                <Image
                    src={src}
                    alt={alt || name}
                    onError={() => setImageError(true)}
                />
            )}
            {status && <StatusIndicator status={status} size={size} />}
        </Container>
    );
}; 
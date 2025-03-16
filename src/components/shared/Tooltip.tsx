import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

type Position = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
    content: React.ReactNode;
    position?: Position;
    delay?: number;
    children: React.ReactElement;
    maxWidth?: number;
    className?: string;
}

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
    position: relative;
    display: inline-block;
`;

const Content = styled.div<{ position: Position; maxWidth: number; isVisible: boolean }>`
    position: absolute;
    padding: 8px 12px;
    background-color: #1f2937;
    color: white;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    max-width: ${props => props.maxWidth}px;
    animation: ${fadeIn} 0.2s ease-out;
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    
    ${props => {
        switch (props.position) {
            case 'top':
                return css`
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-8px);
                    
                    &::after {
                        content: '';
                        position: absolute;
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border-width: 6px;
                        border-style: solid;
                        border-color: #1f2937 transparent transparent transparent;
                    }
                `;
            case 'right':
                return css`
                    top: 50%;
                    left: 100%;
                    transform: translateY(-50%) translateX(8px);
                    
                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: 100%;
                        transform: translateY(-50%);
                        border-width: 6px;
                        border-style: solid;
                        border-color: transparent #1f2937 transparent transparent;
                    }
                `;
            case 'bottom':
                return css`
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(8px);
                    
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        border-width: 6px;
                        border-style: solid;
                        border-color: transparent transparent #1f2937 transparent;
                    }
                `;
            case 'left':
                return css`
                    top: 50%;
                    right: 100%;
                    transform: translateY(-50%) translateX(-8px);
                    
                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 100%;
                        transform: translateY(-50%);
                        border-width: 6px;
                        border-style: solid;
                        border-color: transparent transparent transparent #1f2937;
                    }
                `;
        }
    }}
`;

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    position = 'top',
    delay = 200,
    children,
    maxWidth = 200,
    className
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <Container
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <Content position={position} maxWidth={maxWidth} isVisible={isVisible}>
                {content}
            </Content>
        </Container>
    );
}; 
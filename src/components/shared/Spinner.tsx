import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'light';
    fullPage?: boolean;
    overlay?: boolean;
}

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const FullPageContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
`;

const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 10;
`;

const SpinnerContainer = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

const SpinnerRing = styled.div<{ size: string; variant: string }>`
    display: inline-block;
    position: relative;
    width: ${props => {
        switch (props.size) {
            case 'small':
                return '16px';
            case 'large':
                return '48px';
            default:
                return '32px';
        }
    }};
    height: ${props => {
        switch (props.size) {
            case 'small':
                return '16px';
            case 'large':
                return '48px';
            default:
                return '32px';
        }
    }};

    & div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        border: ${props => {
        switch (props.size) {
            case 'small':
                return '2px';
            case 'large':
                return '4px';
            default:
                return '3px';
        }
    }} solid;
        border-radius: 50%;
        animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${props => {
        switch (props.variant) {
            case 'secondary':
                return '#6b7280 transparent transparent transparent';
            case 'light':
                return '#ffffff transparent transparent transparent';
            default:
                return '#3b82f6 transparent transparent transparent';
        }
    }};
    }

    & div:nth-child(1) {
        animation-delay: -0.45s;
    }

    & div:nth-child(2) {
        animation-delay: -0.3s;
    }

    & div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;

const LoadingText = styled.span<{ variant: string }>`
    margin-left: 12px;
    font-size: 14px;
    color: ${props => {
        switch (props.variant) {
            case 'secondary':
                return '#6b7280';
            case 'light':
                return '#ffffff';
            default:
                return '#3b82f6';
        }
    }};
`;

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'medium',
    variant = 'primary',
    fullPage = false,
    overlay = false
}) => {
    const spinner = (
        <SpinnerContainer>
            <SpinnerRing size={size} variant={variant}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </SpinnerRing>
            {size === 'large' && (
                <LoadingText variant={variant}>Loading...</LoadingText>
            )}
        </SpinnerContainer>
    );

    if (fullPage) {
        return <FullPageContainer>{spinner}</FullPageContainer>;
    }

    if (overlay) {
        return <OverlayContainer>{spinner}</OverlayContainer>;
    }

    return spinner;
}; 
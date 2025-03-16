import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    vertical?: boolean;
}

const Container = styled.div<{ vertical: boolean }>`
    display: flex;
    flex-direction: ${props => props.vertical ? 'row' : 'column'};
    gap: 16px;
`;

const TabList = styled.div<{ vertical: boolean; fullWidth: boolean }>`
    display: flex;
    flex-direction: ${props => props.vertical ? 'column' : 'row'};
    gap: 2px;
    ${props => props.fullWidth && !props.vertical && css`
        width: 100%;
        & > * {
            flex: 1;
        }
    `}
    position: relative;
`;

const TabButton = styled.button<{
    active: boolean;
    variant: string;
    size: string;
    vertical: boolean;
    disabled: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
    border: none;
    background: none;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1};
    transition: all 0.2s;
    position: relative;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    padding: 8px 16px;
                    font-size: 14px;
                `;
            case 'large':
                return css`
                    padding: 12px 24px;
                    font-size: 16px;
                `;
            default:
                return css`
                    padding: 10px 20px;
                    font-size: 15px;
                `;
        }
    }}
    
    ${props => {
        switch (props.variant) {
            case 'pills':
                return css`
                    border-radius: 9999px;
                    background: ${props.active ? '#3b82f6' : 'transparent'};
                    color: ${props.active ? 'white' : '#6b7280'};
                    font-weight: ${props.active ? '500' : 'normal'};
                    
                    &:hover:not(:disabled) {
                        background: ${props.active ? '#2563eb' : '#f3f4f6'};
                    }
                `;
            case 'underline':
                return css`
                    color: ${props.active ? '#3b82f6' : '#6b7280'};
                    font-weight: ${props.active ? '500' : 'normal'};
                    
                    &:after {
                        content: '';
                        position: absolute;
                        ${props.vertical ? 'right: 0;' : 'bottom: 0;'}
                        ${props.vertical ? 'top: 0;' : 'left: 0;'}
                        ${props.vertical ? 'width: 2px;' : 'height: 2px;'}
                        ${props.vertical ? 'height: 100%;' : 'width: 100%;'}
                        background-color: ${props.active ? '#3b82f6' : 'transparent'};
                        transition: all 0.2s;
                    }
                    
                    &:hover:not(:disabled) {
                        color: #3b82f6;
                    }
                `;
            default:
                return css`
                    border-radius: 6px;
                    color: ${props.active ? '#3b82f6' : '#6b7280'};
                    font-weight: ${props.active ? '500' : 'normal'};
                    
                    &:hover:not(:disabled) {
                        background: #f3f4f6;
                    }
                `;
        }
    }}
`;

const TabContent = styled.div`
    flex: 1;
`;

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    variant = 'default',
    size = 'medium',
    fullWidth = false,
    vertical = false,
    children
}) => {
    return (
        <Container vertical={vertical}>
            <TabList vertical={vertical} fullWidth={fullWidth}>
                {tabs.map(tab => (
                    <TabButton
                        key={tab.id}
                        active={activeTab === tab.id}
                        variant={variant}
                        size={size}
                        vertical={vertical}
                        disabled={tab.disabled || false}
                        onClick={() => !tab.disabled && onChange(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-disabled={tab.disabled}
                    >
                        {tab.icon}
                        {tab.label}
                    </TabButton>
                ))}
            </TabList>
            <TabContent role="tabpanel">
                {children}
            </TabContent>
        </Container>
    );
}; 
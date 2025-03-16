import React from 'react';
import styled, { css } from 'styled-components';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    separator?: string | React.ReactNode;
    maxItems?: number;
    size?: 'small' | 'medium' | 'large';
    onClick?: (item: BreadcrumbItem) => void;
}

const Container = styled.nav`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
`;

const List = styled.ol`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Link = styled.a<{ size: string }>`
    color: #6b7280;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`font-size: 12px;`;
            case 'large':
                return css`font-size: 16px;`;
            default:
                return css`font-size: 14px;`;
        }
    }}
    
    &:hover {
        color: #3b82f6;
    }
    
    &:last-child {
        color: #1f2937;
        font-weight: 500;
        pointer-events: none;
    }
`;

const Separator = styled.span<{ size: string }>`
    color: #9ca3af;
    user-select: none;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`font-size: 12px;`;
            case 'large':
                return css`font-size: 16px;`;
            default:
                return css`font-size: 14px;`;
        }
    }}
`;

const Ellipsis = styled.span`
    color: #6b7280;
    cursor: pointer;
    padding: 0 4px;
    
    &:hover {
        color: #3b82f6;
    }
`;

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    separator = '/',
    maxItems = 0,
    size = 'medium',
    onClick
}) => {
    const renderItems = () => {
        if (!maxItems || items.length <= maxItems) {
            return items;
        }

        const firstItem = items[0];
        const lastItems = items.slice(-Math.floor(maxItems / 2));
        const collapsedItems = items.slice(1, -Math.floor(maxItems / 2));

        return [
            firstItem,
            { label: '...', href: '', icon: null },
            ...lastItems
        ];
    };

    const handleClick = (e: React.MouseEvent, item: BreadcrumbItem) => {
        if (onClick) {
            e.preventDefault();
            onClick(item);
        }
    };

    return (
        <Container aria-label="Breadcrumb">
            <List>
                {renderItems().map((item, index, array) => (
                    <Item key={index}>
                        {item.label === '...' ? (
                            <Ellipsis title="Show more">•••</Ellipsis>
                        ) : (
                            <Link
                                href={item.href}
                                onClick={(e) => handleClick(e, item)}
                                size={size}
                                aria-current={index === array.length - 1 ? 'page' : undefined}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )}
                        {index < array.length - 1 && (
                            <Separator size={size} aria-hidden="true">
                                {separator}
                            </Separator>
                        )}
                    </Item>
                ))}
            </List>
        </Container>
    );
}; 
import React from 'react';
import styled, { css } from 'styled-components';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    size?: 'small' | 'medium' | 'large';
    showFirstLast?: boolean;
    maxVisiblePages?: number;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const PageButton = styled.button<{ active?: boolean; size: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    background: ${props => props.active ? '#3b82f6' : 'white'};
    color: ${props => props.active ? 'white' : '#374151'};
    cursor: pointer;
    transition: all 0.2s ease;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    height: 28px;
                    min-width: 28px;
                    font-size: 12px;
                    border-radius: 4px;
                `;
            case 'large':
                return css`
                    height: 40px;
                    min-width: 40px;
                    font-size: 16px;
                    border-radius: 8px;
                `;
            default:
                return css`
                    height: 36px;
                    min-width: 36px;
                    font-size: 14px;
                    border-radius: 6px;
                `;
        }
    }}
    
    &:hover {
        background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
        border-color: ${props => props.active ? '#2563eb' : '#d1d5db'};
    }
    
    &:disabled {
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
        border-color: #e5e7eb;
    }
`;

const Ellipsis = styled.span<{ size: string }>`
    color: #6b7280;
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

const PageInfo = styled.span<{ size: string }>`
    color: #6b7280;
    margin: 0 8px;
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

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    size = 'medium',
    showFirstLast = true,
    maxVisiblePages = 5
}) => {
    const getVisiblePages = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const sidePages = Math.floor((maxVisiblePages - 3) / 2);
        const leftPages = Math.min(currentPage - 1, sidePages);
        const rightPages = Math.min(totalPages - currentPage, sidePages);

        // Add first page
        pages.push(1);

        // Add ellipsis if needed
        if (currentPage - leftPages > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = currentPage - leftPages; i <= currentPage + rightPages; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        // Add ellipsis if needed
        if (currentPage + rightPages < totalPages - 1) {
            pages.push('...');
        }

        // Add last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <Container>
            {showFirstLast && (
                <PageButton
                    size={size}
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    &lt;&lt;
                </PageButton>
            )}
            <PageButton
                size={size}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </PageButton>

            {getVisiblePages().map((page, index) => (
                typeof page === 'number' ? (
                    <PageButton
                        key={index}
                        size={size}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </PageButton>
                ) : (
                    <Ellipsis key={index} size={size}>
                        {page}
                    </Ellipsis>
                )
            ))}

            <PageButton
                size={size}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </PageButton>
            {showFirstLast && (
                <PageButton
                    size={size}
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    &gt;&gt;
                </PageButton>
            )}

            <PageInfo size={size}>
                Page {currentPage} of {totalPages}
            </PageInfo>
        </Container>
    );
}; 
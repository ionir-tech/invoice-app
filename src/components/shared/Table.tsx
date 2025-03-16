import React from 'react';
import styled, { css } from 'styled-components';

interface Column<T> {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    onRowClick?: (item: T) => void;
    selectedRow?: string;
}

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
`;

const TableHeader = styled.th<{ sortable?: boolean; width?: string }>`
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
    ${props => props.width && css`width: ${props.width};`}
    
    ${props => props.sortable && css`
        cursor: pointer;
        user-select: none;
        
        &:hover {
            background-color: #f3f4f6;
        }
    `}
`;

const TableRow = styled.tr<{ clickable?: boolean; selected?: boolean }>`
    &:not(:last-child) {
        border-bottom: 1px solid #e5e7eb;
    }
    
    ${props => props.clickable && css`
        cursor: pointer;
        
        &:hover {
            background-color: #f9fafb;
        }
    `}
    
    ${props => props.selected && css`
        background-color: #e5e7eb;
        
        &:hover {
            background-color: #e5e7eb;
        }
    `}
`;

const TableCell = styled.td`
    padding: 12px 16px;
    color: #4b5563;
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SortIcon = styled.span<{ direction?: 'asc' | 'desc' }>`
    margin-left: 4px;
    
    &::after {
        content: '${props => props.direction === 'asc' ? '↑' : '↓'}';
    }
`;

export function Table<T extends { id: string }>({
    columns,
    data,
    loading,
    sortColumn,
    sortDirection,
    onSort,
    onRowClick,
    selectedRow
}: TableProps<T>) {
    return (
        <TableContainer>
            <StyledTable>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <TableHeader
                                key={column.key}
                                sortable={column.sortable}
                                width={column.width}
                                onClick={() => column.sortable && onSort?.(column.key)}
                            >
                                {column.title}
                                {column.sortable && sortColumn === column.key && (
                                    <SortIcon direction={sortDirection} />
                                )}
                            </TableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <TableRow
                            key={item.id}
                            clickable={!!onRowClick}
                            selected={selectedRow === item.id}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map(column => (
                                <TableCell key={`${item.id}-${column.key}`}>
                                    {column.render
                                        ? column.render(item)
                                        : (item as any)[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </tbody>
            </StyledTable>
            {loading && (
                <LoadingOverlay>
                    Loading...
                </LoadingOverlay>
            )}
        </TableContainer>
    );
} 
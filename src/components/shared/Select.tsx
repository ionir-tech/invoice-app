import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: Option[];
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    multiple?: boolean;
    searchable?: boolean;
    size?: 'small' | 'medium' | 'large';
    maxHeight?: string;
}

const Container = styled.div`
    position: relative;
    width: 100%;
`;

const SelectButton = styled.button<{ hasError?: boolean; isOpen?: boolean; size: string }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
    border-radius: 6px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.6 : 1};
    transition: all 0.2s;
    text-align: left;
    
    ${props => {
        switch (props.size) {
            case 'small':
                return css`padding: 6px 12px; font-size: 14px;`;
            case 'large':
                return css`padding: 12px 16px; font-size: 16px;`;
            default:
                return css`padding: 8px 14px; font-size: 15px;`;
        }
    }}
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    ${props => props.isOpen && css`
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    `}
`;

const Chevron = styled.span<{ isOpen: boolean }>`
    border-style: solid;
    border-width: 0.15em 0.15em 0 0;
    content: '';
    display: inline-block;
    height: 0.45em;
    width: 0.45em;
    position: relative;
    transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'rotate(135deg)'};
    transition: transform 0.2s ease;
    vertical-align: middle;
    margin-left: 8px;
`;

const DropdownContainer = styled.div<{ maxHeight?: string }>`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: ${props => props.maxHeight || '250px'};
    overflow-y: auto;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    
    &:focus {
        outline: none;
    }
`;

const OptionsList = styled.div`
    padding: 4px 0;
`;

const OptionItem = styled.div<{ isSelected?: boolean; isDisabled?: boolean }>`
    padding: 8px 12px;
    cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
    background: ${props => props.isSelected ? '#f3f4f6' : 'transparent'};
    color: ${props => props.isDisabled ? '#9ca3af' : '#1f2937'};
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
        background: ${props => !props.isDisabled && '#f9fafb'};
    }
`;

const Checkbox = styled.div<{ checked?: boolean }>`
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.checked ? '#3b82f6' : '#d1d5db'};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background: ${props => props.checked ? '#3b82f6' : 'transparent'};
    
    &:after {
        content: '';
        width: 6px;
        height: 6px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        opacity: ${props => props.checked ? 1 : 0};
    }
`;

const ErrorText = styled.span`
    color: #ef4444;
    font-size: 14px;
    margin-top: 4px;
    display: block;
`;

const SelectedValue = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
`;

const Tag = styled.span`
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const RemoveTag = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #6b7280;
    font-size: 14px;
    display: flex;
    align-items: center;
    
    &:hover {
        color: #ef4444;
    }
`;

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    disabled = false,
    error,
    multiple = false,
    searchable = false,
    size = 'medium',
    maxHeight
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (optionValue: string) => {
        if (multiple) {
            const values = Array.isArray(value) ? value : [];
            const newValues = values.includes(optionValue)
                ? values.filter(v => v !== optionValue)
                : [...values, optionValue];
            onChange(newValues);
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (multiple) {
            const values = Array.isArray(value) ? value : [];
            if (values.length === 0) return placeholder;
            return (
                <SelectedValue>
                    {values.map(v => {
                        const option = options.find(opt => opt.value === v);
                        return option ? (
                            <Tag key={v}>
                                {option.label}
                                <RemoveTag
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(v);
                                    }}
                                >
                                    ×
                                </RemoveTag>
                            </Tag>
                        ) : null;
                    })}
                </SelectedValue>
            );
        } else {
            const selectedOption = options.find(opt => opt.value === value);
            return selectedOption ? selectedOption.label : placeholder;
        }
    };

    return (
        <Container ref={containerRef}>
            <SelectButton
                onClick={() => !disabled && setIsOpen(!isOpen)}
                hasError={!!error}
                disabled={disabled}
                isOpen={isOpen}
                size={size}
            >
                {getDisplayValue()}
                <Chevron isOpen={isOpen} />
            </SelectButton>

            {isOpen && (
                <DropdownContainer maxHeight={maxHeight}>
                    {searchable && (
                        <SearchInput
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                    <OptionsList>
                        {filteredOptions.map(option => (
                            <OptionItem
                                key={option.value}
                                isSelected={multiple
                                    ? Array.isArray(value) && value.includes(option.value)
                                    : value === option.value
                                }
                                isDisabled={option.disabled}
                                onClick={() => !option.disabled && handleOptionClick(option.value)}
                            >
                                {multiple && <Checkbox checked={Array.isArray(value) && value.includes(option.value)} />}
                                {option.label}
                            </OptionItem>
                        ))}
                        {filteredOptions.length === 0 && (
                            <OptionItem>No options found</OptionItem>
                        )}
                    </OptionsList>
                </DropdownContainer>
            )}

            {error && <ErrorText>{error}</ErrorText>}
        </Container>
    );
}; 
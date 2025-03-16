import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    disabled?: boolean;
    format?: string;
}

const Container = styled.div`
    position: relative;
    display: inline-block;
`;

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #1f2937;
    width: 200px;
    cursor: pointer;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
    }
`;

const Calendar = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 280px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const MonthYear = styled.span`
    font-weight: 500;
    color: #1f2937;
`;

const Button = styled.button`
    background: none;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    color: #6b7280;
    
    &:hover {
        color: #374151;
    }
    
    &:disabled {
        color: #d1d5db;
        cursor: not-allowed;
    }
`;

const WeekDays = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
`;

const WeekDay = styled.span`
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
`;

const Days = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

const Day = styled.button<{ isToday?: boolean; isSelected?: boolean; isOutsideMonth?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    background: ${props => props.isSelected ? '#3b82f6' : 'transparent'};
    color: ${props => {
        if (props.isSelected) return 'white';
        if (props.isOutsideMonth) return '#d1d5db';
        return '#1f2937';
    }};
    font-weight: ${props => props.isToday ? '600' : 'normal'};
    
    &:hover {
        background: ${props => props.isSelected ? '#2563eb' : '#f3f4f6'};
    }
    
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        background: transparent;
    }
`;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    minDate,
    maxDate,
    placeholder = 'Select date',
    disabled = false,
    format = 'MM/dd/yyyy'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value || new Date());
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

    const formatDate = (date: Date): string => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return format.replace('MM', month).replace('dd', day).replace('yyyy', year.toString());
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];

        // Add days from previous month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const day = new Date(year, month, -i);
            days.unshift(day);
        }

        // Add days of current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        // Add days from next month
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date): boolean => {
        return value ? date.toDateString() === value.toDateString() : false;
    };

    const isOutsideMonth = (date: Date): boolean => {
        return date.getMonth() !== currentDate.getMonth();
    };

    const isDisabled = (date: Date): boolean => {
        if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
        if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
        return false;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleSelectDate = (date: Date) => {
        onChange(date);
        setIsOpen(false);
    };

    return (
        <Container ref={containerRef}>
            <Input
                type="text"
                value={value ? formatDate(value) : ''}
                placeholder={placeholder}
                onClick={() => !disabled && setIsOpen(true)}
                readOnly
                disabled={disabled}
            />
            {isOpen && (
                <Calendar>
                    <Header>
                        <Button onClick={handlePrevMonth}>&lt;</Button>
                        <MonthYear>
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </MonthYear>
                        <Button onClick={handleNextMonth}>&gt;</Button>
                    </Header>
                    <WeekDays>
                        {WEEKDAYS.map(day => (
                            <WeekDay key={day}>{day}</WeekDay>
                        ))}
                    </WeekDays>
                    <Days>
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <Day
                                key={index}
                                isToday={isToday(date)}
                                isSelected={isSelected(date)}
                                isOutsideMonth={isOutsideMonth(date)}
                                disabled={isDisabled(date)}
                                onClick={() => handleSelectDate(date)}
                            >
                                {date.getDate()}
                            </Day>
                        ))}
                    </Days>
                </Calendar>
            )}
        </Container>
    );
}; 
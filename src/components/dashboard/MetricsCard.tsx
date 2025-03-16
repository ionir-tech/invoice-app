import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface MetricsCardProps {
    title: string;
    value: string;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, color }) => {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                >
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography
                        variant="h4"
                        component="div"
                        color={`${color}.main`}
                        sx={{ fontWeight: 'bold' }}
                    >
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MetricsCard; 
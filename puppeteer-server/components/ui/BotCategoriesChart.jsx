import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box } from '@mui/material';
import { getBotDistributionByType } from '../../services/apiService';

const BotCategoriesChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBotDistributionByType(startDate, endDate);
        setData(result);
      } catch (error) {
        console.error('Error fetching bot categories data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bot_type" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              return name === 'percentage' ? `${value}%` : value;
            }}
          />
          <Legend />
          <Bar 
            dataKey="total" 
            fill="#8884d8" 
            name="Total Requests"
          />
          <Bar 
            dataKey="percentage" 
            fill="#82ca9d" 
            name="Percentage (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BotCategoriesChart;
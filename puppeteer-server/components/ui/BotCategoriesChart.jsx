import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box } from '@mui/material';
import { getBotDistributionByCategory } from '../../services/apiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BotCategoriesChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBotDistributionByCategory(startDate, endDate);
        // Convert string numbers to actual numbers
        const formattedData = result.map(item => ({
          ...item,
          total: parseInt(item.total),
          percentage: parseFloat(item.percentage)
        }));
        setData(formattedData);
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
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="bot_type"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={0}
            paddingAngle={5}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              props.payload.bot_type
            ]}
          />
          <Legend 
            formatter={(value, entry) => entry.payload.bot_type}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BotCategoriesChart;
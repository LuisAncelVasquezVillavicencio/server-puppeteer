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
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="bot_category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ bot_category, percentage }) => `${bot_category} (${percentage}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              `Total: ${value} (${props.payload.percentage}%)`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BotCategoriesChart;
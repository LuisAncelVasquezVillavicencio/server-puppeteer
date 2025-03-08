import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box } from '@mui/material';
import { getDailyBotActivity } from '../../services/apiService';

const BotActivityChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDailyBotActivity(startDate, endDate);
        setData(result);
      } catch (error) {
        console.error('Error fetching bot activity data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bot_requests"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Peticiones Bot "
          />
          <Line
            type="monotone"
            dataKey="user_requests"
            stroke="#82ca9d"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Peticiones Usuarios"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BotActivityChart;
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
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import { getDailyBotActivity } from '../../services/apiService';

const TIME_FORMATS = {
  MINUTE: 'mm',
  HOUR: 'HH:mm',
  DAY: 'MM/DD',
  MONTH: 'MM/YYYY',
  YEAR: 'YYYY'
};

const BotActivityChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [timeGranularity, setTimeGranularity] = useState('DAY');

  const handleGranularityChange = (event, newGranularity) => {
    if (newGranularity !== null) {
      setTimeGranularity(newGranularity);
    }
  };

  const formatData = (rawData) => {
    if (!rawData) return [];
    
    // Group data based on selected granularity
    const groupedData = rawData.reduce((acc, item) => {
      const date = new Date(item.timestamp);
      let key;
      
      switch (timeGranularity) {
        case 'MINUTE':
          key = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
          break;
        case 'HOUR':
          key = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          break;
        case 'MONTH':
          key = date.toISOString().slice(0, 7); // YYYY-MM
          break;
        case 'YEAR':
          key = date.toISOString().slice(0, 4); // YYYY
          break;
        default: // DAY
          key = date.toISOString().slice(0, 10); // YYYY-MM-DD
      }

      if (!acc[key]) {
        acc[key] = {
          fecha: key,
          bot_requests: 0,
          user_requests: 0
        };
      }

      if (item.isbot === 'true') {
        acc[key].bot_requests++;
      } else {
        acc[key].user_requests++;
      }

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDailyBotActivity(startDate, endDate);
        const formattedData = formatData(result);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching bot activity data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, timeGranularity]);

  return (
    <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 0, top: -45, zIndex: 1 }}>
        <Paper sx={{ p: 1 }}>
          <ToggleButtonGroup
            value={timeGranularity}
            exclusive
            onChange={handleGranularityChange}
            size="small"
          >
            <ToggleButton value="MINUTE">Minuto</ToggleButton>
            <ToggleButton value="HOUR">Hora</ToggleButton>
            <ToggleButton value="DAY">Día</ToggleButton>
            <ToggleButton value="MONTH">Mes</ToggleButton>
            <ToggleButton value="YEAR">Año</ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="fecha"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleString('es', {
                minute: timeGranularity === 'MINUTE' ? 'numeric' : undefined,
                hour: ['MINUTE', 'HOUR'].includes(timeGranularity) ? 'numeric' : undefined,
                day: ['DAY'].includes(timeGranularity) ? 'numeric' : undefined,
                month: ['DAY', 'MONTH'].includes(timeGranularity) ? 'short' : undefined,
                year: timeGranularity === 'YEAR' ? 'numeric' : undefined
              });
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleString('es', {
                minute: timeGranularity === 'MINUTE' ? 'numeric' : undefined,
                hour: ['MINUTE', 'HOUR'].includes(timeGranularity) ? 'numeric' : undefined,
                day: ['DAY'].includes(timeGranularity) ? 'numeric' : undefined,
                month: ['DAY', 'MONTH'].includes(timeGranularity) ? 'short' : undefined,
                year: true
              });
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="bot_requests"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Peticiones Bot"
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
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea
} from 'recharts';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography
} from '@mui/material';
import { getDailyBotActivity } from '../../services/apiService';

const getDateFormat = (timeGranularity) => {
  switch (timeGranularity) {
    case 'SECOND':
      return { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    case 'MINUTE':
      return { hour: '2-digit', minute: '2-digit' };
    case 'HOUR':
      return { hour: '2-digit' };
    case 'DAY':
      return { month: 'short', day: 'numeric' };
    case 'MONTH':
      return { year: 'numeric', month: 'short' };
    case 'YEAR':
      return { year: 'numeric' };
    default:
      return { month: 'short', day: 'numeric' };
  }
};

const BotActivityChart = ({ startDate, endDate, onDateRangeChange }) => {
  const [data, setData] = useState([]);
  const [timeGranularity, setTimeGranularity] = useState('DAY');
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const handleGranularityChange = (event, newGranularity) => {
    if (newGranularity !== null) {
      setTimeGranularity(newGranularity);
    }
  };

 

  const handleMouseDown = (e) => {
    if (e && e.activeLabel) {
      setSelectionStart(e.activeLabel);
      setSelectionEnd(null);
      setSelectedData(null);
    }
  };

  const handleMouseMove = (e) => {
    if (selectionStart && e && e.activeLabel) {
      setSelectionEnd(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (selectionStart && selectionEnd) {
      const startIndex = data.findIndex(item => item.fecha === selectionStart);
      const endIndex = data.findIndex(item => item.fecha === selectionEnd);
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      const selection = data.slice(start, end + 1);
      
      if (onDateRangeChange && selection.length > 0) {
        const newStartDate = new Date(selection[0].fecha);
        const newEndDate = new Date(selection[selection.length - 1].fecha);
        onDateRangeChange(newStartDate, newEndDate);
      }

      setSelectedData({
        range: selection,
        stats: {
          totalBots: selection.reduce((sum, item) => sum + item.bot_requests, 0),
          totalUsers: selection.reduce((sum, item) => sum + item.user_requests, 0),
          timeRange: `${selection[0].fecha} - ${selection[selection.length-1].fecha}`
        }
      });
    }
    setSelectionStart(null);
    setSelectionEnd(null);
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
  
  const formatData = (rawData) => {
    if (!rawData) return [];
    
    const groupedData = rawData.reduce((acc, item) => {
      const date = new Date(item.timestamp);
      let key;
      
      switch (timeGranularity) {
        case 'SECOND':
          key = date.toISOString().slice(0, 19);
          break;
        case 'MINUTE':
          key = date.toISOString().slice(0, 16);
          break;
        case 'HOUR':
          // Corregir el formato para hora
          key = date.toISOString().slice(0, 13) + ':00:00';
          break;
        case 'MONTH':
          key = date.toISOString().slice(0, 7);
          break;
        case 'YEAR':
          key = date.toISOString().slice(0, 4);
          break;
        default:
          key = date.toISOString().slice(0, 10);
      }
  
      // ... resto del código ...
    }, {});
  
    return Object.values(groupedData);
  };
  
  // Actualizar el formateador de fechas
  const formatDate = (dateString, timeGranularity) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Fecha inválida';
      }
      
      const options = {
        ...getDateFormat(timeGranularity),
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
  
      if (['SECOND', 'MINUTE', 'HOUR'].includes(timeGranularity)) {
        options.hour = '2-digit';
        options.minute = timeGranularity !== 'HOUR' ? '2-digit' : undefined;
        options.second = timeGranularity === 'SECOND' ? '2-digit' : undefined;
      }
  
      return date.toLocaleString('es', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 0, top: -45, zIndex: 1 }}>
        <Paper sx={{ p: 1, background: 'linear-gradient(to bottom, #080e20, #0d1528)' }}>
          <ToggleButtonGroup
            value={timeGranularity}
            exclusive
            onChange={handleGranularityChange}
            size="small"
          >
            <ToggleButton value="SECOND">Seg</ToggleButton>
            <ToggleButton value="MINUTE">Min</ToggleButton>
            <ToggleButton value="HOUR">Hr</ToggleButton>
            <ToggleButton value="DAY">Día</ToggleButton>
            <ToggleButton value="MONTH">Mes</ToggleButton>
            <ToggleButton value="YEAR">Año</ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      <ResponsiveContainer>
        <LineChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="fecha"
            tickFormatter={(value) => formatDate(value, timeGranularity)}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => formatDate(value, timeGranularity)}
            contentStyle={{
              backgroundColor: '#080f1d',
              border: '1px solid #8000e9',
            }}
          />
          <Legend />
          {selectionStart && selectionEnd && (
            <ReferenceArea
              x1={selectionStart}
              x2={selectionEnd}
              strokeOpacity={0.3}
              fill="#8884d8"
              fillOpacity={0.1}
            />
          )}
          <Line
            type="monotone"
            dataKey="bot_requests"
            stroke="#B834F3"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Peticiones Bot"
          />
          <Line
            type="monotone"
            dataKey="user_requests"
            stroke="#0EF5E3"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Peticiones Usuarios"
          />
        </LineChart>
      </ResponsiveContainer>
      {selectedData && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: 'rgba(8, 15, 29, 0.8)',
          borderRadius: 1,
          border: '1px solid #8000e9'
        }}>
          <Typography variant="subtitle1" color="#0EF5E3">
            Datos Seleccionados:
          </Typography>
          <Typography variant="body2" color="#fff">
            Rango: {selectedData.stats.timeRange}
          </Typography>
          <Typography variant="body2" color="#B834F3">
            Total Bots: {selectedData.stats.totalBots}
          </Typography>
          <Typography variant="body2" color="#0EF5E3">
            Total Usuarios: {selectedData.stats.totalUsers}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BotActivityChart;
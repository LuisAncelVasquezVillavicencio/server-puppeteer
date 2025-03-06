// BotActivityChart.jsx

import React from 'react';
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

const BotActivityChart = () => {
  // Datos de ejemplo; reemplázalos con tus datos reales
  const data = [
    { fecha: '03/01', total: 10 },
    { fecha: '03/02', total: 15 },
    { fecha: '03/03', total: 12 },
    { fecha: '03/04', total: 20 },
    { fecha: '03/05', total: 25 },
    { fecha: '03/06', total: 18 },
    { fecha: '03/07', total: 22 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          {/* Líneas de la cuadrícula */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* Ejes X e Y */}
          <XAxis dataKey="fecha" />
          <YAxis />
          {/* Tooltip y leyenda */}
          <Tooltip />
          <Legend />
          {/* Línea principal con animación */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={true}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BotActivityChart;

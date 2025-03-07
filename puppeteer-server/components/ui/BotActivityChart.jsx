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
    <div
      style={{
        width: '100%',
        height: 300,
        // Gradiente de arriba (#080e20) hacia abajo (#0d1528)
        background: 'linear-gradient(to bottom, #080e20, #0d1528)',
        // Borde de 1px con color #8000e9
        border: '1px solid #8000e9',
        // Sombra difuminada de color #8000e9
        boxShadow: '0 0 10px #8000e9',
        // Bordes redondeados a 8px
        borderRadius: '8px',
        // Un pequeño relleno interno para que el gráfico no pegue al borde
        padding: '16px',
      }}
    >
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
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

import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const mockData = {
  socialStats: [
    { platform: 'Instagram', color: '#E1306C', followers: '457K', change: '-1.5%', trend: 'down' },
    { platform: 'LinkedIn', color: '#0077B5', followers: '457K', change: '-1.5%', trend: 'down' },
    { platform: 'Facebook', color: '#1877F2', followers: '2.1K', change: '-1.9%', trend: 'down' },
    { platform: 'Twitter', color: '#1DA1F2', followers: '2.1K', change: '+1.9%', trend: 'up' },
    { platform: 'YouTube', color: '#FF0000', followers: '1.1M', change: '+1.9%', trend: 'up' },
    { platform: 'Messenger', color: '#0084FF', followers: '1.1M', change: '+1.9%', trend: 'up' },
  ],
  devicesData: [
    { name: 'Mobile', value: 1754, color: '#6C5DD3' },
    { name: 'Tablet', value: 1234, color: '#1EAE98' },
    { name: 'Desktop', value: 878, color: '#FF4D4D' },
  ]
};

export default function Dashboard() {
  const [startupLogs, setStartupLogs] = useState('');
  const [pm2Logs, setPm2Logs] = useState('');


  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.hostname}/ws`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'startup') {
        setStartupLogs((prevLogs) => prevLogs + message.log);
      } else if (message.type === 'pm2') {
        setPm2Logs((prevLogs) => prevLogs + "\n" + message.log);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Grid sx={{ p: 2, background: "#2d2d30" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {mockData.socialStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    background: "#19191c"
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: stat.color, fontWeight: 500 }}>
                      {stat.platform}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {stat.followers}
                    </Typography>
                    <Box display="flex" mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Followers
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ ml: 2, color: stat.trend === 'up' ? 'success.main' : 'error.main' }}
                      >
                        {stat.trend === 'up' ? (
                          <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                        <Typography variant="body2" ml={0.5}>
                          {stat.change}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
            {/* Aquí podrías agregar otro contenido si lo necesitas */}
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ p: 2, background: "#2d2d30" }}>
        <Typography variant="h5" gutterBottom>
          Logs del Servidor
        </Typography>
        {/* Card para Startup Script Logs */}
        <Card sx={{ mt: 2, borderRadius: 2, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Startup Script Logs
            </Typography>
            <Box
              sx={{
                maxHeight:  200,
                overflowY: 'auto',
                backgroundColor: '#f5f5f5',
                p: 1,
                borderRadius: 1,
                backgroundColor: '#000', // Fondo negro
                color: '#fff',         // Texto blanco
              }}
            >
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {startupLogs}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Card para PM2 Logs */}
        <Card sx={{ mt: 2, borderRadius: 2, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              PM2 Logs
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                backgroundColor: '#f5f5f5',
                p: 1,
                borderRadius: 1,
                backgroundColor: '#000', // Fondo negro
                color: '#fff',         // Texto blanco
              }}
            >
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {pm2Logs}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

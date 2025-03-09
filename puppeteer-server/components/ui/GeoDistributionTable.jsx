import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { Globe, MapPin } from 'lucide-react';
import { getBotGeoDistribution } from '../../services/apiService';

function GeoDistributionTable() {
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        // You can adjust the date range as needed
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days

        const data = await getBotGeoDistribution(startDate.toISOString(), endDate.toISOString());
        setGeoData(data);
      } catch (error) {
        console.error('Error fetching geo distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  if (loading) {
    return (
      <Paper variant="cosmicCard" sx={{ p: 3, height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper variant="cosmicCard" sx={{ p: 3, height: '400px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Globe size={24} color="#10b981" />
        <Typography variant="h6">Distribución por País</Typography>
      </Box>

      {/* Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr 1fr 2fr',
        gap: 2,
        mb: 2,
        color: '#94a3b8'
      }}>
        <Typography>País</Typography>
        <Typography>Visitas</Typography>
        <Typography>Porcentaje</Typography>
        <Typography>Tipos de Bots</Typography>
      </Box>

      {/* Rows */}
      <Stack spacing={2} sx={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }}>
        {geoData.map((item, index) => (
          <Box key={item.code} sx={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr',
            gap: 2,
            alignItems: 'center',
            py: 1,
            borderBottom: index !== geoData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={18} color="#64748b" />
              <Typography>{item.country}</Typography>
              <Chip 
                label={item.code} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  height: '20px',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
            <Typography sx={{ color: '#10b981' }}>{item.visits}</Typography>
            <Typography>{`${item.percentage.toFixed(1)}%`}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {item.bots.map((bot) => (
                <Chip 
                  key={bot}
                  label={bot}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    height: '24px'
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default GeoDistributionTable;
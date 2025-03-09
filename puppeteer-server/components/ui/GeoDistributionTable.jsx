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

function GeoDistributionTable({ startDate, endDate }) {
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBot, setIsBot] = useState(true);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const data = await getBotGeoDistribution(startDate, endDate, isBot);
        setGeoData(data || []);
      } catch (error) {
        console.error('Error fetching geo distribution:', error);
        setGeoData([]);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchGeoData();
    }
  }, [startDate, endDate, isBot]);

  // ... loading check remains the same ...

  return (
    <Paper variant="cosmicCard" sx={{ p: 3, height: '400px' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Globe size={24} color="#10b981" />
          <Typography variant="h6">Distribución por País</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={isBot}
              onChange={(e) => setIsBot(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#10b981',
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#10b981',
                },
              }}
            />
          }
          label={isBot ? "Bots" : "Usuarios"}
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#94a3b8',
              fontSize: '0.875rem'
            }
          }}
        />
      </Box>


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

      <Stack spacing={2} sx={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }}>
        {Array.isArray(geoData) && geoData.map((item, index) => (
          <Box key={item?.code || index} sx={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr',
            gap: 2,
            alignItems: 'center',
            py: 1,
            borderBottom: index !== geoData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={18} color="#64748b" />
              <Typography>{item?.country || 'Unknown'}</Typography>
              <Chip 
                label={item?.code || 'N/A'} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  height: '20px',
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
            <Typography sx={{ color: '#10b981' }}>{item?.visits || 0}</Typography>
            <Typography>{`${item?.percentage || 0}%`}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.isArray(item?.bots) && item.bots.map((bot) => (
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
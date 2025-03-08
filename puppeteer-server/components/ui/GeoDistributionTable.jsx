import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { Globe, MapPin } from 'lucide-react';

// Mock data - Replace with real data later
const mockData = [
  { 
    country: 'Estados Unidos', 
    code: 'US', 
    visits: 14, 
    percentage: 58.3, 
    bots: ['Google', 'Bing']
  },
  { 
    country: 'Perú', 
    code: 'PE', 
    visits: 6, 
    percentage: 25, 
    bots: ['WhatsApp']
  },
  { 
    country: 'España', 
    code: 'ES', 
    visits: 2, 
    percentage: 8.3, 
    bots: ['Facebook', 'Twitter']
  },
  { 
    country: 'México', 
    code: 'MX', 
    visits: 1, 
    percentage: 4.2, 
    bots: ['Facebook']
  },
  { 
    country: 'Colombia', 
    code: 'CO', 
    visits: 1, 
    percentage: 4.2, 
    bots: ['WhatsApp']
  }
];

function GeoDistributionTable() {
  return (
    <Paper variant="cosmicCard" sx={{ p: 3 }}>
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
      <Stack spacing={2}>
        {mockData.map((item, index) => (
          <Box key={item.code} sx={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr',
            gap: 2,
            alignItems: 'center',
            py: 1,
            borderBottom: index !== mockData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
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
            <Typography>{`${item.percentage}%`}</Typography>
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
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Chip,
} from '@mui/material';
import { Link as LinkIcon } from 'lucide-react';

const MostVisitedURLsTable = () => {
  const urlData = [
    {
      url: 'https://micanva.com/',
      visits: 8,
      uniqueBots: 2,
      lastVisit: '5/3/2025 9:09:23'
    },
    {
      url: 'https://mivisualization.com/',
      visits: 6,
      uniqueBots: 2,
      lastVisit: '5/3/2025 10:16:05'
    },
    {
      url: 'https://mivisualization.com/dashboard',
      visits: 3,
      uniqueBots: 2,
      lastVisit: '5/3/2025 13:17:32'
    },
    {
      url: 'http://micanva.com/',
      visits: 2,
      uniqueBots: 1,
      lastVisit: '5/3/2025 12:35:46'
    }
  ];

  return (
    <Card variant="cosmicCard" sx={{ height: '400px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LinkIcon size={20} color="#818cf8" />
          <Typography variant="h6" component="div">
            URLs Más Visitadas
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 0.8fr 0.8fr 1fr',
            gap: 2,
            px: 2,
            py: 1,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>URL</Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Visitas</Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Bots</Typography>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>Última Visita</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
            {urlData.map((row, index) => (
              <Box key={index} sx={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 0.8fr 0.8fr 1fr',
                gap: 2,
                px: 2,
                py: 1.5,
                alignItems: 'center',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.03)'
                },
                borderBottom: index !== mockData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <Link 
                  href={row.url} 
                  target="_blank" 
                  rel="noopener"
                  sx={{ 
                    color: '#818cf8',
                    textDecoration: 'none',
                    '&:hover': { 
                      color: '#B834F3',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {row.url}
                </Link>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={row.visits}
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(135deg, #B834F3 0%, #818cf8 100%)',
                      color: 'white',
                      minWidth: '45px'
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={row.uniqueBots}
                    size="small"
                    sx={{
                      border: '1px solid #818cf8',
                      color: '#818cf8',
                      backgroundColor: 'transparent',
                      minWidth: '45px'
                    }}
                  />
                </Box>
                <Typography sx={{ color: 'text.secondary', textAlign: 'right' }}>
                  {row.lastVisit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MostVisitedURLsTable;
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Chip,
  Stack
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
    // ... rest of the data
  ];

  return (
    <Card 
      variant="cosmicCard" 
      sx={{ 
        height: '400px',
        background: 'linear-gradient(135deg, rgba(13,17,31,0.9) 0%, rgba(28,23,43,0.9) 100%)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent sx={{ height: '100%', p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 3,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          pb: 2
        }}>
          <LinkIcon size={24} color="#818cf8" />
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            URLs Más Visitadas
          </Typography>
        </Box>

        <Stack 
          spacing={2} 
          sx={{ 
            maxHeight: 'calc(100% - 70px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
            }
          }}
        >
          {urlData.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.02)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }
              }}
            >
              <Box sx={{ flex: 1, mr: 2 }}>
                <Link 
                  href={row.url} 
                  target="_blank" 
                  rel="noopener"
                  sx={{ 
                    color: '#818cf8',
                    textDecoration: 'none',
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: '#B834F3'
                    }
                  }}
                >
                  {row.url}
                </Link>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={`${row.visits} visitas`}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(135deg, #B834F3 0%, #818cf8 100%)',
                    color: 'white',
                    minWidth: '80px',
                    fontWeight: 500
                  }}
                />
                <Chip 
                  label={`${row.uniqueBots} bots`}
                  size="small"
                  sx={{
                    border: '1px solid #818cf8',
                    color: '#818cf8',
                    backgroundColor: 'transparent',
                    minWidth: '70px'
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', minWidth: '140px', textAlign: 'right' }}>
                  {row.lastVisit}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MostVisitedURLsTable;
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Chip,
  CircularProgress
} from '@mui/material';
import { Link as LinkIcon } from 'lucide-react';
import { getMostVisitedUrls } from '../../services/apiService';

const MostVisitedURLsTable = ({ startDate, endDate }) => {
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMostVisitedUrls(startDate, endDate);
        setUrlData(data);
      } catch (error) {
        console.error('Error fetching most visited URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <Card variant="cosmicCard" sx={{ p: 3, height: '400px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LinkIcon size={20} color="#818cf8" />
          <Typography variant="h6" component="div">
            URLs Más Visitadas
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Rest of your existing table structure */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 0.8fr 0.8fr 1fr',
              gap: 2,
              px: 2,
              py: 1
            }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>URL</Typography>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Visitas</Typography>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Bots</Typography>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>Última Visita</Typography>
            </Box>

            <Box sx={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }} >
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
                  borderBottom: index !== urlData.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
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
                    {new Date(row.lastVisit).toLocaleString('es')}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MostVisitedURLsTable;
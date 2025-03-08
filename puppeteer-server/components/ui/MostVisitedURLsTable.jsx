import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Chip
} from '@mui/material';
import { Link as LinkIcon } from 'lucide-react';

const MostVisitedURLsTable = () => {
  // Mock data - replace with API data later
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
    <Card variant="cosmicCard">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LinkIcon size={20} color="#818cf8" />
          <Typography variant="h6" component="div">
            URLs Más Visitadas
          </Typography>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell align="center">Visitas</TableCell>
              <TableCell align="center">Bots Únicos</TableCell>
              <TableCell align="right">Última Visita</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urlData.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Link 
                    href={row.url} 
                    target="_blank" 
                    rel="noopener"
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {row.url}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={row.visits}
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.dark',
                      color: 'white',
                      minWidth: '30px'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={row.uniqueBots}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary' }}>
                  {row.lastVisit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MostVisitedURLsTable;
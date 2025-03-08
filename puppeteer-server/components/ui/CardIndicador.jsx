import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RobotIcon from '@mui/icons-material/SmartToy';
import SpiderIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';

function CardIndicador({ title, mainValue, description, icon }) {
  // Icon mapping based on title
  const getIcon = () => {
    switch (title) {
      case 'Total Bots':
        return <RobotIcon sx={{ color: '#818cf8' }} />;
      case '% Errores':
        return <ErrorIcon sx={{ color: '#ef4444' }} />;
      case 'Bot Más Activo':
        return <SpiderIcon sx={{ color: '#10b981' }} />;
      default:
        return <SpeedIcon sx={{ color: '#f59e0b' }} />;
    }
  };

  return (
    <Card sx={{ p: 0 }} variant="cosmicCard">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {/* Icon */}
          {getIcon()}
          
          {/* Title with tooltip */}
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 500 }}>
            {title}
          </Typography>
          
          <Tooltip title={description || 'Información del indicador'} arrow placement="top">
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0, ml: 'auto' }}>
              <HelpOutlineIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Main value */}
        <Typography variant="h5" sx={{ fontWeight: 600, ml: 4 }}>
          {mainValue !== null && mainValue !== undefined ? mainValue : 'Cargando...'}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardIndicador;
import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton } from '@mui/material';


import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ActivityIcon from '@mui/icons-material/Timeline';
import RobotIcon from '@mui/icons-material/SmartToy';
import UsersIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import NetworkIcon from '@mui/icons-material/Hub';
import ChartIcon from '@mui/icons-material/BarChart';
import AlertIcon from '@mui/icons-material/Warning';
import BoltIcon from '@mui/icons-material/Bolt';

  

  

function CardIndicador({ title, mainValue, description, icon }) {
  // Icon mapping based on icon prop
  const getIcon = () => {
    switch (icon) {
      case 'activity':
        return <ActivityIcon sx={{ color: "#10b981" }} />;
      case 'bot':
        return <RobotIcon sx={{ color: "#818cf8" }} />;
      case 'users':
        return <UsersIcon sx={{ color: "#f59e0b" }} />;
      case 'link':
        return <LinkIcon sx={{ color: "#8b5cf6" }} />;
      case 'network':
        return <NetworkIcon sx={{ color: "#ec4899" }} />;
      case 'chart':
        return <ChartIcon sx={{ color: "#14b8a6" }} />;
      case 'alert':
        return <AlertIcon sx={{ color: "#ef4444" }} />;
      default:
        return <BoltIcon sx={{ color: "#6366f1" }} />;
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
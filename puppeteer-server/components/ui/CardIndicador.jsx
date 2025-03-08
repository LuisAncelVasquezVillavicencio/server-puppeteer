import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { 
  Activity, 
  Robot, 
  Users, 
  Link2, 
  Network,
  BarChart2,
  AlertTriangle,
  Zap
} from 'lucide-react';

function CardIndicador({ title, mainValue, description, icon }) {
  // Icon mapping based on icon prop
  const getIcon = () => {
    switch (icon) {
      case 'activity':
        return <Activity size={24} color="#10b981" />;
      case 'bot':
        return <Activity size={24} color="#10b981" />;
      case 'users':
        return <Users size={24} color="#f59e0b" />;
      case 'link':
        return <Link2 size={24} color="#8b5cf6" />;
      case 'network':
        return <Network size={24} color="#ec4899" />;
      case 'chart':
        return <BarChart2 size={24} color="#14b8a6" />;
      case 'alert':
        return <AlertTriangle size={24} color="#ef4444" />;
      default:
        return <Zap size={24} color="#6366f1" />;
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
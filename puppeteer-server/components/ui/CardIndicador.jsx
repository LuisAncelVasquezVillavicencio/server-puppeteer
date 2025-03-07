import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Paper } from '@mui/material'; 
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
function CardIndicador({ title, mainValue, extraTitleInfo , extraInfo }) {
  return (

      <Card sx={{ p: 0 }} variant="cosmicCard" >
        <CardContent>
          {/* Título */}
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 500 }}>
            {title}
          </Typography>

          {/* Valor principal (puede ser número, texto, etc.) */}
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {mainValue !== null && mainValue !== undefined ? mainValue : 'Cargando...'}
          </Typography>

          {/* Información adicional (porcentaje, texto o lo que quieras) */}
          {extraInfo && (
            <Box display="flex" mt={1}>
              <Typography variant="body2" color="text.secondary">
                  {extraTitleInfo}
              </Typography>
              <Box
                  display="flex"
                  alignItems="center"
                  sx={{ ml: 2, color:  'success.main'  }}
              >
                  <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                  <Typography variant="body2" ml={0.5}>
                      {extraInfo}
                  </Typography>
              </Box>
              </Box>
          )}
        </CardContent>
      </Card>
 
  );
}

export default CardIndicador;

import React from 'react';
import { 
  Grid, 
  Button, 
  ButtonGroup, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  Box 
} from '@mui/material';

const DashboardFilters = ({ 
  selectedDomain,
  onDomainChange,
  onStartDateChange,
  onEndDateChange,
  onEditRoot,
  onEditXML,
  onLogConnect
}) => {
  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Grid 
        container 
        spacing={2} 
        alignItems="center"
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          '& > *': { my: { xs: 1, sm: 0 } }
        }}
      >
        <Grid item xs={12} sm="auto">
          <ButtonGroup 
            variant="text" 
            aria-label="Basic button group"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > button': {
                flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
                whiteSpace: 'nowrap'
              }
            }}
          >
            <Button onClick={onEditRoot}>Editar root.txt</Button>
            <Button onClick={onEditXML}>Editar XML Sitemap</Button>
            <Button onClick={() => onLogConnect('startup')}>Log Inicio</Button>
            <Button onClick={() => onLogConnect('pm2')}>Log Streaming</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12} sm="auto">
          <FormControl sx={{ width: { xs: '100%', sm: 200 } }} size="small">
            <InputLabel id="domain-select-label">Dominio</InputLabel>
            <Select
              value={selectedDomain}
              labelId="domain-select-label"
              label="Dominio"
              onChange={onDomainChange}
            >
              <MenuItem value="tudominio.com">tudominio.com</MenuItem>
              <MenuItem value="otrodominio.com">otrodominio.com</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm="auto">
          <TextField
            label="Fecha de Inicio"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onStartDateChange(new Date(e.target.value).toISOString())}
            size="small"
            fullWidth
            sx={{ width: { xs: '100%', sm: 200 } }}
          />
        </Grid>

        <Grid item xs={12} sm="auto">
          <TextField
            label="Fecha de Fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => onEndDateChange(new Date(e.target.value).toISOString())}
            size="small"
            fullWidth
            sx={{ width: { xs: '100%', sm: 200 } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardFilters;
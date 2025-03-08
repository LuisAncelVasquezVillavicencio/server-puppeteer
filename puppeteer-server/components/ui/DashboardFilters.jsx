import React from 'react';
import { 
  Grid, 
  Button, 
  ButtonGroup, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField 
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
    <>
      <Grid item xs={12} container spacing={1}>
        <ButtonGroup variant="text" aria-label="Basic button group">
          <Button onClick={onEditRoot}>Editar root.txt</Button>
          <Button onClick={onEditXML}>Editar XML Sitemap</Button>
          <Button onClick={() => onLogConnect('startup')}>Log Inicio</Button>
          <Button onClick={() => onLogConnect('pm2')}>Log Streaming</Button>
        </ButtonGroup>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
          <Grid item>
            <TextField
              label="Fecha de Inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => onStartDateChange(new Date(e.target.value).toISOString())}
              size="small"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Fecha de Fin"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => onEndDateChange(new Date(e.target.value).toISOString())}
              size="small"
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardFilters;
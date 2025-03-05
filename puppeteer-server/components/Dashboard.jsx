
import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  ButtonGroup,
  FormControl,
  InputLabel 
} from '@mui/material';
import RotatingText from './RotatingText.jsx';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


// 1. Importa TODAS las funciones del servicio
import {
  getTotalBotRequests,
  getBotDistributionByType,
  getBotDistributionByCategory,
  getBotConnectionTypeDistribution,
  getBotGeoDistribution,
  getUniqueURLs,
  getPercentageErrors,
  getMostActiveBot
} from '../services/apiService';

export default function Dashboard() {

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const [startDate, setStartDate] = useState(oneMonthAgo.toISOString());
  const [endDate, setEndDate] = useState(now.toISOString());
  const [totalRequests, setTotalRequests] = useState(null);
  const [uniqueURLs, setUniqueURLs] = useState(null);
  const [percentageErrors, setPercentageErrors] = useState(null);
  const [mostActiveBot, setMostActiveBot] = useState(null);
  const [botDistributionType, setBotDistributionType] = useState([]);
  const [botDistributionCategory, setBotDistributionCategory] = useState([]);
  const [botConnectionTypeDist, setBotConnectionTypeDist] = useState([]);
  const [botGeoDistribution, setBotGeoDistribution] = useState([]);

  // Función para obtener los datos
  const fetchTotalRequests = async () => {
    try {
      const result = await getTotalBotRequests(startDate, endDate, null, null);
      setTotalRequests(result.current);
    } catch (error) {
      console.error('Error al obtener total de solicitudes:', error);
    }
  };

  const fetchUniqueURLs = async () => {
    try {
      const result = await getUniqueURLs(startDate, endDate);
      setUniqueURLs(result.current);
    } catch (error) {
      console.error('Error al obtener URLs únicas:', error);
    }
  };

  const fetchPercentageErrors = async () => {
    try {
      const result = await getPercentageErrors(startDate, endDate);
      setPercentageErrors(result.current);
    } catch (error) {
      console.error('Error al obtener porcentaje de errores:', error);
    }
  };

  const fetchMostActiveBot = async () => {
    try {
      const result = await getMostActiveBot(startDate, endDate);
      setMostActiveBot(result);
    } catch (error) {
      console.error('Error al obtener el bot más activo:', error);
    }
  };

  // 🔹 Nuevas funciones:
  const fetchBotDistributionByType = async () => {
    try {
      const result = await getBotDistributionByType(startDate, endDate);
      setBotDistributionType(result); // Guardamos en estado
    } catch (error) {
      console.error('Error al obtener distribución por tipo:', error);
    }
  };

  const fetchBotDistributionByCategory = async () => {
    try {
      const result = await getBotDistributionByCategory(startDate, endDate);
      setBotDistributionCategory(result); 
    } catch (error) {
      console.error('Error al obtener distribución por categoría:', error);
    }
  };

  const fetchBotConnectionTypeDistribution = async () => {
    try {
      const result = await getBotConnectionTypeDistribution(startDate, endDate);
      setBotConnectionTypeDist(result);
    } catch (error) {
      console.error('Error al obtener distribución de tipos de conexión:', error);
    }
  };

  const fetchBotGeoDistribution = async () => {
    try {
      const result = await getBotGeoDistribution(startDate, endDate);
      setBotGeoDistribution(result);
    } catch (error) {
      console.error('Error al obtener distribución geográfica:', error);
    }
  };

  // 5. Llamar a todas las funciones cuando cambien las fechas
  useEffect(() => {
    fetchTotalRequests();
    fetchUniqueURLs();
    fetchPercentageErrors();
    fetchMostActiveBot();

    // Llamadas a las nuevas funciones:
    fetchBotDistributionByType();
    fetchBotDistributionByCategory();
    fetchBotConnectionTypeDistribution();
    fetchBotGeoDistribution();
  }, [startDate, endDate]);

  // Estados para los filtros y modales
  const [selectedDomain, setSelectedDomain] = useState('tudominio.com');
  const [openLogModal, setOpenLogModal] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [logType, setLogType] = useState(''); // 'startup' o 'pm2'
  const [wsConnection, setWsConnection] = useState(null);
  
  const [openXMLModal, setOpenXMLModal] = useState(false);
  const [xmlContent, setXmlContent] = useState('<xml>Contenido del sitemap</xml>');
  
  const [openRootModal, setOpenRootModal] = useState(false);
  const [rootContent, setRootContent] = useState('Contenido de root.txt');

  // Manejo del combo de dominios
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  // Función para conectar a WS y abrir modal de logs (solo al hacer click)
  const handleConnectLog = (type) => {
    setLogType(type);
    setLogContent('');
    setOpenLogModal(true);
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.hostname}/ws`);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (type === 'startup' && message.type === 'startup') {
        setLogContent((prev) => prev + message.log);
      } else if (type === 'pm2' && message.type === 'pm2') {
        setLogContent((prev) => prev + "\n" + message.log);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    setWsConnection(ws);
  };

  const handleCloseLogModal = () => {
    setOpenLogModal(false);
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
  };

  // Funciones para abrir/cerrar modales de edición
  const handleEditXML = () => {
    setOpenXMLModal(true);
  };

  const handleCloseXMLModal = () => {
    setOpenXMLModal(false);
  };

  const handleEditRoot = () => {
    setOpenRootModal(true);
  };

  const handleCloseRootModal = () => {
    setOpenRootModal(false);
  };

  return (
    <Grid sx={{ p: 2, background: "#2d2d30" }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        
       
        {/* Filtro de dominio y botones */}
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
          {/* Encabezado */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'left', my: 3, display: 'flex', justifyContent: 'left', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFF' }}>
                      Cloud Renderer
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FFF' }}>
                    <Box sx={{ overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #b20ca0, #8c26b9)', borderRadius: 2, px: 2, py: 1 }}>
                      <RotatingText
                        texts={['Renderizado Web', 'Indexación', 'Optimización', 'SEO Avanzado']}  
                        mainClassName="px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                      />
                    </Box>
                    </Typography>
            </Box>
            <Typography variant="body2">
                Este Dashboard reúne en una sola vista toda la actividad de los bots y redes sociales que rastrean tu sitio, mostrando gráficamente picos de visitas, listados de URLs más consultadas y posibles errores de indexación. Con este enfoque, obtienes una visión rápida y unificada de la salud SEO de tu dominio, facilitando la toma de decisiones para mejorar tu posicionamiento y rendimiento en línea.
            </Typography>
            <Grid item xs={12} container spacing={1}>
                <ButtonGroup variant="text" aria-label="Basic button group">
                  <Button onClick={handleEditRoot} >Editar root.txt </Button>
                  <Button onClick={handleEditXML} >Editar XML Sitemap </Button>
                  <Button  onClick={() => handleConnectLog('startup')} > Log Inicio </Button>
                  <Button  onClick={() => handleConnectLog('pm2')} > Log Streaming </Button>
                </ButtonGroup>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              {/* Combo de dominio */}
                <Grid item xs={12}>
                  <Grid container spacing={2} >
                    <Grid item >
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                          <InputLabel id="demo-select-small-label">Dominio</InputLabel>
                          <Select
                            value={selectedDomain}
                            labelId="demo-select-small-label"
                            label="Age"
                            onChange={handleDomainChange}
                          >
                            <MenuItem value="tudominio.com">tudominio.com</MenuItem>
                            <MenuItem value="otrodominio.com">otrodominio.com</MenuItem>
                            <MenuItem value="tudominio.com">tudominio.com</MenuItem>
                            <MenuItem value="otrodominio.com">otrodominio.com</MenuItem>
                          </Select>
                      </FormControl>
                    </Grid>
                    {/* Controles para seleccionar fecha */}
                    <Grid item >
                        <TextField
                          label="Fecha de Inicio"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
                          size="small"
                        />
                    </Grid>
                    <Grid item >
                        <TextField
                          label="Fecha de Fin"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
                          size="small"
                        />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      background: "#19191c"
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: '#E1306C', fontWeight: 500 }}>
                      Total Bot Requests
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {totalRequests !== null ? totalRequests : 'Cargando...'}
                      </Typography>
                      <Box display="flex" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          Aumento
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ ml: 2, color:  'success.main'  }}
                        >
                            <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                          <Typography variant="body2" ml={0.5}>
                             -1.5%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      background: "#19191c"
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: '#E1306C', fontWeight: 500 }}>
                      URLs Únicas
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {uniqueURLs !== null ? uniqueURLs.total : 'Cargando...'}
                      </Typography>
                      <Box display="flex" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ ml: 2, color:  'success.main'  }}
                        >
                            <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                          <Typography variant="body2" ml={0.5}>
                             -1.5%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      background: "#19191c"
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: '#E1306C', fontWeight: 500 }}>
                      % Errores
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {percentageErrors !== null ? `${percentageErrors.percentage}%` : 'Cargando...'}
                      </Typography>
                      <Box display="flex" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ ml: 2, color:  'success.main'  }}
                        >
                            <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                          <Typography variant="body2" ml={0.5}>
                             -1.5%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            p: 0,
                            position: 'relative',
                            overflow: 'hidden',
                            background: "#19191c"
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ color: '#E1306C', fontWeight: 500 }}>
                            Bot Más Activo
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {mostActiveBot !== null ? mostActiveBot.bot_type : 'Cargando...'} 
                            </Typography>
                            <Box display="flex" mt={1}>
                              <Typography variant="body2" color="text.secondary">
                                {mostActiveBot !== null ? mostActiveBot.ip  : 'Cargando...'}
                              </Typography>
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{ ml: 2, color:  'success.main'  }}
                              >
                                  <ArrowUpwardIcon sx={{ fontSize: '0.8rem' }} />
                                <Typography variant="body2" ml={0.5}>
                                  {mostActiveBot !== null ? mostActiveBot.total_requests : '-'} Peticiones
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                </Grid>
            </Grid>
          </Grid>
        </Grid>

 

        {/* Gráfica de tendencias (Placeholder) */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tendencia de Peticiones
              </Typography>
              <Box sx={{ height: 200, backgroundColor: '#f0f0f0' }}>
                {/* Aquí iría tu componente de gráfico */}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Sección con dos columnas: Bots Activos / URLs Más Rastreadas */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Bots Activos
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography>- Googlebot: 4,500 hits</Typography>
                <Typography>- Bingbot: 1,300 hits</Typography>
                <Typography>- Facebook: 500 hits</Typography>
                <Typography>- WhatsApp: 350 hits</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                URLs Más Rastreadas
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography>1) /producto-share/123 - 450 hits</Typography>
                <Typography>2) /blog/seo-tips - 300 hits</Typography>
                <Typography>3) / - 200 hits</Typography>
                <Typography>4) /robots.txt - 120 hits</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Otra fila: Errores / Social-WhatsApp */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Errores
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography>404 - /old-link (50 ocurrencias)</Typography>
                <Typography>500 - /producto-share/999 (10 ocurrencias)</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Social / WhatsApp
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography>/compartido-wsp - 100 hits</Typography>
                <Typography>/preview-facebook - 80 hits</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Modal para Logs */}
      <Dialog open={openLogModal} onClose={handleCloseLogModal} fullWidth maxWidth="md">
        <DialogTitle>
          {logType === 'startup' ? 'Log de Inicio' : 'Log Streaming Bot'}
        </DialogTitle>
        <DialogContent>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {logContent}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar XML Sitemap */}
      <Dialog open={openXMLModal} onClose={handleCloseXMLModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar XML Sitemap</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={6}
            fullWidth
            variant="outlined"
            value={xmlContent}
            onChange={(e) => setXmlContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseXMLModal}>Cancelar</Button>
          <Button variant="contained" onClick={() => { /* lógica para guardar */ handleCloseXMLModal(); }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar root.txt */}
      <Dialog open={openRootModal} onClose={handleCloseRootModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar root.txt</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={6}
            fullWidth
            variant="outlined"
            value={rootContent}
            onChange={(e) => setRootContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRootModal}>Cancelar</Button>
          <Button variant="contained" onClick={() => { /* lógica para guardar */ handleCloseRootModal(); }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

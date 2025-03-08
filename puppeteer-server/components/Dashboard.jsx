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
import { Sparkles } from 'lucide-react';

import BotActivityChart from './ui/BotActivityChart';
import CardIndicador from './ui/CardIndicador';
import BotCategoriesChart from './ui/BotCategoriesChart';
import DashboardFilters from './ui/DashboardFilters';
import GeoDistributionTable from './ui/GeoDistributionTable';

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
      setTotalRequests(result);
    } catch (error) {
      console.error('Error al obtener total de solicitudes:', error);
    }
  };
  const fetchUniqueURLs = async () => {
    try {
      const result = await getUniqueURLs(startDate, endDate);
      console.log('URLs únicas:', result);
      setUniqueURLs(result);
    } catch (error) {
      console.error('Error al obtener URLs únicas:', error);
    }
  };
  const fetchPercentageErrors = async () => {
    try {
      const result = await getPercentageErrors(startDate, endDate);
      setPercentageErrors(result);
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
    <Grid  sx={{
              p: 2,
              backgroundColor: '#2d2d30', // color de respaldo
              background: 'linear-gradient(180deg, rgba(8,15,29,1) 24%, rgba(22,40,77,1) 100%)',
            }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        
       
        {/* Filtro de dominio y botones */}
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">


          {/* Encabezado */}
          <Grid item xs={12} sm={5}>
            <Box sx={{ textAlign: 'left', my: 2, display: 'flex', justifyContent: 'left', alignItems: 'center', gap: 2 }}>
                    <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: '#FFF',
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            m: 0
                          }}
                    >
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
            <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-flex',  
                          alignItems: 'center',
                          gap: 1,               
                        }}
                      >
                        <Sparkles size={24} color="#818cf8" strokeWidth={2} />
                        Monitoreo inteligente de actividad de bots con procesamiento analítico de Cloudflare
            </Typography>
          </Grid>

          <Grid item xs={12} sm={7}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CardIndicador 
                  title="Solicitudes Totales"
                  mainValue={totalRequests?.totalRequests}
                  description="Número total de solicitudes procesadas"
                  icon="activity"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CardIndicador 
                  title="Total Bots"
                  mainValue={totalRequests?.botRequests}
                  description="Número total de páginas diferentes visitadas por bots"
                  icon="activity"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CardIndicador 
                  title="Total Usuarios"
                  mainValue={totalRequests?.userRequests}
                  description="Número total de páginas diferentes visitadas por usuarios"
                  icon="activity"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CardIndicador 
                  title="URLs Únicas Visitadas"
                  mainValue={uniqueURLs?.current}
                  description="Cantidad de URLs únicas que han sido accedidas"
                  icon="activity"
                />
              </Grid>
            </Grid>
          </Grid>
          
          <DashboardFilters 
              selectedDomain={selectedDomain}
              onDomainChange={handleDomainChange}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onEditRoot={handleEditRoot}
              onEditXML={handleEditXML}
              onLogConnect={handleConnectLog}
            />
            
            <Grid item xs={12}  >
            <Paper sx={{ p: 2 }} variant="cosmicCard" >
              <Typography variant="subtitle1" gutterBottom>
                Actividad de Bots
              </Typography>
              <Box>
                  <BotActivityChart startDate={startDate} endDate={endDate} />
              </Box>
            </Paper>
            </Grid>
            
            
            <Grid item xs={12} md={6}>
                <Card variant="cosmicCard" >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Bot Categorias Distribución
                    </Typography>
                    <BotCategoriesChart startDate={startDate} endDate={endDate} />
                  </CardContent>
                </Card>
            </Grid>
            
            <Grid item xs={12}  md={6}>
              <GeoDistributionTable />
            </Grid>


        </Grid>
      


        

        


        {/* Sección con dos columnas: Bots Activos / URLs Más Rastreadas */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} variant="cosmicCard" >
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

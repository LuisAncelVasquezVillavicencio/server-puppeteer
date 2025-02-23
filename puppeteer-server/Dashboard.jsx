// App.jsx (o Dashboard.jsx)
import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, Button, MenuItem, TextField, Chip } from '@mui/material';
import mockTheme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { mockData } from './mockData';

export default function App() {
  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);

  // Obtenemos el dominio actual
  const currentDomain = mockData.domains[selectedDomainIndex];

  const handleChangeDomain = (e) => {
    setSelectedDomainIndex(e.target.value);
  };

  // Handlers para abrir en nueva pestaña robots/sitemap
  const openRobots = () => {
    window.open(`https://${currentDomain.name}/robots.txt`, '_blank');
  };
  const openSitemap = () => {
    window.open(`https://${currentDomain.name}/sitemap.xml`, '_blank');
  };

  return (
    <ThemeProvider theme={mockTheme}>
      <Container maxWidth="xl" sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
        {/* Selector de dominio */}
        <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
          <TextField
            select
            label="Seleccionar dominio"
            value={selectedDomainIndex}
            onChange={handleChangeDomain}
            variant="outlined"
            sx={{ width: 300 }}
          >
            {mockData.domains.map((dom, index) => (
              <MenuItem key={dom.name} value={index}>
                {dom.name}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Button onClick={openRobots} variant="contained" color="secondary" sx={{ mr: 2 }}>
              Ver Robots.txt
            </Button>
            <Button onClick={openSitemap} variant="contained" color="secondary">
              Ver Sitemap.xml
            </Button>
          </Box>
        </Box>

        {/* KPIs en tarjetas */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Bot Requests
              </Typography>
              <Typography variant="h4" color="primary">
                {currentDomain.totalBotRequests}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Errores SSR
              </Typography>
              <Typography variant="h4" color="error">
                {currentDomain.ssrErrors}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tiempo prom. Render (s)
              </Typography>
              <Typography variant="h4" color="primary">
                {currentDomain.avgRenderTime}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Top pages (sin tabla) - ejemplo en tarjetas horizontales */}
        <Typography variant="h5" gutterBottom>
          Top páginas más visitadas
        </Typography>
        <Box display="flex" gap={2} overflow="auto" pb={2}>
          {currentDomain.topPages.map((page, idx) => (
            <Card key={idx} sx={{ minWidth: 220, flexShrink: 0 }}>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary">
                  {page.path}
                </Typography>
                <Typography variant="body1">{page.title}</Typography>
                <Typography variant="h6" color="primary" mt={1}>
                  {page.visits} visitas
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Sección SEO: mostrar títulos, descriptions y keywords en modo tarjetas/chips */}
        <Typography variant="h5" gutterBottom mt={4}>
          SEO Data Reciente
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {currentDomain.seoData.map((seo, idx) => (
            <Card key={idx} sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {seo.path}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {seo.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {seo.description}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {seo.keywords.map((kw, i) => (
                    <Chip key={i} label={kw} color="secondary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

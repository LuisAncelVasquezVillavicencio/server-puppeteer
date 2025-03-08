import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  Box,
  Tab,
  Tabs,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search } from '@mui/icons-material';

// Datos de ejemplo
const mockData = [
  {
    id: 1,
    url: '/api/products',
    method: 'GET',
    ip: '192.168.1.1',
    isbot: 'true',
    bot_type: 'Googlebot',
    bot_category: 'Search Engine',
    timestamp: '2024-01-20T10:30:00',
    user_agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    headers: {
      'cf-ipcountry': 'US',
      'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
    body: null
  },
  // Agrega más datos de ejemplo aquí...
];

function RequestsTable() {
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const filteredData = useMemo(() => {
    if (!search) return mockData;
    const searchLower = search.toLowerCase();
    return mockData.filter(request => 
      request.url.toLowerCase().includes(searchLower) || 
      request.method.toLowerCase().includes(searchLower) ||
      request.ip.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#1976d2',
      POST: '#2e7d32',
      PUT: '#ed6c02',
      DELETE: '#d32f2f'
    };
    return colors[method] || '#757575';
  };

  return (
    <Card variant="cosmicCard" >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="h6">Últimas Peticiones</Typography>
          <TextField
            size="small"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Bot</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.id}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {request.url}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.method}
                      size="small"
                      sx={{
                        bgcolor: `${getMethodColor(request.method)}15`,
                        color: getMethodColor(request.method),
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell>{request.ip}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.isbot === 'true' ? request.bot_type : 'Usuario'}
                      size="small"
                      color={request.isbot === 'true' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatTimestamp(request.timestamp)}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedRequest(request)}
                    >
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Detalles de la Petición #{selectedRequest?.id}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="General" />
                <Tab label="Cabeceras" />
                <Tab label="Cuerpo" />
                <Tab label="JSON" />
              </Tabs>
            </Box>

            {tabValue === 0 && selectedRequest && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Método</Typography>
                  <Typography>{selectedRequest.method}</Typography>
                </Paper>
                {/* Agrega más campos generales aquí */}
              </Box>
            )}

            {tabValue === 1 && selectedRequest && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(selectedRequest.headers, null, 2)}
                </pre>
              </Paper>
            )}

            {/* Agrega más contenido de tabs aquí */}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default RequestsTable;
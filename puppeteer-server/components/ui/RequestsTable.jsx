import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Pagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getLatestRequests } from '../../services/apiService';

function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getLatestRequests({ 
          page, 
          limit, 
          search: search.trim() 
        });
        setRequests(data.requests);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchRequests();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, limit, search]);

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
    <Card variant="cosmicCard">
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

        <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                  {requests.map((request) => (
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

              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 2 }}>
                <Pagination 
                  count={totalPages}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#94a3b8',
                    },
                    '& .Mui-selected': {
                      backgroundColor: 'rgba(16, 185, 129, 0.1) !important',
                      color: '#10b981',
                    }
                  }}
                />
              </Box>
            </>
          )}
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
                  <Typography variant="subtitle2" color="text.secondary">URL</Typography>
                  <Typography>{selectedRequest.url}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Método</Typography>
                  <Typography>{selectedRequest.method}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">IP</Typography>
                  <Typography>{selectedRequest.ip}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                  <Typography>{formatTimestamp(selectedRequest.timestamp)}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Tipo de Bot</Typography>
                  <Typography>{selectedRequest.bot_type || 'N/A'}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Categoría</Typography>
                  <Typography>{selectedRequest.bot_category || 'N/A'}</Typography>
                </Paper>
              </Box>
            )}

            {tabValue === 1 && selectedRequest && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(selectedRequest.headers, null, 2)}
                </pre>
              </Paper>
            )}

            {tabValue === 2 && selectedRequest && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedRequest.body ? JSON.stringify(selectedRequest.body, null, 2) : 'No body content'}
                </pre>
              </Paper>
            )}

            {tabValue === 3 && selectedRequest && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(selectedRequest, null, 2)}
                </pre>
              </Paper>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default RequestsTable;






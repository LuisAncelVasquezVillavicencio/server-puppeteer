// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // modo oscuro
    primary: {
      main: '#B834F3', // Púrpura neón
    },
    secondary: {
      main: '#0EF5E3', // Cian neón
    },
    background: {
      default: '#1A1A1A',   // Fondo general
      paper: '#232323'      // Cartas/paneles un poco menos oscuro
    },
    text: {
      primary: '#ECECEC',   // Texto principal
      secondary: '#BDBDBD', // Texto secundario (gris medio)
    },
    success: {
      main: '#4EFF79'
    },
    warning: {
      main: '#FFC107'
    },
    error: {
      main: '#FF3366'
    }
  },
  typography: {
    // Ajustes tipográficos, si deseas una fuente futurista (ej: 'Orbitron')
    fontFamily: '"Roboto", "Orbitron", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    // y así sucesivamente...
  },
  // Overrides opcionales para dar aspecto “glow” en ciertos componentes
  shadows: Array(25).fill('none'), 
  // O, si quieres usar sombras personalizadas, puedes meter arrays con estilo neón
  components: {
    // Ejemplo: un estilo “glow” en Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 5px rgba(184, 52, 243, 0.8)',
          '&:hover': {
            boxShadow: '0 0 8px rgba(184, 52, 243, 1)',
          },
        },
      },
    },
    // ... añade overrides para tarjetas, inputs, etc.
  },
});

export default theme;

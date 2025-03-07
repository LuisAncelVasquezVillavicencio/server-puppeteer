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
    fontFamily: '"Roboto", "Orbitron", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    // etc.
  },
  // Deshabilita las sombras por defecto:
  shadows: Array(25).fill('none'),
  components: {
    // Ejemplo: estilo “glow” en los Buttons
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
    // Variante personalizada “cosmicCard” para Paper
    MuiPaper: {
      variants: [
        {
          props: { variant: 'cosmicCard' },
          style: {
            background: 'linear-gradient(to bottom, #080e20, #0d1528)',
            border: '1px solid #8000e9',
            // Sombras con prefijos
            WebkitBoxShadow: '0px 5px 15px 1px rgba(128,0,233,0.29)',
            MozBoxShadow: '0px 5px 15px 1px rgba(128,0,233,0.29)',
            boxShadow: '0px 5px 15px 1px rgba(128,0,233,0.29)',
            borderRadius: 8,
            padding: 16,
          },
        },
      ],
    },
  },
});

export default theme;

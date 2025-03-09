// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B834F3', // Púrpura neón
    },
    secondary: {
      main: '#0EF5E3', // Cian neón
    },
    background: {
      default: '#1A1A1A',   // Fondo general
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
    },
    dialog: {
      paper: {
        backgroundColor: '#080f1d',
        color: '#ffffff',
      }
    },
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
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '8px',
          background: 'transparent'
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#8000e93b',
          borderRadius: '4px',
          '&:hover': {
            background: '#8000e93b'
          }
        },
        '*::-webkit-scrollbar-track': {
          background: '#8000e93b',
          borderRadius: '4px'
        }
      }
    }, 
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#fff'
        },
        head: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: 500,
          backgroundColor: 'transparent'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03) !important'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.MuiTableContainer-root': {
            backgroundColor: 'transparent',
            backgroundImage: 'none'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#080f1d',
          color: '#ffffff',
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderBottom: '1px solid #7e34e9'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          color: '#ffffff'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: '#080f1d',
          borderTop: '1px solid #7e34e9'
        }
      }
    },
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

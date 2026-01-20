// THEME: Material-UI Gold & White Theme Configuration
// Primary: #D4AF37 (Gold), Secondary: #FFFFFF (White), Text: #111111 (Dark Gray)

import { createTheme } from '@mui/material/styles';

export const goldWhiteTheme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Gold
      light: '#E5C158',
      dark: '#B88F2A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF', // White
      light: '#FFFFFF',
      dark: '#F7F6F4',
      contrastText: '#111111',
    },
    background: {
      default: '#F7F6F4', // Muted off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111111', // Dark gray (not pure black)
      secondary: '#666666',
      disabled: '#CCCCCC',
    },
    action: {
      active: '#D4AF37',
      hover: 'rgba(212, 175, 55, 0.08)',
      selected: 'rgba(212, 175, 55, 0.12)',
      disabled: '#E5E5E5',
      disabledBackground: '#F5F5F5',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
    divider: 'rgba(212, 175, 55, 0.2)',
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.12s ease-in-out',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)',
          },
        },
        containedPrimary: {
          backgroundColor: '#D4AF37',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#B88F2A',
          },
        },
        outlined: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            borderColor: '#B88F2A',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#D4AF37',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4AF37',
              boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#D4AF37',
          color: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(212, 175, 55, 0.15)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#D4AF37',
          color: '#FFFFFF',
          fontWeight: 700,
        },
        body: {
          borderBottomColor: 'rgba(212, 175, 55, 0.15)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(212, 175, 55, 0.03)',
          },
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#D4AF37',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#D4AF37',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#D4AF37',
          '&:hover': {
            color: '#B88F2A',
          },
        },
      },
    },
  },
});

export default goldWhiteTheme;

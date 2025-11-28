import { alpha, createTheme } from '@mui/material/styles'

// "Education & Wisdom" Palette
// Primary: Deep Indigo/Navy - represents wisdom, authority, depth
// Secondary: Amber/Gold - represents enlightenment, spark of knowledge
// Background: Soft parchment/paper tones
const palette = {
  primary: {
    main: '#283593', // Indigo 800
    light: '#5f5fc4',
    dark: '#001064',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f9a825', // Yellow 800
    light: '#ffd95b',
    dark: '#c17900',
    contrastText: '#000000',
  },
  background: {
    default: '#f4f6f8', // Very light grey/blue, easy on eyes
    paper: '#ffffff',
  },
  text: {
    primary: '#1c2434', // Dark blue-grey, softer than pure black
    secondary: '#637381',
  },
}

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 700,
      color: palette.primary.main,
    },
    h5: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 400,
    },
    h6: {
      fontFamily: "'Merriweather', serif",
      fontWeight: 400,
    },
    subtitle1: {
      color: palette.text.secondary,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default dark mode overlay if we switch
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Soft, diffused shadow
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More modern, less aggressive
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 24px',
        },
        containedPrimary: {
          boxShadow: '0 4px 6px rgba(40, 53, 147, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(40, 53, 147, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha(palette.background.paper, 0.8),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: alpha(palette.primary.main, 0.05),
          color: palette.primary.main,
          borderBottom: `2px solid ${alpha(palette.primary.main, 0.1)}`,
        },
      },
    },
  },
})

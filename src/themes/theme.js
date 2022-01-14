import { createTheme } from '@material-ui/core'
export const theme = createTheme({
  typography: {
    fontFamily: '"Mukta","Open Sans", "sans-serif", "Roboto"',
    fontSize: 16,
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  palette: {
    primary: { main: '#0A66C2', contrastText: '#FFFFFF' },
    secondary: {
      main: '#016A42',
      contrastText: '#000000',
      light: 'rgb(1 ,106, 66 ,0.8)'
    },
    info: { main: '#F4F6FF' },
    text: {
      primary: '#000000',
      secondary: '#9BA9CC'
    },
    tags: {
      white: '#FFFFFF',
      green: '#5ACD76',
      red: '#FF5D48',
      yellow: '#EDAB1D',
      blue: '#59B0FF',
      purple: '#D460F7'
    }
  },
  shape: {
    borderRadius: 5
  }
})

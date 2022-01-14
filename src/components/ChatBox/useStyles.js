import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  formContainer: {
    marginTop: '2rem',
    padding: '1rem 2rem',
    // background: '#016A42'
    backgroundColor: 'rgb(1 ,106, 66 ,0.8)',
    color: 'white'
    // [theme.breakpoints.up(1200)]: {
    //   width: '30%'
    // },
    // [theme.breakpoints.down(1200)]: {
    //   width: '40%'
    // }
    // [theme.breakpoints.down(1200)]: {
    //   width: '60%'
    // },
    // [theme.breakpoints.down(600)]: {
    //   width: '80%'
    // }
  },
  welcomeText: {
    fontWeight: 'bolder',
    color: 'white'
  },
  label: {
    margin: 0,
    fontSize: '1.5rem'
  },
  textField: {
    '& .MuiFormLabel-root': {
      color: '#black',
      fontWeight: 'bolder'
    }
  },
  loginBtn: {
    color: 'white',
    position: 'absolute',
    right: 0,
    top: 0,
    margin: '0 20px'
  },
  authWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: 23
  },
  welcome: {
    fontSize: 26,
    paddingBottom: 20,
    color: '#000000',
    fontWeight: 700,
    fontFamily: "'Open Sans'"
  }
}))

export default useStyles

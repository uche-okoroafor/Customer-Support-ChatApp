import { makeStyles } from '@material-ui/core/styles'
import image from '../../images/LoginBackgroundImage.jpg'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    background: `linear-gradient( rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5)100%),url(${image})`,
    backgroundRepeat: ' no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    paddingTop: '2rem'
  },
  formContainer: {
    marginTop: '2rem',
    padding: '1rem 2rem',
    backgroundColor: 'rgb(1 ,106, 66 ,0.8)',
    color: 'white'
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
    margin: '10px 0',
    '& .MuiFormLabel-root': {
      color: 'white'
    }
  },
  loginBtn: {
    right: 0,
    top: 0,
    color: 'white',
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

import { makeStyles } from '@material-ui/core/styles'
import image from '../../images/dashboardbackgroundImg.jpg'

export const stringToColor = string => {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */
  return color
}

export const stringAvatar = (name, width, height) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width,
      height
    },
    children: `${name[0]}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    background: `linear-gradient( rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5)100%),url(${image})`,
    backgroundRepeat: ' no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    height: '87vh'
  },

  chats: {
    flexGrow: 1,
    overflow: 'hidden',
    overflowY: 'scroll',
    paddingBottom: '10px',
    width: '100%',
    listStyle: 'none',
    height: '100%',
    '&::-webkit-scrollbar': {
      width: '0.2em',
      height: '0.5em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#016A42'
    }
  },
  chatElevation: {
    height: '86vh',
    margin: '0 auto',
    position: 'relative',
    background: 'rgb(249, 249, 249,0.5)',
    display: 'flex',
    flexDirection: 'column'
  },
  chatBox: {
    position: 'relative',
    bottom: 0,
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    background: '#016A42',
    borderRadius: '5px'
  },
  customers: {
    height: '86vh',
    margin: '0 auto',
    background: 'rgb(249, 249, 249,0.5)',
    overflow: 'hidden'
  },
  navbar: {
    height: '4rem',
    position: 'fixed',
    width: '100%',
    left: 0,
    top: 0,
    color: 'white',
    background: 'rgb(1 ,106, 66 ,0.8)',
    zIndex: 1
  }
}))

export default useStyles

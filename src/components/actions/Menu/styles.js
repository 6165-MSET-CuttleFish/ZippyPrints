import { alpha,makeStyles } from '@material-ui/core/styles';
export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1), minWidth: 120, marginBottom: '30px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  container: {
    padding: '25px',
    display: 'flex',
    marginTop: '0px',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: 'white',
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    height: '75vh', overflow: 'auto',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#808080',
    '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.25), boxShadow: '5px 5px 2.5px gray' },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(0), width: 'auto' },
  },
  searchIcon: {
    marginTop:30, height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'left', justifyContent: 'left',
  },
}));
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

export default makeStyles(() => ({
  formControl: {
    margin: useTheme().spacing(2), minWidth: 120, marginBottom: '30px',
  },
  selectEmpty: {
    marginTop: useTheme().spacing(2),
  },
  loading: {
    height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  title: {
    margin: '10px'
  },
  container: {
    padding: '25px',
    display: 'flex',
    marginTop: '0px',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: 'white',
    height: '93.5vh'
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    height: '75vh', overflow: 'auto',
  },
  search: {
    position: 'relative',
    borderRadius: useTheme().shape.borderRadius,
    backgroundColor: 'white',
    border: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    '&:hover': { backgroundColor: 'white', boxShadow: '3px 3px 1.5px gray' },
    marginRight: useTheme().spacing(1),
    marginLeft: 0,
    width: '100%',
    [useTheme().breakpoints.up('sm')]: { marginLeft: useTheme().spacing(0), width: 'auto' },
  },
  searchIcon: {
    marginTop:30, height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'left', justifyContent: 'left',
  },
}));
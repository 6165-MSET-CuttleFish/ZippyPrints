import React from 'react'
import LoginForm from './LoginForm'
import {Paper} from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from '../Auth/login.module.css'

const useStyles = makeStyles(theme => ({
  pageContent:{
      padding: 24,
      height: 500,
      width: 600,
      marginLeft: 1440 / 2 - 300,
      marginTop: 690 / 2 - 300,
      color: '#7393B3'
  }
}))
const LoginExport = props => {
  const classes = useStyles();
  return (
    <div>
      <Paper className = {styles.Paper}
       style={{
        backgroundColor: "#EDD4B2",
        square: "true"
      }}            
    variant="elevation5"
    square={true}>
      <LoginForm />
      </Paper>
     
    </div>
  )
}
export default LoginExport
  
 
  



  

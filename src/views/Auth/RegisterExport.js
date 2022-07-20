import React from 'react'
import RegisterForm from './RegisterForm'
import {Paper} from '@mui/material'
import { makeStyles } from '@mui/styles'

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
const RegisterExport = props => {
  const classes = useStyles();
  return (
    <div>
      <Paper className = {classes.pageContent}>
      <RegisterForm />
      </Paper>
     
    </div>
  )
}
export default RegisterExport
  
 
  



  

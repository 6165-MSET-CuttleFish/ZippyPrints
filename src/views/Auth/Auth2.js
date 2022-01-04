import React from 'react'
import RegisterForm from '../Auth/RegisterForm'
import {Paper} from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  pageContent:{
      margin: 40,
      padding: 24,
      height: 500,
      width: 600,
      color: '#7393B3'
  }
}))
const Auth2 = props => {
  const classes = useStyles();
  return (
    <div>
      <Paper className = {classes.pageContent}>
      <RegisterForm />
      </Paper>
     
    </div>
  )
}
export default Auth2
  
 
  



  

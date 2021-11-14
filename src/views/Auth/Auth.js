import React from 'react'
import LoginForm from '../Auth/LoginForm'
import {Paper} from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  pageContent:{
      margin: 40,
      padding: 24
  }
}))
const Auth = props => {
  const classes = useStyles();
  return (
    <div>
      <Paper className = {classes.pageContent}>
      <LoginForm />
      </Paper>
     
    </div>
  )
}
export default Auth
  
 
  



  

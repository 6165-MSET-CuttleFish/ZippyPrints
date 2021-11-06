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
      <div>
      -make "Get Started" link in the nav bar a button ✅
      </div>
      <div>
      -make "Get Started" button open a popup ✅
      </div>
      <div>
      -make login form (textboxes and check marks) ✅
      </div>
      <div>
      -pull data from Firebase and check against user inputs ✅ 
      </div>
      <div>
      -login and done ✅
      </div>
      <div>
      -google login ❌
      </div>
      <div>
      -sign up form ❌
      </div>
      <div>
      -design ❌
      </div>
    </div>
  )
}
export default Auth
  
 
  



  

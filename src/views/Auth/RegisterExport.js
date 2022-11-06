import React from 'react'
import RegisterForm from './RegisterForm'
import {Paper} from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from '../Auth/register.module.css'

const RegisterExport = props => {
  return (
    <div>
      <Paper className = {styles.Paper}
       style={{
        backgroundColor: "#EDD4B2",
        square: "true"
      }}            
    variant="elevation5"
    square={true}>
      <RegisterForm />
      </Paper>
     
    </div>
  )
}
export default RegisterExport
  
 
  



  

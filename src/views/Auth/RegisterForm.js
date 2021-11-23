import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';

    
const useStyles = makeStyles(theme =>({ 
    loginButton: {
        background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 100
      },
      googleButton: {
        //background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 100,
        top: 10,
        icon: GoogleIcon
      },
      textbox: {
        left: 93,
        width: 200,
        length: 200,
        size: 100,
      },
      signup: {
          left: 100,
          width: 350,
          top: 300,
          size: 200
      },
      checkbox: {
          marginLeft: 1200,

      }
    
}))
const initalFValues = {
    id: 0,
    fName:'',
    lName:'',
    address:'',
    email: '',
    password: '',
    printer: false

}
export default function RegisterForm() {

    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('email' in fieldValues)
            temp.email = (/.+@.+../).test(fieldValues.email)?"":"Email is not valid."
        if ('password' in fieldValues)
            temp.password = fieldValues.password?"":"This field is required."
        
        setErrors({
            ...temp
        })
        
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")

    }
    
    const classes = useStyles();
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);

    const handlePrinterSelection = (e) => {
        values.printer = true
}

    const handleSubmit = (e) => {        
        e.preventDefault()
        if(validate()) {
           makeAccount();
        }  
    }
    const makeAccount = () => {
        var userEmail = values.email
        var userPassword = values.password
        var isPrinter = values.printer
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, userEmail, userPassword)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            user.displayName = values.fName
            user.tenantId = values.address
            window.alert("Welcome, " + user.displayName + " Printer: " + isPrinter + ", Your address is: " + user.tenantId)
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert("Error: " + errorCode + ", " + errorMessage)
            // ..
          });
       
    }
    

    //TODO: functionalize remember me switch
    return (
            <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs = {6}>
                    <Controls.Input
                        label = "First Name"
                        name="fName"
                        value={values.fName}
                        onChange = {handleInputChange}
                        error={errors.fName}
                        className={classes.textbox}
                        style = {{width: '350px'}}
                        required
                    />
                    <Controls.Input 
                        label = "Last Name"
                        name="lName"
                        value={values.lName}
                        onChange = {handleInputChange}
                        error={errors.lName}
                        className={classes.textbox}
                        style = {{width: '350px'}}
                        required
                    />
                    <Controls.Input
                        label = "Address"
                        name="address"
                        value={values.address}
                        onChange = {handleInputChange}
                        error={errors.address}
                        className={classes.textbox}
                        style = {{width: '350px'}}
                        required
                    />
                    <Controls.Input
                        label = "Email"
                        name="email"
                        value={values.email}
                        onChange = {handleInputChange}
                        error={errors.email}
                        className={classes.textbox}
                        fullWidth = {false}
                        style = {{width: '350px'}}
                        required
                    />
                    <Controls.Input 
                        label = "Password"
                        name="password"
                        type = "password"
                        value={values.password}
                        onChange = {handleInputChange}
                        error={errors.password}
                        className={classes.textbox}
                        style = {{width: '350px'}}
                        required
                    />
                    <Controls.Checkbox
                        className={classes.checkbox}
                        name="printerCheck"
                        label="I have a printer"
                        values={values.printer}
                        onChange = {handlePrinterSelection}
                    />
                     <Controls.Button 
                        className = {classes.loginButton}
                        variant = "contained"
                        color = "secondary"
                        size = "large"
                        text = "Register"
                        type="register"
                        onChange = {handleSubmit}
                    />
                
                </Grid>
            </Grid>
            </Form>
            
    )
}
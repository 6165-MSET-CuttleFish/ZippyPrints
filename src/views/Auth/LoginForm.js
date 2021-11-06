import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

    
const useStyles = makeStyles(theme =>({
    loginButtonFormat: {
        margin: '100px'
    }, 
    button: {
        background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 250
      },
      textbox: {
        left: 250
      },
      checkbox: {
        padding: '8px'
      }
    
}))
const initalFValues = {
    id: 0,
    email: '',
    password: '',
    rememberMe: ''

}
export default function LoginForm() {

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

    
    const handleSubmit = (e) => {
        e.preventDefault()
        if(validate()) {
            var userEmail = values.email
            var userPassword = values.password
            const auth = getAuth();
            signInWithEmailAndPassword(auth, userEmail, userPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                window.alert("Welcome, " + userEmail)
                resetForm();
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                window.alert(errorMessage + ": " + errorCode)
            });
           
        }  
        const auth = getAuth(); 
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              // ...
            } else {
              // User is signed out
              // ...
            }
          });
    }
    

    //TODO: functionalize remember me switch
    return (
            <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs = {6}>
                    <Controls.Input
                    label = "Email"
                    name="email"
                    value={values.email}
                    onChange = {handleInputChange}
                    error={errors.email}
                    className={classes.textbox}
                    />
                    <Controls.Input 
                    label = "Password"
                    name="password"
                    value={values.password}
                    onChange = {handleInputChange}
                    error={errors.password}
                    className={classes.textbox}
                    />
                <Controls.Checkbox 
                    className={classes.checkbox}
                    label="Remember Me"
                    checked="defaultUnchecked"
                    //onChange = {handleInputChange}

                />
                <Controls.Button 
                className = {classes.button}
                variant = "contained"
                color = "secondary"
                size = "large"
                text = "Login"
                type="login"/>
                </Grid>

            </Grid>
            </Form>
            
    )
}
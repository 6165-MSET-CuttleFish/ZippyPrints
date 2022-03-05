import React, { useState } from 'react'
import { useForm, Form } from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { firebaseConfig } from '../../api/firebaseConfig'
import * as firebase from 'firebase/app';
import { Typography, Snackbar, SnackbarContent, Link, Paper, Container, CssBaseline,
         Progress, Alert, Item, Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const useStyles = makeStyles(t =>({ 
    loginButton: {
        background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 100,

      },
      googleButton: {
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
      }
    
}))

const initalFValues = {
    id: 0,
    email: '',
    password: '',
    rememberMe: ''

}
export default function LoginForm() {

    firebase.initializeApp(firebaseConfig)

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

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const auth = getAuth(); 

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          window.alert(errorCode + ": " + errorMessage)
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(validate()) {
            var userEmail = values.email
            var userPassword = values.password
            const auth = getAuth();
            signInWithEmailAndPassword(auth, userEmail, userPassword)
            .then((userCredential) => {
                
                // Signed in 
                window.alert("Welcome, ")
                
                
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                window.alert(errorMessage + ": " + errorCode)
            });
           
        }  
       
    }
    //TODO: functionalize remember me switch
    const theme = createTheme();
    return (
        <div>
<ThemeProvider theme={theme}>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > 
        <Avatar sx={{ m: 1, bgcolor: '#00ff00' }}>
            <LockOutlinedIcon />
        </Avatar>
        <h4>Sign in</h4>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 3,
          }}>
            <Form onSubmit={handleSubmit}>
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
                    value={values.password}
                    onChange = {handleInputChange}
                    error={errors.password}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                />
                <Controls.Button 
                    className = {classes.loginButton}
                    variant = "contained"
                    color = "secondary"
                    size = "large"
                    text = "Login"
                    onClick = {handleSubmit}
                />
                <Controls.Button 
                    className = {classes.googleButton}
                    variant = "outlined"
                    color = "primary"
                    size = "large"
                    text = "Login with Google"
                    onClick ={handleGoogleLogin}
                />
                <Link href="register" variant="body2" sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: 3
                }}>
                    {"Don't have an account? Sign Up"}
                </Link>
                </Form>
                </Box>
            </Box>
    </ThemeProvider>   
    </div>     
    )
}
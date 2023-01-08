import React, { useState, useContext } from 'react'
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
import { useNavigate } from 'react-router-dom';
import styles from '../Auth/login.module.css'
import { RedirectCheck, RedirectCheckProvider } from './RedirectCheck';
const useStyles = makeStyles(e =>({ 
    loginButton: {
        border: 0,
        borderRadius: 3,
        height: 48,
        width: 350,
        left: 100,
      },
      googleButton: {
        border: 0,
        borderRadius: 3,
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
    let navigate = useNavigate();
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
        resetForm,
        loadingStatus,
        setLoading
    } = useForm(initalFValues, true, validate);

    const{status} = useContext(RedirectCheck)
    console.log("status:" + status)
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        else{
            status = false;
        }
    };
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
            setLoading({loading: true})
            signInWithEmailAndPassword(auth, userEmail, userPassword)

            .then((userCredential) => {
                setLoading({loading: false})
                navigate('../Profile', { replace: true })
                // Signed in 
                //window.alert("Welcome")
                
                
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                //window.alert(errorMessage + ": " + errorCode)
                setLoading({loading: false})
                let temp= {...errors}
                temp.password="Incorrect Password."
                setErrors({
                    ...temp
                })
                //resets password field
                setValues({
                    id: values.id, 
                    email: values.email,
                    password: '',
                    rememberMe: values.rememberMe
                })
            });
           
        }  
       
    }
    //TODO: functionalize remember me switch
    const theme = createTheme();
    return (
        <div>
<ThemeProvider theme={theme}>
    <Snackbar className = {styles.SnackBar} anchorOrigin = {{vertical: "top", horizontal: "center"}} open={status} autoHideDuration={1} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
           Please login before trying to access the map!
        </Alert>
    </Snackbar>
        <Box
          className={styles.topBox}
        > 
        <Avatar sx={{ m: 1, bgcolor: '#00ff00' }}>
            <LockOutlinedIcon />
        </Avatar>
        <h4>Sign in</h4>
        <Box component="form" onSubmit={handleSubmit} noValidate className={styles.botBox}>
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
                    type = "password"
                    value={values.password}
                    onChange = {handleInputChange}
                    error={errors.password}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    //add something to call handlesubmit when enter pressed in this box
                />
                <Controls.Button 
                    type="submit"
                    className = {classes.loginButton}
                    variant = "contained"
                    size = "large"
                    style={{
                        backgroundColor: loadingStatus.loading?true: "#4f6b80",
                        backgroundColor: loadingStatus.loading?false: "#001b2e"
                    }}
                    text = "Login"
                    onClick = {handleSubmit}
                />
                <Controls.Button 
                    className = {classes.googleButton}
                    variant = "outlined"
                    style={{
                        borderColor: "#001b2e",
                        color: "#001b2e"
                    }}
                    size = "large"
                    text = "Login with Google"
                    onClick ={handleGoogleLogin}
                />
                <Link href="register" variant="body2" sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: 3,
                    color: '#001b2e'
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
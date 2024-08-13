import React, { useState, useContext, useEffect } from 'react'
import { useForm, Form } from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { firebaseConfig } from '../../api/firebaseConfig'
import * as firebase from 'firebase/app';
import { Typography, Snackbar, SnackbarContent, Link, Paper, Container, CssBaseline,
         Progress, Alert, Item, Avatar, ThemeProvider, createTheme, Box, TextField, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import styles from '../Auth/login.module.css'
import { RedirectCheck, RedirectCheckProvider } from './RedirectCheck';
import {AuthContext} from "../../views/Auth/Auth"
import LoginTestimony from "../../res/Login_testimony.svg"

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

let open = false;
module.export = {open:open}

function setOpen(children){
open = children;
}  
export default function LoginForm() {

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    
    const checkViewable= ()=>
    {
        if(currentUser)
        {
            navigate("/Dashboard")
            setOpen(true)
        }
    }

    useEffect(() => {
        checkViewable()
        })


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
          //window.alert(errorCode + ": " + errorMessage)
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
                navigate('../dashboard', { replace: true })
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
                if(errorCode === "auth/wrong-password") {
                    temp.password="Incorrect Password."
                }
                else {
                    temp.password=errorCode;
                }
                setErrors({
                    ...temp
                })
                //resets password field
                setValues({
                    id: values.id, 
                    email: values.email,
                    password: '',
                    rememberMe: values.rememberMe,
                })
            });
           
        }  
       
    }
    //TODO: functionalize remember me switch
    return (
        <div className = {styles.columnContainer}>
            <div className = {styles.leftContainer}>
                {/* Title and Subtitle */}
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Welcome back! <br /> Sign in to continue</h1>
                    <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                                Have a problem signing in? Don't hesitate and{" "}
                        </span>
                            <Link 
                                href="support" 
                                variant="body2" 
                                style={{ 
                                    color: '#FFC107', 
                                    textDecoration: 'underline',
                                    textDecorationColor: '#FFC107',
                                    fontSize: '0.875rem',
                                    fontWeight: 'normal'
                                }}>
                                Contact Support
                            </Link>
                        </div>
                </div>
                {/* Login form */}
                <Form onSubmit={handleSubmit}>
                    <Controls.Input
                        label = "Email"
                        name="email"
                        size="small"
                        value={values.email}
                        onChange = {handleInputChange}
                        error={errors.email}
                        sx = {{
                            marginBottom: '1rem',
                            "& .MuiInputBase-root": {
                                width: '25vw',
                                height: '5vh',
                                borderRadius: '1',
                                backgroundColor: '#FFFFFF',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FFC107',
                                },
                            },
                            //label color
                            '& label.Mui-focused': {
                                color: '#FFC107',
                            },
                            //border color and background color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                borderColor: '#FFFFFF',
                                },
                                '&.Mui-focused fieldset': {
                                borderColor: '#FFC107',
                                
                                },
                                
                            },
                        }}
                        required
                    />
                    <Controls.Input 
                        label = "Password"
                        size="small"
                        name="password"
                        type = "password"
                        value={values.password}
                        onChange = {handleInputChange}
                        error={errors.password}
                        className = {styles.textbox}
                        sx = {{
                            marginBottom: '1rem',
                            "& .MuiInputBase-root": {
                                width: '25vw',
                                height: '5vh',
                                borderRadius: '1',
                                backgroundColor: '#FFFFFF',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FFC107',
                                },
                            },
                            //label color
                            '& label.Mui-focused': {
                                color: '#FFC107',
                            },
                            //border color and background color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                borderColor: '#FFFFFF',
                                },
                                '&.Mui-focused fieldset': {
                                borderColor: '#FFC107',
                                
                                },
                                
                            },
                        }}
                        required
                        //add something to call handlesubmit when enter pressed in this box
                    />

                    <div className={styles.linkContainer}>
                        {/* reset password */}
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                                Forgot your password?{" "}
                        </span>
                            <Link 
                                href="reset" 
                                variant="body2" 
                                style={{ 
                                    color: '#FFC107', 
                                    textDecoration: 'underline',
                                    textDecorationColor: '#FFC107',
                                    fontSize: '0.875rem',
                                    fontWeight: 'normal'
                                }}>
                                Reset your password
                            </Link>
                        </div>

                        <Controls.Button 
                            className = {styles.loginButton}
                            variant = "contained"
                            size = "large"
                            style={{
                                backgroundColor: loadingStatus.loading?true: "#015F8F",
                                backgroundColor: loadingStatus.loading?false: "#015F8F",
                                textTransform: "none",
                                fontWeight: "600",
                            }}
                            text = "Sign in"
                            onClick = {handleSubmit}
                        />
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                            Don't have an account?{" "}
                        </span>
                            <Link 
                                href="register" 
                                variant="body2" 
                                style={{ 
                                    color: '#FFC107', 
                                    textDecoration: 'underline',
                                    textDecorationColor: '#FFC107',
                                    fontSize: '0.875rem',
                                    fontWeight: 'normal'
                                }}>
                                Create one
                            </Link>
                        </div>
                    </div>
                </Form>
                <Link 
                    href="home" 
                    variant="body2" 
                    style={{ 
                        marginTop: '4rem',
                        color: 'black', 
                        textDecoration: 'underline',
                        textDecorationColor: 'black',
                        fontSize: '0.875rem',
                        fontWeight: 'normal' }}>
                    <em>← Back home</em>
                </Link>
            </div>
            <div className = {styles.rightContainer}>
                <div className={styles.rightContainer}>
                    <img 
                        src={LoginTestimony} 
                        className={styles.testimony}
                        alt="Testimony" />
                </div>
            </div>
        </div>     
    )
}
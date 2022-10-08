import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { getFirestore, setDoc, doc } from 'firebase/firestore/lite';
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../Auth/Register.css'

    
const useStyles = makeStyles(e =>({ 
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

        display: 'flex',
        flex: 3,
        alignItem: 'center',
        marginLeft: '50px'
      }
    
}))
const initalFValues = {
    id: 0,
    userName:'',
    email: '',
    password: '',
    printer: false

}

export default function RegisterForm() {
    const navigate = useNavigate();

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

    const handleSubmit = async(e) => {    
        e.preventDefault();    
        if(validate()) {
          await makeAccount();
          navigate('../Profile', { replace: true })
        }  
    }

    
    console.log(values.printer)
    const makeAccount = async ()  => {
        const userEmail = values.email
        const userPassword = values.password
        const userName = values.userName;
        const printer = values.printer;
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, userEmail, userPassword)
          .then(async (userCredential) => {
            // Sgned in 
          const db = getFirestore();
          const colRef = doc(db, "users", "" + auth.currentUser.uid)

          await updateProfile(await auth.currentUser, {
            displayName: userName,
            
          }).then(() => {
            // Profile updated!
            // ...
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert("Error: " + errorCode + ", " + errorMessage)
          });
          await setDoc(colRef, {
            username: userName,
            email: userEmail,
            printer: printer,
          })

        
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert("Error: " + errorCode + ", " + errorMessage)
            // ..
          });
          
    }
    
    

    

    const theme = createTheme();
    return (
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
        <h4>Sign up</h4>
        <Box component="form" 
            onSubmit={handleSubmit} 
            noValidate 
            sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 3,
          }}>
            <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs = {6}>
                    <Controls.Input
                        label = "Username"
                        name="userName"
                        value={values.userName}
                        onChange = {handleInputChange}
                        error={errors.userName}
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
                        name="printer"
                        label="Are you a printer?"
                        values={values.printer}
                        onChange={handleInputChange}
                    />
                    <Controls.Button 
                    className = {classes.loginButton}
                    variant = "contained"
                    color = "secondary"
                    size = "large"
                    text = "Login"
                    onClick = {handleSubmit}
                    />
                    
                
                </Grid>
            </Grid>
            </Form>
            
          </Box>
          </Box>
          </ThemeProvider>
            
    )
}
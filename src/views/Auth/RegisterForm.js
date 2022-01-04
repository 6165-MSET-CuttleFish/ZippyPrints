import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import LoginForm from './LoginForm'
import {firebaseConfig} from '../../api/firebaseConfig'
import { initializeApp } from 'firebase/app';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Popup from "../../components/Popup";
import RegisterSuccessForm from "./Redirect"
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getDatabase, ref, set } from "firebase/database";


    
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
    userName:'',
    email: '',
    password: '',
    printer: false

}

export default function RegisterForm() {

    const app = initializeApp(firebaseConfig);

    const [openPopup, setOpenPopup] = useState(false)


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
           makeAccount();
           setOpenPopup(true);
        }  
    }
    
    const makeAccount = () => {
        var userEmail = values.email
        var userPassword = values.password
        var userName = values.userName;
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, userEmail, userPassword, userName)
          .then((userCredential) => {
            // Signed in 
                  
          const user = userCredential.user;
          const db = getDatabase();
          set(ref(db, 'users/' + user.uid), {
            username: userName,
            email: userEmail,
          });
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
                     <Controls.Button 
                        className = {classes.loginButton}
                        variant = "contained"
                        color = "secondary"
                        size = "large"
                        text = "Register"
                        type="register"
                        onChange = {handleSubmit}
                    />
                    <Popup 
                        title = "Success!"
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}>
                        <RegisterSuccessForm/>
                    </Popup>
                
                </Grid>
            </Grid>
            </Form>
            
    )
}
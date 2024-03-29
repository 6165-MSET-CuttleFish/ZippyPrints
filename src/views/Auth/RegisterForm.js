import React, { useState, useContext, useEffect } from 'react'
import { Grid, Paper} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { getFirestore, setDoc, doc } from 'firebase/firestore/lite';
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../Auth/Register.css'
import styles from '../Auth/register.module.css'
import {AuthContext} from "../../views/Auth/Auth"



    
const useStyles = makeStyles(e =>({ 
    loginButton: {
        border: 0,
        borderRadius: 3,
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
      },

}))
const initalFValues = {
    id: 0,
    userName:'',
    email: '',
    password: '',
    reconfirmPassword: '',
    printer: false

}

let open = false;
module.export = {open:open}

function setOpen(children){
open = children;
}  

export default function RegisterForm() {

  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  
  const checkViewable= ()=>
  {
      if(currentUser)
      {
          navigate("/dashboard")
          setOpen(true)
      }
  }

  useEffect(() => {
      checkViewable()
      })

    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('email' in fieldValues)
            temp.email = (/.+@.+../).test(fieldValues.email)?"":"Email is not valid."
        if ('password' in fieldValues)
            temp.password = fieldValues.password.length>5?"":"Passwords should be at least 6 characters long."
        if('reconfirmPassword' in fieldValues)
            temp.reconfirmPassword={...values}.password===fieldValues.reconfirmPassword?"":"Passwords must match."
        
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

    const handleSubmit = async(e) => {    
        e.preventDefault();    
        if(validate()) {
          setLoading({loading: true})
          await makeAccount();
        }  
    }

    
    const {setTimeActive} = useContext(AuthContext)

    const makeAccount = async ()  => {
        const userEmail = values.email
        const userPassword = values.password
        const userName = values.userName;
        const printer = values.printer;
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then(async (userCredential) => {
          // Signed in 
          const db = getFirestore();
          const colRef = doc(db, "users", "" + auth.currentUser.uid)
          sendEmailVerification(auth.currentUser)
          await updateProfile(await auth.currentUser, {
            displayName: userName,
            
          }).then(() => {
            setLoading({loading: false})
            setTimeActive(true)
            navigate('../Verification', { replace: true })
            //sendEmailVerification(auth.currentUser)
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
            setLoading({loading: false})
              let temp= {...errors}
              const errorCode = error.code;
              if(errorCode === "auth/email-already-in-use") {
                temp.email="An account is already registered under that email address."
                setErrors({
                    ...temp
                })
                //resets email field
                setValues({
                    id: values.id, 
                    userName: values.userName,
                    email: '',
                    password: values.password,
                    reconfirmPassword: values.reconfirmPassword,
                    rememberMe: values.rememberMe
                  })
              }
              //idk figure out other error codes later or something
              //const errorMessage = error.message;
              //window.alert("Error: " + errorCode + ", " + errorMessage)
            // ..
          });     
    }
    
    return (
      <div className = {styles.container}>
        {/* <Box className={styles.topBox}> 
        <Avatar sx={{ m: 1, bgcolor: '#00ff00' }}>
            <LockOutlinedIcon />
        </Avatar>
        <h4>Sign up</h4> */}
        <Paper component="form" onSubmit={handleSubmit} noValidate className={styles.registerPaper}
        sx={{"&.MuiPaper-root": {borderRadius: "10px"}}}>
          <div className = {styles.registerTitleContainer}>
                    <div className = {styles.logoContainer}>
                        <Avatar sx={{ marginLeft: 2.5, bgcolor: '#094FB7' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <div className = {styles.registerTitle}>Register</div>
                    </div>
                </div>
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
            <Controls.Input 
              label = "Reconfirm Password"
              name="reconfirmPassword"
              type = "password"
              value={values.reconfirmPassword}
              onChange = {handleInputChange}
              error={errors.reconfirmPassword}
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
              type="submit"
              className = {classes.loginButton}
              variant = "contained"
              size = "large"
              style={{
                backgroundColor: loadingStatus.loading?true: "#4f6b80",
                backgroundColor: loadingStatus.loading?false: "#001b2e"
              }}
              text = "Sign Up"
              onClick = {handleSubmit}
            />
            </Form>
          </Paper>
        </div>
    )
}
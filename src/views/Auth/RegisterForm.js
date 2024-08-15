import React, { useState, useContext, useEffect } from 'react'
import { Link } from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { getFirestore, setDoc, doc } from 'firebase/firestore/lite';
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../Auth/AuthForm.css'
import styles from '../Auth/register.module.css'
import {AuthContext} from "../../views/Auth/Auth"
import Progress1 from "../../res/progress1.svg"
import Testiomny from "../../res/Login_testimony.svg"





    
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
        console.log(temp)
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
        console.log("handle submit") 
        if(validate()) {
          console.log("validated") 
          setLoading({loading: true})
          await makeAccount();
          console.log("acc made") 
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
        .then(async () => {
          // Signed in 
          const db = getFirestore();
          const userRef = doc(db, "users", "" + auth.currentUser.uid)
          const printerRef = doc(db, "printers", "" + auth.currentUser.uid)
          const sharedRef = doc(db, "shared", "" + auth.currentUser.uid)
          sendEmailVerification(auth.currentUser)
          await updateProfile(await auth.currentUser, {
            displayName: userName,
            
          }).then(() => {
            setLoading({loading: false})
            setTimeActive(true)
            navigate('/verification')
          }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert("Error: " + errorCode + ", " + errorMessage)
          });

          await setDoc(sharedRef, {
            uid: auth.currentUser.uid,
            printer: printer,
          })

          if (printer) {
            await setDoc(printerRef, {
              username: userName,
              email: userEmail,
              printer: printer,
            })
          } else {
            await setDoc(userRef, {
              username: userName,
              email: userEmail,
              printer: printer,
            })
          }
          
          })
          .catch((error) => {
            window(error)
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
      <div className = {styles.columnContainer}>
        <div className = {styles.leftContainer}>
            {/* Title and Subtitle */}
            <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Welcome to ZippyPrints <br /> Sign up to continue</h1>
                    <div className={styles.subtitle}>
                            <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                Have a problem registering? Don't hesitate and{" "}
                </span>
                <Link 
                  href="support" 
                  variant="body2" 
                  style={{ 
                    color: '#FFC107', 
                    textDecoration: 'underline',
                    textDecorationColor: '#FFC107',
                    fontSize: '0.875rem',
                    fontWeight: 'normal'}}>
                  Contact Support
                </Link>
              </div>
            </div>
            <Form onSubmit={handleSubmit}>
            <div className={styles.textboxContainer}>
              <Controls.Input
                label = "Email"
                name="email"
                size="small"
                value={values.email}
                onChange = {handleInputChange}
                error={errors.email}
                fullWidth = {false}
                required
              />
              {/* <Controls.Input
                label = "Username"
                name="userName"
                value={values.userName}
                onChange = {handleInputChange}
                error={errors.userName}
                className={classes.textbox}
                style = {{width: '350px'}}
                required
              /> */}
              <Controls.Input 
                label = "Password"
                name="password"
                type = "password"
                size="small"
                value={values.password}
                onChange = {handleInputChange}
                error={errors.password}
                required
              />
              <div className={styles.checkboxContainer}>
                <Controls.Checkbox
                    name="printer"
                    label={
                      <div style={{ textAlign: 'left' }}>
                          <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                            Yes, I agree to the {" "}
                          </span>
                          <Link 
                            href="terms-of-service" 
                            variant="body2" 
                            style={{ 
                              color: '#FFC107', 
                              textDecoration: 'underline',
                              textDecorationColor: '#FFC107',
                              fontSize: '0.875rem',
                              fontWeight: 'normal', }}>
                            Terms of Service
                          </Link>
                      </div>
                    }
                    values={values.printer}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* <Controls.Input 
                label = "Reconfirm Password"
                name="reconfirmPassword"
                type = "password"
                value={values.reconfirmPassword}
                onChange = {handleInputChange}
                error={errors.reconfirmPassword}
                className={classes.textbox}
                style = {{width: '350px'}}
                required
              /> */}
              
              
              <div className={styles.linkContainer}>
                <Controls.Button 
                  type="submit"
                  className = {styles.loginButton}
                  variant = "contained"
                  style={{
                    backgroundColor: loadingStatus.loading?true: "#015F8F",
                    backgroundColor: loadingStatus.loading?false: "#015F8F",
                    textTransform: "none",
                    fontWeight: "600",
                  }}
                  text = "Sign Up"
                  onClick = {handleSubmit}
                />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                    Already have an account?{" "}
                  </span>
                  <Link 
                    href="login" 
                    variant="body2" 
                    style={{ 
                      color: '#FFC107', 
                      textDecoration: 'underline',
                      textDecorationColor: '#FFC107',
                      fontSize: '0.875rem',
                      fontWeight: 'normal' }}>
                    Log in
                  </Link>
                </div>
              </div>
            </Form>
            {/* Progress bar and back button */}
            <img src={Progress1} className={styles.progress1} alt="Progress (1 of 3)" />
                <div className={styles.backButton}>
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
          </div>
          <div className={styles.rightContainer}>
              <div className={styles.rightContainer}>
                <img src={Testiomny} className={styles.testimony} alt="Testimony" />
              </div>
          </div>
        </div>
    )
}
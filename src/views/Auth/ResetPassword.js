import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from '../Auth/reset.module.css'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Alert, Snackbar } from '@mui/material'
import { CircularProgress, Button } from '@mui/material';



let open = false;
    module.export = {open:open}

    function setOpen(children){
    open = children;
    }

    const initalFValues = {
        email: '',
        message: ''
    }

export default function ResetPassword()
{
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('email' in fieldValues)
            temp.email = (/.+@.+../).test(fieldValues.email)?"":"Email is not valid."
         
        setErrors({
            ...temp
        })
        
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")
    }

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

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const auth = getAuth();
    const [time, setTime] = useState(60)
    const {timeActive, setTimeActive} = useContext(AuthContext);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();


    const checkViewable= () => {
        if(!currentUser) {
            navigate("/Home")
        }
    }

    useEffect(() => {
        checkViewable()
    })
    
        useEffect(() => {
            let interval = null
            if (timeActive && time !== 0 ){
              interval = setInterval(() => {
                setTime((time) => time - 1)
              }, 1000)
            } else if(time === 0){
              setTimeActive(false)
              setTime(60)
              clearInterval(interval)
            }
            return () => clearInterval(interval);
          }, [timeActive, time, setTimeActive])
    
          useEffect(() => {
            const interval = setInterval(() => {
              currentUser?.reload()
              .then(() => {
                clearInterval(interval)
                // if(currentUser?.password){
                //   clearInterval(interval)
                //     navigate('/profile')
                // }
              })
              .catch((err) => {
                alert(err.message)
              })
            }, 1000)
          }, [navigate, currentUser])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(validate())
        {
            setLoading({loading: true})
            sendPasswordResetEmail(auth, values.email)
            .then(() => {
                setLoading({loading: false})
                setValues({email: "", message: "Email Sent!"})
              // Password reset email sent!
              // ..
            })
            .catch((error) => {
              setLoading({loading: false})
              let temp= {...errors}
              const errorCode = error.code;
              const errorMessage = error.message;
              if(errorCode === "auth/user-not-found") {
                temp.email="This email address is not registered."
              }
              else {
                temp.email=errorCode;
              }
              setErrors({
                ...temp
            })
            });
        }
    }
    
    
    const theme = createTheme();
    return(
        <div className = {styles.container}>
            <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
            <div className = {styles.verificationSubtitle}>Reset your password by pressing the button below — a link will be sent to your 
            email address for you to reset your password.</div>
             <div className = {styles.buttonContainer}>
            <Button 
                variant = "contained"
                size = "large"
                onClick = {handleSubmit}
                disabled={timeActive}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#F0F5FF',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: 'fit-content',
                    bottom: '5px',
                    transitionDuration: '500ms',
                    "&.MuiButton-contained": {
                      color: '#0B63E5',
                      fontFamily: "Lexend Regular",
                      fontSize: 'clamp(10px, 0.9vw, 18px)',
                      fontWeight: '500',
                      letterSpacing: '0',
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      background: "#d9e6ff",
                      boxShadow: '5px 5px 5px #02142e8e',
                      transitionDuration: '500ms'
                    },
                }}
                >
                Send Reset Password Email {timeActive && time}
            </Button>
            </div>
            </div>
            <Snackbar open={openSuccess} autoCloseDuration={5000} onClose={() => setOpenSuccess(false)}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenSuccess(false)}>
                    Email sent!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoCloseDuration={5000} onClose={() => setOpenError(false)}>
                <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>     
        );
    
}
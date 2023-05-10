import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Alert, Snackbar } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import styles from '../Auth/verification.module.css'
import { CircularProgress, Button } from '@mui/material';


let open = false;
module.export = {open:open}

function setOpen(children){
open = children;
}  

const initalFValues = {
    message: ''
}
export default function Verification() {
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [time, setTime] = useState(60)
    const {timeActive, setTimeActive} = useContext(AuthContext)

    const validate=(fieldValues = values)=>{}
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

    const checkViewable= ()=> {
        if(!currentUser) {
            navigate("/Login")
            setOpen(true)
        }
        if(currentUser.emailVerified){
            navigate("/VerSuccess")
            setOpen(true);
        }
    }
    
    const resendEmailVerification = () => {
        setButtonDisabled(true)
        sendEmailVerification(currentUser)
        .then(() => {
            setButtonDisabled(false)
            setTimeActive(true)
        }).catch((err) => {
            if (err = "auth/too-many-requests") {
                setErrorMessage("Please wait before sending another email!");
            } else {
                setErrorMessage(err.message);
            }       
            setButtonDisabled(false)
        })
      }

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
            if(currentUser?.emailVerified){
              clearInterval(interval)
                navigate('/profile')
            }
          })
          .catch((err) => {
            alert(err.message)
          })
        }, 1000)
      }, [navigate, currentUser])

    return(
        <div className = {styles.container}>
            <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
            <div className = {styles.verificationSubtitle}>Thanks for signing up! An verification email has been sent to: {currentUser.email}.
             In order to proceed, please check your email for a verification link from us.</div>
             <div className = {styles.buttonContainer}>
            <Button 
                variant = "contained"
                size = "large"
                onClick = {resendEmailVerification}
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
                Resend Verification Email {timeActive && time}
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
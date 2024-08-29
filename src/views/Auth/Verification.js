import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Alert, Snackbar } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import styles from '../Auth/verification.module.css'
import { Button } from '@mui/material';
import Progress2 from '../../res/progress2.svg'
import Progress2Mobile from '../../res/progress2_mobile.svg'

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
    const [time, setTime]= useState(30)
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

    useEffect(() => {
      const checkViewable = () => {
          if (currentUser?.emailVerified && currentUser?.displayName != null) {
              navigate("/Dashboard");
              setOpen(true);
          } else if (currentUser?.emailVerified && currentUser?.displayName == null){
              navigate("/setup")
              setOpen(true)
          }

          if (!currentUser) {
            navigate("/Login");
            setOpen(true)
          }
      };
      checkViewable();
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        currentUser?.reload()
        .then(() => {
          if(currentUser?.emailVerified){
            clearInterval(interval)
              navigate('/setup')
          }
        })
        .catch((err) => {
          alert(err.message)
        })
      }, 1000)
    }, [navigate, currentUser])
    
    const resendEmailVerification = () => {
        setButtonDisabled(true)
        sendEmailVerification(currentUser)
        .then(() => {
            setButtonDisabled(false);
            setTimeActive(true);
            setTime(60);  // Set timer to 45 seconds
            localStorage.setItem('time', 60);
            localStorage.setItem('timeActive', true);
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
        const savedTime = localStorage.getItem('time');
        const savedTimeActive = localStorage.getItem('timeActive');
      
        if (savedTime && savedTimeActive) {
          setTime(parseInt(savedTime));
          setTimeActive(JSON.parse(savedTimeActive));
        }
      }, [setTime, setTimeActive]);


      useEffect(() => {
        if (timeActive) {
          const interval = setInterval(() => {
            setTime(prevTime => {
              if (prevTime <= 1) {
                clearInterval(interval);
                setTimeActive(false);
                localStorage.removeItem('time');
                localStorage.removeItem('timeActive');
                return 0;
              }
              const newTime = prevTime - 1;
              localStorage.setItem('time', newTime);
              return newTime;
            });
          }, 1000);
      
          return () => clearInterval(interval);
        }
      }, [timeActive]);

    return(
        <div className = {styles.container}>
          <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Welcome to ZippyPrints! {currentUser?.displayName}</div>
              <div className = {styles.verificationSubtitle}>Thanks for signing up! An verification email has been sent to: <div style={{color: '#FFC107'}}>{currentUser?.email}.</div>
                In order to proceed, please check your email for a verification link from us.</div>
              <div className = {styles.buttonContainer}>
                <Button 
                  variant = "contained"
                  size = "large"
                  onClick = {resendEmailVerification}
                  disabled={timeActive || buttonDisabled}
                  sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      backgroundColor: '#015F8F',
                      borderRadius: '7px',
                      padding: '0px 32px',
                      width: 'fit-content',
                      bottom: '5px',
                      transitionDuration: '500ms',
                      "&.MuiButton-contained": {
                        color: 'white',
                        fontFamily: "Lexend Regular",
                        fontSize: '13px',
                        fontWeight: '500',
                        letterSpacing: '0',
                        lineHeight: '56px',
                        marginTop: '-2px',
                        whiteSpace: 'nowrap',
                        width: 'fit-content'
                      },
                      "&:hover": {
                        background: "#015F84",
                        boxShadow: '5px 5px 5px #02142e8e',
                        transitionDuration: '500ms'
                      },
                  }}
                  >
                  Resend Verification Email {timeActive && time}
              </Button>
              </div>
              <img src={Progress2} className={styles.progress2} alt="Progress (2 of 3)" />
              <img src={Progress2Mobile} className={styles.progress2_mobile} alt="Progress (2 of 3)" />
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
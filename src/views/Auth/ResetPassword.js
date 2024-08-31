import React, { useState, useEffect, useContext } from 'react'
import { useForm } from '../../components/useForm'
import { TextField, } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from '../Auth/reset.module.css'
import { Alert, Snackbar } from '@mui/material'
import { Button } from '@mui/material';
import { MenuContext } from '../../components/NavBar/MenuProvider';
import Menu from '../../components/NavBar/Menu';


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
    const {menu} = useContext(MenuContext)

        useEffect(() => {
          const checkViewable = () => {
              if (currentUser?.displayName == null) {
                  navigate("/setup");
                  setOpen(true);
              } else if (!currentUser) {
                  navigate("/login");
                  setOpen(true);
              }
          };
          checkViewable();
      }, [currentUser, navigate]);

    
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
    
    
    return(
    <>
      {menu?
        <Menu />
        :
        <div className = {styles.container}>
            <div className = {styles.columnContainer}>
            <div className={styles.titleContainer}>
                <div className = {styles.verificationTitle}>Hello {currentUser?.displayName}!</div>
                <div className = {styles.verificationSubtitle}>Reset your password by pressing the button below — a link will be sent to your 
                email address for you to reset your password.</div>
            </div>
            <div className = {styles.textContainer}>
            <TextField
                    label = "Email"
                    name="email"
                    size="small"
                    value={values.email}
                    onChange = {handleInputChange}
                    error={errors.email}
                    fullWidth = {false}
                    required
                />
              </div>
             <div className = {styles.buttonContainer}>
            <Button 
                variant = "contained"
                size = "large"
                onClick = {handleSubmit}
                disabled={timeActive}
                className={styles.button}
                sx={{
                    backgroundColor: "#015F8F",
                    textTransform: "none",
                    fontWeight: "600",
                }}
                >
                Reset password {timeActive && time}
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
        }
    </>   
  );
    
}
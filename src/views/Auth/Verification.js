import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Alert, Snackbar } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import styles from '../Auth/verification.module.css'


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
        else if(currentUser.emailVerified){
        navigate("/VerSuccess")
        setOpen(true);
        }
    }

    useEffect(() => {
        checkViewable()
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        const auth = getAuth();
        setLoading({loading: true})
        sendEmailVerification(auth.currentUser)
        .then(() => {
            setLoading({loading: false})
            setOpenSuccess(true);
        })
        .catch((error)=>{
            setLoading({loading: false})
            setOpenError(true);
            if (error = "auth/too-many-requests") {
                setErrorMessage("Please wait before sending another email!");
            } else {
                setErrorMessage(error.message);
            }
        })
    }


    return(
        <div className = {styles.container}>
            <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
            <div className = {styles.verificationSubtitle}>Thanks for signing up!  
            In order to proceed, please check your email for a verification link from us.</div>
            <Controls.Button 
                    variant = "contained"
                    size = "large"
                    style={{
                        backgroundColor: loadingStatus.loading?true: "#4f6b80",
                        backgroundColor: loadingStatus.loading?false: "#001b2e"
                    }}
                    text = "Resend Verification Email"
                    onClick = {handleSubmit}
                    />
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
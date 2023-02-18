import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
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
            setValues({message: "Email Sent!"})
          // Password reset email sent!
          // ..
        })
        .catch((error)=>
        {
            setLoading({loading: false})
            setValues({message: error.code})
        })
    }


    return(
        <div className = {styles.container}>
            <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
            <div className = {styles.verificationSubtitle}>A code should have been sent to your email address. 
            In order to proceed, please verify your account by entering the code into the textbox below.</div>

            <Form onSubmit={handleSubmit}>
            <Controls.Button 
                    variant = "contained"
                    size = "large"
                    style={{
                        backgroundColor: loadingStatus.loading?true: "#4f6b80",
                        backgroundColor: loadingStatus.loading?false: "#001b2e"
                    }}
                    text = "Send Verification Email"
                    onClick = {handleSubmit}
                    />
            <textarea value={values.message}/>
            </Form>
            </div>
        </div>
    );

}
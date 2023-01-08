import React, { useState, useEffect } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'


export default function Verification() 
{

    const handleSubmit = async(e) => 
    {
        e.preventDefault()
        const auth = getAuth();
        sendEmailVerification(auth.currentUser)
        .catch((error)=>
        {
            
        })
    }


    const theme = createTheme();
    return(
        <ThemeProvider theme={theme}>
            <div>Please verify your email</div>
            <Form onSubmit={handleSubmit}>
            <Controls.Button 
                    variant = "contained"
                    size = "large"
                    style={{
                      backgroundColor: "#001b2e"
                    }}
                    text = "Send Verification Email"
                    onClick = {handleSubmit}
                    />
            </Form>
        </ThemeProvider>        
    );

}
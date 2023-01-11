import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"


let open = false;
    module.export = {open:open}

    function setOpen(children){
    open = children;
    }

export default function VerifySuccess()
{

    
  
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const checkViewable= ()=>
    {
        if(!currentUser)
        {
            navigate("/Login")
            setOpen(true)
        }
        else if(!currentUser.emailVerified)
        {
        navigate("/Verification")
        setOpen(true);
        }
    }

    useEffect(() => {
        checkViewable()
        })

    const theme = createTheme();
    return(
        <ThemeProvider theme={theme}>
            <div>Your email has been successfully verified.</div>
        </ThemeProvider>        
    );
}
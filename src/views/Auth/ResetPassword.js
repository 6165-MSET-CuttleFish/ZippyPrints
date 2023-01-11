import React, { useState, useEffect, useContext } from 'react'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../views/Auth/Auth"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


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


    const checkViewable= ()=>
    {
        if(currentUser)
        {
            navigate("/Profile")
            setOpen(true)
        }
    }

    useEffect(() => {
        checkViewable()
        })

    const handleSubmit = async(e) => 
    {
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
              if(errorCode=="auth/user-not-found")
              {
                temp.email="This email address is not registered."
              }
              else
              {
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
        <ThemeProvider theme={theme}>
            <div>Please verify your email</div>
            <Form onSubmit={handleSubmit}>
            <Controls.Input
                    label = "Email"
                    name="email"
                    value={values.email}
                    onChange = {handleInputChange}
                    error={errors.email}
                    fullWidth = {false}
                    style = {{width: '350px'}}
                    required
                />
            <Controls.Button 
                    type="submit"
                    variant = "contained"
                    size = "large"
                    style={{
                        backgroundColor: loadingStatus.loading?true: "#4f6b80",
                        backgroundColor: loadingStatus.loading?false: "#001b2e"
                    }}
                    text = "Send Reset Email"
                    onClick = {handleSubmit}
                    />
                <textarea value={values.message}/>
                    
                </Form>
            </ThemeProvider>        
        );
    
}
import React, { useContext, useState } from 'react'
import { updateEmail } from "firebase/auth";
import {AuthContext} from "../../views/Auth/Auth"
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import styles from '../Auth/reset.module.css'
import { Button, Paper } from '@mui/material';
import { Alert, Snackbar, Box } from '@mui/material'

const initalFValues = {
    email: '',
    password: '',
}
//TODO: now u need to make sure user logins in with that email so they dont steal random peoples emails
export default function ResetEmail() {
    const {currentUser} = useContext(AuthContext);
    const {timeActive, setTimeActive} = useContext(AuthContext);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('email' in fieldValues)
            temp.email = (/.+@.+../).test(fieldValues.email)?"":"Email is not valid."
        if ('password' in fieldValues)
            temp.password = fieldValues.password?"":"This field is required."
        
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

    const handleEmail = () => {
        if (validate) {
            updateEmail(currentUser, values.email).then(() => {
                setOpenSuccess(true)
                alert("yay")
              }).catch((error) => {
                setErrorMessage(error)
                alert(error)
              });
        }
    }
    return(
        <div className = {styles.container}>
            <Box component="form" noValidate >    
            <Form onSubmit={handleEmail} className={styles.textboxContainer}>
            <div className = {styles.columnContainer}>
            <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
            <div className = {styles.verificationSubtitle}>Enter your desired email address and enter your password to confirm</div>
            <div className={styles.paperContainer}>
            <Paper 
                sx={{
                    backgroundColor: "#F0F5FF",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'rgba(230, 232, 236, 0.502)',
                    borderRadius: '5px',
                    gap: '32px',
                    width: '35vw',
                    height: 'clamp:(700px, 65vh, 2000px)',
                    marginRight: '2.25vw',
                }}            
            >
            <div className={styles.entireContainer}>
            <div className={styles.singleContainer}>
            <div className={styles.label}>Enter new email address</div>
                <Controls.Input 
                    placeholder={currentUser.email}
                    name="email"
                    variant="outlined"
                    value={values.email}
                    onChange = {handleInputChange}
                    error={errors.email}
                    InputProps={{
                        className: styles.textbox,
                    }}                        
                />
                </div>
            <div className={styles.singleContainer}>
            <div className={styles.label}>Enter password</div>
                <Controls.Input 
                    placeholder="Password"
                    name="password"
                    variant="outlined"
                    value={values.password}
                    onChange = {handleInputChange}
                    error={errors.password}
                    InputProps={{
                        className: styles.textbox,
                    }}                        
                />
            </div>
             <div className = {styles.buttonContainer}>
             
            <Button 
                variant = "contained"
                size = "large"
                onClick = {handleEmail}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#F0F5FF',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: '20vw',
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
                      width: '20vw',
                    },
                    "&:hover": {
                      background: "#d9e6ff",
                      boxShadow: '5px 5px 5px #02142e8e',
                      transitionDuration: '500ms'
                    },
                }}
                >
                    Submit
            </Button>
            </div>
            </div>
            </Paper>
            </div>
            </div>
            <Snackbar open={openSuccess} autoCloseDuration={5000} onClose={() => setOpenSuccess(false)}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenSuccess(false)}>
                    Email Reset!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoCloseDuration={5000} onClose={() => setOpenError(false)}>
                <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            </Form>
            </Box>
        </div>     
        );

}



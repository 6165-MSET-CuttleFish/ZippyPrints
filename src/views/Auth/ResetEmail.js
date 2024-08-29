import React, { useContext, useState, useEffect } from 'react'
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification } from "firebase/auth";
import { getFirestore, updateDoc, doc, getDocs, collection } from 'firebase/firestore/lite';
import {AuthContext} from "../../views/Auth/Auth"
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import styles from '../Auth/reset.module.css'
import { Button, Paper } from '@mui/material';
import { Alert, Snackbar, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const initalFValues = {
    email: '',
    password: '',
}
//TODO: now u need to make sure user logins in with that email so they dont steal random peoples emails
export default function ResetEmail() {
    const {currentUser} = useContext(AuthContext);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();
    const {setTimeActive} = useContext(AuthContext)
    
    useEffect(() => {
        const checkViewable = () => {
            if (currentUser?.displayName == null) {
                navigate("/setup");
            } else if (!currentUser) {
                navigate("/login");
            }
        };
        checkViewable();
    }, [currentUser, navigate]);

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
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initalFValues, true, validate);

    const handleEmail = () => {
        //Credential of current user
        var credential = EmailAuthProvider.credential(
            currentUser.email,
            values.password
          );
        //
        reauthenticateWithCredential(currentUser, credential).then(() => {
            // User re-authenticated -> proceed with changing email
            if (validate) {
                updateEmail(currentUser, values.email).then(async() => {
                    //Update database information as well
                    const db = getFirestore();
                    //updating user email in authentication
                    const userRef = doc(db, "users", "" + currentUser.uid)
                    await updateDoc(userRef, {
                        email: currentUser.email,
                      })
                    //Update marker docs if it exists
                    const querySnapshot = await getDocs(collection(db, "markers"))
                    var markerExist = false;
                    querySnapshot.forEach((doc) => {
                        if (doc.id == "" + currentUser.uid)
                            markerExist = true
                      });

                    if (markerExist) {
                        const markerRef = doc(db, "markers", "" + currentUser.uid)
                        await updateDoc(markerRef, {
                            email: currentUser.email
                        })
                    }
                    setOpenSuccess(true)
                    sendEmailVerification(currentUser)
                    setTimeActive(true);
                    navigate("/verification")
                  }).catch((error) => {
                    setErrorMessage(error)
                    alert(error)
                  });
            }
        }).catch(function(error) {
            alert("Error: " + error)
        });            
    }
    return(
        <div className = {styles.container}>
            <Box component="form" noValidate >    
            <Form onSubmit={handleEmail} className={styles.textboxContainer}>
            <div className = {styles.columnContainer}>
                <div className={styles.titleContainer}>
                    <div className = {styles.verificationTitle}>Hello {currentUser.displayName}!</div>
                    <div className = {styles.verificationSubtitle}>Enter your desired email address and enter your password to confirm</div>
                </div>
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
                            />
                            </div>
                        <div className={styles.singleContainer}>
                        <div className={styles.label}>Enter password</div>
                            <Controls.Input 
                                placeholder="Password"
                                name="password"
                                variant="outlined"
                                type="password"
                                value={values.password}
                                onChange = {handleInputChange}
                                error={errors.password}                    
                            />
                        </div>
                        <div className = {styles.buttonContainer}>
                        
                        <Button 
                            variant = "contained"
                            size = "large"
                            onClick = {handleEmail}
                            className={styles.button}
                            sx={{
                                backgroundColor: "#015F8F",
                                textTransform: "none",
                                fontWeight: "600", }}>
                                Save and continue
                        </Button>
                    </div>`
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



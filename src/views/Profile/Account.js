import React, { useState, useEffect, useContext } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile, onAuthStateChanged, currentUser, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {Paper} from '@mui/material'
import { getFirestore, setDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Avatar, ThemeProvider, createTheme, Box, Button, Snackbar, Alert } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "../Auth/Auth";
import styles from '../Profile/account.module.css'
import {useNavigate} from "react-router-dom"
import Popup from "../../components/Popup";


const apiKey = API_KEY
const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="

const initalFValues = {
    teamnumber: '',
    name: '',
    password: '',
}

let open = false;
module.export = {open:open}

export function setOpen(children){
    open = children;
  }
      
function Account() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [ userInfo, setUserInfo ] = useState();
    const [name, setName] = useState("Update your username");
    const [teamnumber, setTeamnumber] = useState("Please enter your team number");
    const [printer, setPrinter] = useState();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error!");
    const db = getFirestore();
    const userRef = doc(db, 'users', `${currentUser?.uid}`);
    const printerRef = doc(db, 'printers', `${currentUser?.uid}`);
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const [ ref, setRef ] = useState(null);
    
    
    const checkViewable= ()=> {
        if(!currentUser) {
            navigate("/Login")
            setOpen(true)
        }
        else if(!currentUser.emailVerified) {
        navigate("/Verification");
        setOpen(true);
        }
    }
    useEffect(() => {
        checkViewable()
    })

    
    useEffect(() => {
        const getRef = async () => {
          try {
            const docSnap = await getDoc(sharedRef);
    
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.printer) {
                setPrinter(true);
                setRef(doc(db, 'printers', `${currentUser?.uid}`));
              } else {
                setPrinter(false);
                setRef(doc(db, 'users', `${currentUser?.uid}`));
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error getting document:", error);
          }
        };
    
        if (sharedRef) {
          getRef();
        }
      }, [sharedRef, currentUser]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (ref) {
              const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.username || "Update your username");
                setTeamnumber(data.teamnumber || "Please enter your team number");
                setUserInfo(data);
              } else {
                console.log("No such document!");
              }
            }
          } catch (error) {
            console.error("Error fetching document:", error);
          }
        };
    
        fetchData();
      }, [ref, printer]);
    
   const uploadData = async () => {
           await updateDoc(ref, {
            username: values.name,
            teamnumber: values.teamnumber,
           })
           await updateProfile(await currentUser, {
            displayName: values.name,
          })
    }

    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('name' in fieldValues)
            temp.name = (/..../).test(fieldValues.name)?"":"Username is not valid."
        if ('teamnumber' in fieldValues)
            temp.teamnumber = (/.../).test(fieldValues.teamnumber)?"":"Team Number is not valid."
                
        setErrors({
            ...temp
        })
        
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")
    }
    const handleSubmit = async(e) => {        
        e.preventDefault()
        if(validate()) {
            uploadData(); 
            resetForm();
            window.location.reload();
        }  
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);

    const handleDelete = async() => {
        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                values.password
              )
              console.log(values.password)
              console.log(credential)
            
              const result = reauthenticateWithCredential(
                currentUser,
                credential
              )
              console.log(result)
            
              // Pass result.user here
            await deleteUser((await result)?.user)
                navigate('/home')
                window.location.reload();
        } catch (error) {
            setErrorMessage("Request Failed: check that you've entered the correct password, contact support if needed.")
            setErrorOpen(true);
        }
        
    } 

    const handleEmail = () => {
        navigate("/reset_email");
    }
    const handlePassword = () => {
        navigate("/reset");
    }
    const handleDeletePopup = () => {
        setOpenDeletePopup(true)
      }
    const handlePrinter = async () => {
        try {
            //changing account type from printer to user
            if (printer) {
                await updateDoc(sharedRef, {
                    printer: false
                })
                //update userDoc and then delete the current printer doc
                await setDoc(userRef, {
                    address: userInfo?.address || "",
                    address2: userInfo?.address2 || "",
                    bio: userInfo?.bio || "",
                    city: userInfo?.city || "",
                    country: userInfo?.country || "",
                    email: userInfo?.email || "",
                    filament: userInfo?.filament || "",
                    formattedAddress: userInfo?.formattedAddress || "",
                    geoPoint: userInfo?.geoPoint || "",
                    price: userInfo?.price || "",
                    printer: userInfo?.printer || "",
                    printers: userInfo?.printers || "",
                    service: userInfo?.service || "",
                    state: userInfo?.state || "",
                    teamnumber: userInfo?.teamnumber || "",
                    username: userInfo?.username || "",
                    zipcode: userInfo?.zipcode || ""
                })

                await deleteDoc(printerRef);

            //changing account type from user to printer
            } else if (!printer) {
                await updateDoc(sharedRef, {
                    printer: true
                })

                //update printer doc and delete the current userDoc
                await setDoc(printerRef, {
                    address: userInfo?.address || "",
                    address2: userInfo?.address2 || "",
                    bio: userInfo?.bio || "",
                    city: userInfo?.city || "",
                    country: userInfo?.country || "",
                    email: userInfo?.email || "",
                    filament: userInfo?.filament || "",
                    formattedAddress: userInfo?.formattedAddress || "",
                    geoPoint: userInfo?.geoPoint || "",
                    price: userInfo?.price || "",
                    printer: userInfo?.printer || "",
                    printers: userInfo?.printers || "",
                    service: userInfo?.service || "",
                    state: userInfo?.state || "",
                    teamnumber: userInfo?.teamnumber || "",
                    username: userInfo?.username || "",
                    zipcode: userInfo?.zipcode || ""
                })

                await deleteDoc(userRef);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div>
            {/* <Box className={styles.topBox}>
                <h3 className={styles.text}> Edit {currentUser.displayName}'s Profile </h3>
            <Avatar sx={{ m: 0, bgcolor: '#e0c699', fontSize: 2, marginTop: 1}}/>
            </Box> */}

            <Box component="form" noValidate >    
                <Form onSubmit={handleSubmit} className={styles.textboxContainer}>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Update username</div>
                        <Controls.Input
                            placeholder={name}
                            name="name"
                            variant="filled"
                            value={values.name}
                            onChange = {handleInputChange}
                            error={errors.name}
                            InputProps={{
                                className: styles.textbox,
                            }}
                            required
                        />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>FIRST Team Number</div>
                        <Controls.Input
                            placeholder={teamnumber}
                            name="teamnumber"
                            variant="filled"
                            value={values.teamnumber}
                            onChange = {handleInputChange}
                            error={errors.teamnumber}
                            InputProps={{
                                className: styles.textbox,
                            }}
                            required
                        />                
                    </div>
                        <Controls.Button 
                            className = {styles.button}
                            variant = "contained"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                backgroundColor: '#0B63E5',
                                borderRadius: '7px',
                                padding: '0px 32px',
                                width: '250px',
                                transitionDuration: '500ms',
                                height: '50px',
                                "&:hover": {
                                background: "#035ee6",
                                boxShadow: '5px 5px 5px #02142e8e',
                                transitionDuration: '500ms'
                                },
                            }}
                            size = "large"
                            text = "Update Information"
                            onClick = {handleSubmit}
                        />
                    <div className={styles.dividerLine}></div>
                            <div className={styles.singleContainer}>
                                <Controls.Button
                                    className = {styles.button}
                                    variant = "contained"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        backgroundColor: '#02142E',
                                        borderRadius: '7px',
                                        padding: '0px 32px',
                                        width: '315px',
                                        transitionDuration: '500ms',
                                        height: '50px',
                                        "&:hover": {
                                        background: "#035ee6",
                                        boxShadow: '5px 5px 5px #02142e8e',
                                        transitionDuration: '500ms'
                                        },
                                    }}
                                    size = "large"
                                    text = "Update Email Address"
                                    onClick = {handleEmail}
                                />
                            </div>
                            <div className={styles.singleContainer}>
                                <Controls.Button
                                    className = {styles.button}
                                    variant = "contained"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        backgroundColor: '#02142E',
                                        borderRadius: '7px',
                                        padding: '0px 32px',
                                        width: '315px',
                                        transitionDuration: '500ms',
                                        height: '50px',
                                        "&:hover": {
                                        background: "#035ee6",
                                        boxShadow: '5px 5px 5px #02142e8e',
                                        transitionDuration: '500ms'
                                        },
                                    }}
                                    size = "large"
                                    text = "Reset Password"
                                    onClick = {handlePassword}
                                />
                            </div>
                            <div className={styles.singleContainer}>
                                <Controls.Button
                                    className = {styles.button}
                                    variant = "contained"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        backgroundColor: '#02142E',
                                        borderRadius: '7px',
                                        padding: '0px 32px',
                                        width: '315px',
                                        transitionDuration: '500ms',
                                        height: '50px',
                                        "&:hover": {
                                        background: "#035ee6",
                                        boxShadow: '5px 5px 5px #02142e8e',
                                        transitionDuration: '500ms'
                                        },
                                    }}
                                    size = "large"
                                    text = "Update Printer Status"
                                    onClick = {handlePrinter}
                                />
                            </div>    
                </Form>
                <div className={styles.deleteContainer}>
                            <Button
                                className = {styles.button}
                                variant = "contained"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    backgroundColor: '#ff0000',
                                    borderRadius: '7px',
                                    padding: '0px 32px',
                                    width: '100px',
                                    transitionDuration: '500ms',
                                    height: '40px',
                                    "&:hover": {
                                    backgroundColor: '#ff0000',
                                    boxShadow: '5px 5px 5px #02142e8e',
                                    transitionDuration: '500ms'
                                    },
                                }}
                                size = "large"
                                onClick = {handleDeletePopup}
                        >
                                <div className={styles.dashboardButtonText}>Delete Account</div>
                            </Button> 
                        </div>
            </Box>
            <Popup
            openPopup={openDeletePopup}
            setOpenPopup={setOpenDeletePopup}
            sx={{
                marginTop: '20vw'
            }}
            >
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Delete Account</div>
                        <Controls.Input
                        placeholder="Please enter your password"
                        name="password"
                        variant="filled"
                        type="password"
                        value={values.password}
                        onChange = {handleInputChange}
                        error={errors.password}
                        sx={{
                            width: 350
                        }}
                        required
                        />   
                        <Controls.Button
                            className = {styles.button}
                            variant = "contained"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                backgroundColor: '#ff0000',
                                borderRadius: '7px',
                                padding: '0px 32px',
                                width: '350px',
                                transitionDuration: '500ms',
                                height: '50px',
                                "&:hover": {
                                background: "#035ee6",
                                boxShadow: '5px 5px 5px #02142e8e',
                                transitionDuration: '500ms'
                                },
                            }}
                            size = "large"
                            text = "Delete Account"
                            onClick = {handleDelete}
                        />
                        <Snackbar open={errorOpen} autoCloseDuration={5000} onClose={() => setErrorOpen(false)}>
                    <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
                    </div>
            </Popup>
          </div>
        )
}

export default Account

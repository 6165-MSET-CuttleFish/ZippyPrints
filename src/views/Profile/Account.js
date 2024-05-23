import React, { useState, useEffect, useContext } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile, onAuthStateChanged, currentUser, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {Paper} from '@mui/material'
import { getFirestore, setDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
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
    let username=null;
    let db=null;
    let colRef=null;
    let markerColRef=null;
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    if(currentUser!=null){
        username = (currentUser?.displayName)
        db = (getFirestore());
        colRef = (doc(db, 'users', "" + currentUser?.uid))
        markerColRef = (doc(db, 'markers', "" + currentUser?.uid))
    }
    
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

    const [geoLocationData, setGeoLocationData] = useState(null);
    const [name, setName] = useState("Update your username");
    const [teamnumber, setTeamnumber] = useState("Please enter your team number");
    const [printer, setPrinter] = useState();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error!");

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(colRef);
            if ((await docSnap).data()?.address != null) {
            setName(((await docSnap).data().username) !== undefined? ((await docSnap).data().username) : "Update your username");  
            setTeamnumber(((await docSnap).data().teamnumber) !== undefined? ((await docSnap).data().teamnumber) : "Please enter your team number");
            setPrinter(((await docSnap).data().printer))  
            }
        }
        fetchData()
    }, [colRef])

    console.log(printer)

    const getGeoLocation = async (address) => {
        try {
            const data = await axios.get(baseUrl + `${address}&key=${apiKey}`);
            return data;
        } catch(error) {
            throw error;
        }
      }
    
    const getData = async () => {
        const docSnap = await getDoc(colRef);
        const street = (await docSnap).data().address;
        const city = (await docSnap).data().city;
        const state = (await docSnap).data().state;
        const country = (await docSnap).data().country;
        const formattedAddress = street + ", " + city + ", " + state + ", " + country;
      try {
          const {data} = await getGeoLocation(formattedAddress);
          await setGeoLocationData(data);
          console.log(data);
          await updateDoc(colRef, {
              formattedAddress: data.results[0]?.formatted_address,
              geoPoint: new GeoPoint(await (data.results[0]?.geometry?.location?.lat), await (data.results[0]?.geometry?.location?.lng))
          })
          await setDoc(markerColRef, {
              username: values.name,
              teamnumber: values.teamnumber,
              uid: currentUser.uid,
              email: currentUser.email,
              lat: await (data.results[0]?.geometry?.location?.lat),
              lng: await (data.results[0]?.geometry?.location?.lng),
              formattedAddress: data.results[0]?.formatted_address,
            })
  
      }catch(error) {
          console.log(error.message);
      }
  }
    
      
  

   const uploadData = async () => {
           await updateDoc(colRef, {
            username: values.name,
            teamnumber: values.teamnumber,
           })
           await updateProfile(await currentUser, {
            displayName: values.name,
          })
           await getData();
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
        if (printer) {
            try {
                await updateDoc(colRef, {
                    printer: false
                  })
        
            }catch(error) {
                console.log(error.message);
            }
        } else if (!printer) {
            try {
                await updateDoc(colRef, {
                    printer: true
                  })
        
            }catch(error) {
                console.log(error.message);
            }
        }
        
      }
    return(
        <div>
            {/* <Box className={styles.topBox}>
                <h3 className={styles.text}> Edit {username}'s Profile </h3>
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

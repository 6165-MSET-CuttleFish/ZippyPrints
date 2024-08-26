import React, { useState, useEffect, useContext } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile, onAuthStateChanged, currentUser } from "firebase/auth";
import {Paper} from '@mui/material'
import { getFirestore, setDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Snackbar, Alert, Box, Select, MenuItem } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "../Auth/Auth";
import styles from '../Profile/printer.module.css'
import {useNavigate} from "react-router-dom"
import '../Profile/Dashboard.css'
import UserPrinterSwitch from './UserPrinterSwitch'

const apiKey = API_KEY
const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="

const initalFValues = {
    filament: '',
    price: '',
    printers: '',
    service: '',
    bio: '',
}
const services = [
    '3D Printing',
    'Laser Cutting',
    'CNC',
    'Other (describe below)',
  ];

let open = false;
module.export = {open:open}

export function setOpen(children){
    open = children;
  }
      
function Printer() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const db = getFirestore();
    const printerRef = doc(db, 'printers', `${currentUser.uid}`)
    const sharedRef = doc(db, 'shared', `${currentUser.uid}`)
    const markerRef = doc(db, 'markers', `${currentUser.uid}`)
    const [printerInfo, setPrinterInfo] = useState("Enter information about your machine");
    const [filament, setFilament] = useState("Enter information about your offered materials");
    const [price, setPrice] = useState("Enter a price range for your service");
    const [service, setService] = useState([]);
    const [bio, setBio] = useState("Write a short bio about the service(s) you provide");
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [visible, setVisible] = useState()
    const [visibleChecked, setVisibleChecked] = useState()

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
        const getRef = async () => {
          try {
            const docSnap = await getDoc(sharedRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.printer) {
                return
              } else {
                navigate("/Dashboard")
                alert("You cannot access this page because you are not a registered printer")
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            setError(true)
            console.log(error)
          }
        };
    
        if (sharedRef) {
          getRef();
        }

      }, []);

      useEffect(() => {
          checkViewable()
      })

      useEffect(() => {
        const getVisible = async() => {
            const docSnap = await getDoc(markerRef);
            if (docSnap.exists()) {
                if (docSnap.data().visibility) {
                    setVisible(true)
                    setVisibleChecked(true)
                    console.log("visibility  " + visible)
                } else {
                    setVisible(false)
                    setVisibleChecked(false)
                }
            }
        }
        if (markerRef) {
            getVisible();
        }
      }, [currentUser])
  
      console.log(service)
      const handleSwitchChange = (event) => {
        setVisibleChecked(event.target.checked);
    };
      useEffect(() => {
        const getUser = async () => {
            try {
                const docSnap = await getDoc(printerRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPrinterInfo(data?.printers !== ""? data.printers : "Enter your information about your printer")
                    setFilament(data?.filament !== ""? data.filament : "Enter information about your offered materials")
                    setPrice(data?.price !== ""? data.price : "Enter a price range for your service")
                    setBio(data?.bio !== ""? data.bio : "Write a short blurb about the service(s) you provide")
                    setService(data.service?.length > 0? data?.service : [])
                }
            } catch (error) {
                setError(true)
                console.log(error)
            }
        }
        if (printerRef) {
            getUser();
        }
    }, [currentUser])

   const uploadData = async () => {
        await updateDoc(printerRef, {
            printers: values.printers,
            price: values.price,
            filament: values.filament,
            service: service,
            bio: values.bio,
        })
        await updateDoc(markerRef, {
            printers: values.printers,
            price: values.price,
            filament: values.filament,
            service: service,
            bio: values.bio,
            visibility: visibleChecked,
        })
        setPrinterInfo(values.printers)
        setPrice(values.price)
        setFilament(values.filament)
        setBio(values.bio)
        setVisible(visibleChecked)
    }

    


    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('printers' in fieldValues)
            temp.printers = (/.../).test(fieldValues.printers)?"":"Please enter at least three characters."
        if ('filament' in fieldValues)
            temp.address2 = (/.../).test(fieldValues.address2)?"":"Please enter at least three characters."
        if ('price' in fieldValues)
            temp.price = (/.../).test(fieldValues.price)?"":"Please enter at least three characters."
        if ('bio' in fieldValues)
            temp.bio = (/.../).test(fieldValues.bio)?"":"Please enter at least three characters."
                
        setErrors({
            ...temp
        })
        
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")
    }
    const handleSubmit = async(e) => {      
        try {
            e.preventDefault()
            if(validate()) {
                uploadData();  
                resetForm();
                setSuccess(true)
            }  
        } catch (error) {
            setError(true)
        }
    }
    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setService(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);



    return(
        <div>
            <Form onSubmit={handleSubmit}>
                <div className={styles.columnContainer}>
                    <div className={styles.leftContainer}>
                    <div className={styles.singleContainer}>
                            <div className={styles.label}>Service Type *</div>
                            <Select
                                placeholder="Hello"
                                multiple
                                value={service}
                                onChange={handleChange}
                                required
                                className={styles.serviceSelect}
                                InputProps={{
                                    className: styles.serviceSelect
                                }}>
                                {services.map((name) => (
                                    <MenuItem
                                    key={name}
                                    value={name}
                                    >
                                    {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Manufacturing Info *</div>
                            <Controls.Input
                                placeholder={printerInfo}
                                name="printers"
                                value={values.printers}
                                onChange = {handleInputChange}
                                error={errors.printers}
                                InputProps={{
                                    className: styles.textbox,
                                }}
                                required
                            />
                        </div>

                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Filament Type *</div>
                            <Controls.Input 
                                placeholder={filament}
                                name="filament"
                                value={values.filament}
                                onChange = {handleInputChange}
                                error={errors.filament}
                                InputProps={{
                                    className: styles.textbox,
                                }}                        
                            />
                        </div>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Price *</div>
                            <Controls.Input 
                                placeholder={price}
                                name="price"
                                value={values.price}
                                onChange = {handleInputChange}
                                error={errors.price}
                                InputProps={{
                                    className: styles.textbox,
                                }} 
                                required
                            />
                        </div>
                    </div>
                    
                    <div className={styles.rightContainer}>
                        <div className={styles.bioContainer}>
                            <div className={styles.label}>Bio</div>
                                <Controls.Input 
                                    placeholder={bio}
                                    name="bio"
                                    value={values.bio}
                                    onChange = {handleInputChange}
                                    error={errors.bio}
                                    multiline
                                    maxRows={5}
                                    minRows={5}
                                    InputProps={{
                                        className: styles.bioTextbox,
                                    }} 
                                    inputProps={{
                                        maxLength: 300
                                    }}
                                    required/>
                        </div> 
                        <div className={styles.switchContainer}>
                            <div className={styles.label}>Update Visibility on Maps: currently {visible?"visible" : "not visible"}</div>
                            <div className={styles.switch}>
                                <UserPrinterSwitch checked={visibleChecked} onChange={handleSwitchChange} leftText = "Visible" rightText = "Not visible" />
                            </div>
                        </div>
                            
                            <div className={styles.buttonContainer}>
                                <Controls.Button 
                                    className = {styles.button}
                                    variant = "contained"
                                    style={{
                                        backgroundColor: "#015F8F",
                                        textTransform: "none",
                                        fontWeight: "600"
                                    }}
                                    size = "large"
                                    text = "Save and continue"
                                    onClick = {handleSubmit} />
                            </div>
                        </div>
                        
                    </div>
                </Form>

            
            <Snackbar open={success} autoCloseDuration={5000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Success!
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoCloseDuration={5000} onClose={() => setError(false)}>
                <Alert onClose={() => setError(false)} severity="success" sx={{ width: '100%' }}>
                    We've encounted an error, please try again later
                </Alert>
            </Snackbar>
          </div>
        )
}

export default Printer
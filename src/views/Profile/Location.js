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
import { Box, Snackbar, Alert } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "../Auth/Auth";
import styles from '../Profile/location.module.css'
import {useNavigate} from "react-router-dom"


const apiKey = API_KEY
const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="

const initalFValues = {
    address: '',
    address2: '',
    city: '',
    country:'',
    state: '',
    zipcode:'',
}

let open = false;
module.export = {open:open}

export function setOpen(children){
    open = children;
  }
      
function Location() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const db = getFirestore();
    const userRef = doc(db, 'users', `${currentUser?.uid}`);
    const [ printer, setPrinter ] = useState();
    const printerRef = doc(db, 'printers', `${currentUser?.uid}`)
    const markerRef = (doc(db, 'markers', `${currentUser?.uid}`))
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
    const [geoLocationData, setGeoLocationData] = useState(null);
    const [street1, setStreet1] = useState("Please enter your address");
    const [street2, setStreet2] = useState("Please enter your address (if applicable)");
    const [zipcode, setZipcode] = useState("Please enter your zip code");
    const [city, setCity] = useState("Please enter your city");
    const [state, setState] = useState("Please enter your state");
    const [country, setCountry] = useState("Please enter your country");
    const [ success, setSuccess ] = useState(false)
    const [ error, setError ] = useState(false)


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
            setError(true)
          }
        };
    
        if (sharedRef) {
          getRef();
        }
      }, [success]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStreet1(data.address !== ""? data.address : "Please enter your address")
                    setStreet2(data.address2 !== ""? data.address2 : "Please enter your address (if applicable)")
                    setZipcode(data.zipcode !== " "? data.zipcode : "Please enter your zipcode")
                    setCity(data.city !== ""? data.city : "Please enter your city")
                    setState(data.state !== ""? data.state : "Please enter your state")
                    setCountry(data.country !== ""? data.country : "Please enter your country")
                }
            } catch (error) {
                setError(true)
            }
        }
        if (ref) {
            getUser();
        }
    }, [ref, success])

    
    const getGeoLocation = async (address) => {
        try {
            const data = await axios.get(baseUrl + `${address}&key=${apiKey}`);
            return data;
        } catch(error) {
            setError(true)
        }
      }
    
    const getData = async () => {
        const docSnap = await getDoc(ref);
        const street = (await docSnap).data()?.address;
        const city = (await docSnap).data()?.city;
        const state = (await docSnap).data()?.state;
        const country = (await docSnap).data()?.country;
        const formattedAddress = street + ", " + city + ", " + state + ", " + country;
        setStreet1(street)
      try {
          const {data} = await getGeoLocation(formattedAddress);
          await updateDoc(ref, {
              formattedAddress: data.results[0]?.formatted_address,
              geoPoint: new GeoPoint(await (data.results[0]?.geometry?.location?.lat), await (data.results[0]?.geometry?.location?.lng))
          })
          await setDoc(markerRef, {
              username: currentUser.displayName,
              lat: await (data.results[0]?.geometry?.location?.lat),
              lng: await (data.results[0]?.geometry?.location?.lng),
              formattedAddress: data.results[0]?.formatted_address,
              uid: currentUser.uid,
              email: currentUser.email,
            })
  
      }catch(error) {
        setError(true)
      }
  }
    
      useEffect(() => {
          checkViewable()
      })
  
  

    const uploadData = async () => {
        try {
            await updateDoc(ref, {
                username: currentUser.displayName,
                email: currentUser?.email,
                address: values.address,
                address2: values.address2,
                city: values.city,
                state: values.state,
                country: values.country,
                zipcode: values.zipcode,
           })
            await getData();
            setSuccess(true)
        } catch (error) {
            setError(true)
        }
    }

    


    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('address' in fieldValues)
            temp.address = (/..../).test(fieldValues.address)?"":"Street is not valid."
        if ('city' in fieldValues)
            temp.city = (/..../).test(fieldValues.city)?"":"City is not valid."
        if ('country' in fieldValues)
            temp.country = (/..../).test(fieldValues.country)?"":"Country is not valid."
        if ('state' in fieldValues)
            temp.state = (/..../).test(fieldValues.state)?"":"State is not valid."
        if ('zipcode' in fieldValues)
            temp.zipcode = (/..../).test(fieldValues.zipcode)?"":"Zip Code is not valid."
                
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



    return(
        <div>
            {/* <Box className={styles.topBox}>
                <h3 className={styles.text}> Edit {username}'s Profile </h3>
            <Avatar sx={{ m: 0, bgcolor: '#e0c699', fontSize: 2, marginTop: 1}}/>
            </Box> */}

            <Box component="form" noValidate >    
                <Form onSubmit={handleSubmit} className={styles.textboxContainer}>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Street *</div>
                        <Controls.Input
                            placeholder={street1}
                            name="address"
                            variant="filled"
                            value={values.address}
                            onChange = {handleInputChange}
                            error={errors.address}
                            InputProps={{
                                className: styles.textbox,
                            }}
                            required
                        />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Street 2</div>
                        <Controls.Input 
                            placeholder={street2}
                            name="address2"
                            variant="filled"
                            value={values.address2}
                            onChange = {handleInputChange}
                            error={errors.address2}
                            InputProps={{
                                className: styles.textbox,
                            }}                        
                        />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Zipcode *</div>
                        <Controls.Input 
                            placeholder={zipcode}
                            name="zipcode"
                            variant="filled"
                            value={values.zipcode}
                            onChange = {handleInputChange}
                            error={errors.zipcode}
                            InputProps={{
                                className: styles.textbox,
                            }} 
                            required
                        />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>City *</div>
                        <Controls.Input 
                            placeholder={city}
                            name="city"
                            variant="filled"
                            value={values.city}
                            onChange = {handleInputChange}
                            error={errors.city}
                            InputProps={{
                                className: styles.textbox,
                            }} 
                            required
                            />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>State *</div>
                        <Controls.Input 
                            placeholder={state}
                            name="state"
                            variant="filled"
                            value={values.state}
                            onChange = {handleInputChange}
                            error={errors.state}
                            InputProps={{
                                className: styles.textbox,
                            }} 
                            required
                            />
                    </div>    
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Country *</div>
                        <Controls.Input 
                            placeholder={country}
                            name="country"
                            variant="filled"
                            value={values.country}
                            onChange = {handleInputChange}
                            error={errors.country}
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
                            marginTop: '0.7vw',
                            marginBottom: '1.5vw',
                            "&:hover": {
                            background: "#035ee6",
                            boxShadow: '5px 5px 5px #02142e8e',
                            transitionDuration: '500ms'
                            },
                        }}
                        size = "large"
                        text = "Submit"
                        onClick = {handleSubmit}
                    />
                </Form>
            </Box>
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

export default Location


import styles from './setup.module.css'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link } from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Controls from '../../components/actions/Controls'
import { makeStyles } from '@mui/styles'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { getFirestore, setDoc, doc, GeoPoint, updateDoc } from 'firebase/firestore/lite';
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import '../Auth/AuthForm.css'
import {AuthContext} from "../../views/Auth/Auth"
import Progress3 from "../../res/progress3.svg"
import Progress3Mobile from "../../res/progress3_mobile.svg"

import Testiomny from "../../res/Login_testimony.svg"
import { AppBar, Toolbar, InputBase, Paper } from '@mui/material';
import { GoogleMap, useLoadScript, Marker, LoadScriptNext } from '@react-google-maps/api';
import { API_KEY } from "../../api/firebaseConfig"
import axios from 'axios'




export default function Setup() {
    const { currentUser } = useContext(AuthContext)
    const [ open, setOpen ] = useState(false);
    module.export = {open:open}
    const navigate = useNavigate();
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [country, setCountry] = useState();
    const autocompleteRef = useRef(null);


    const apiKey = API_KEY
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="

    useEffect(() => {
        const checkViewable = () => {
            if (currentUser?.displayName) {
                navigate("/dashboard");
                setOpen(true);
            } else if (!currentUser) {
                navigate("/login");
                setOpen(true);
            }
        };
        // checkViewable();
    }, [currentUser, navigate]);

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if ('username' in fieldValues) 
            temp.username = (/.../).test(fieldValues.username)?"":"Username is not valid."
        
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    } 


    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place) {
                setSelectedPlace(place);
                console.log("Selected place:", place);
                const addressComponents = place.address_components || [];
                setCity(addressComponents[0]?.long_name || "");
                setState(addressComponents[2]?.long_name || "");
                setCountry(addressComponents[3]?.long_name || "");
            } else {
                console.error("Autocomplete returned no place");
            }
        } else {
            console.error("Autocomplete ref is null");
        }
    };


    const getGeoLocation = async (address) => {
        try {
            const data = await axios.get(baseUrl + `${address}&key=${apiKey}`);
            return data;
        } catch(error) {
            console.log("GeoPoint Error: " + error)
        }
      }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (validate()) {
            console.log("validated")
            console.log(city)
            await updateAccount();
        }
    }
    

    const updateAccount = async () => {
        const username = values.username;
        const printer = values.printer;
        const auth = getAuth();

        const db = getFirestore();
        const userRef = doc(db, "users", "" + auth.currentUser.uid)
        const printerRef = doc(db, "printers", "" + auth.currentUser.uid)
        const sharedRef = doc(db, "shared", "" + auth.currentUser.uid)
        const markerRef = doc(db, "markers", "" + auth.currentUser.uid)
        // Update username:
        try {  
            await updateProfile(await currentUser, {
                displayName: username
            })
        } catch(error) {
            console.log("Username error: " + error)
        }
        

        // Set printer status
        try {
            await updateDoc(sharedRef, {
                printer: printer
            })
            // Update user/printer docs depending on printer status
            if (printer) {
                const {data} = await getGeoLocation(selectedPlace.formatted_address);
                await setDoc(printerRef, {
                    username: username,
                    email: currentUser.email,
                    printer: true,
                    formattedAddress: selectedPlace.formatted_address,
                    city: city || "",
                    state: state || "",
                    country: country ||"",
                    geoPoint: new GeoPoint(await (data.results[0]?.geometry?.location?.lat), await (data.results[0]?.geometry?.location?.lng)),
                    filament: "",
                    bio: "",
                    price: "",
                    printers: "",
                    service: []


                })
                await setDoc(markerRef, {
                    username: currentUser.displayName,
                    lat: await (data.results[0]?.geometry?.location?.lat),
                    lng: await (data.results[0]?.geometry?.location?.lng),
                    formattedAddress: data.results[0]?.formatted_address,
                    uid: currentUser.uid,
                    email: currentUser.email,
                    filament: "",
                    bio: "",
                    price: "",
                    printers: "",
                    service: []
                })
            } else {
                await setDoc(userRef, {
                    username: username,
                    email: currentUser.email,
                    printer: printer,
                    formattedAddress: selectedPlace.formatted_address,
                    city: city || "",
                    state: state || "",
                    country: country ||"",
                    filament: "",
                    bio: "",
                    price: "",
                    printers: "",
                    service: []
                })
            }
            navigate("/dashboard")
        } catch (error) {
            console.log("Printer error: " + error)
        }
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
    } = useForm(initialValues, true, validate);


    const libraries = ['places'];
    let libRef = React.useRef(libraries)
        const autocompleteOptions = {
        types: ['(cities)'], // Limit results to cities
        componentRestrictions: { country: "us" } // Limit results to the United States
    };

    return (
    <LoadScriptNext googleMapsApiKey={API_KEY} libraries={libRef.current} id="script-loader" strategy="beforeInteractive" >
        <div className={styles.columnContainer}>
            <div className={styles.leftContainer}>
                {/* Title and Subtitle */}
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Welcome to ZippyPrints <br /> Set up your account</h1>
                    <div className={styles.subtitle}>
                        <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                            Create a username for your account and set a general location
                            to help others locate you easier! <br />
                            <br />  
                            Ran into a problem? Don't hesistate to {" "}
                        </span>
                        <Link 
                        href="support" 
                        variant="body2" 
                        style={{ 
                            color: '#FFC107', 
                            textDecoration: 'underline',
                            textDecorationColor: '#FFC107',
                            fontSize: '0.875rem',
                            fontWeight: 'normal'}}>
                        Contact Support
                        </Link>
                    </div>
                </div> 
                {/* Setup Form */}
                <Form onSubmit={handleSubmit}>
                    <div className={styles.textboxContainer}>
                        <Controls.Input
                            label = "Username"
                            name="username"
                            size="small"
                            value={values.username}
                            onChange = {handleInputChange}
                            error={errors.username}
                            sx={{ marginBottom: '1rem'}}
                            required />
                        <Autocomplete 
                         onLoad={(ref) => (autocompleteRef.current = ref)}
                         onPlaceChanged={onPlaceChanged}
                         options={autocompleteOptions}>
                        <Controls.Input
                            label = "General Location"
                            name="location"
                            size="small"
                            onChange = {handleInputChange}
                            sx={{ marginBottom: '1rem'}}
                            required />
                        </Autocomplete>

                        <div className={styles.checkboxContainer}>
                            <Controls.Checkbox
                                name="printer"
                                label={
                                <div style={{ textAlign: 'left' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#001b2e' }}>
                                        I am a printer
                                    </span>
                                </div>
                                }
                                values={values.printer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Controls.Button 
                            type="submit"
                            className = {styles.loginButton}
                            variant = "contained"
                            style={{
                                backgroundColor: loadingStatus.loading?true: "#015F8F",
                                backgroundColor: loadingStatus.loading?false: "#015F8F",
                                textTransform: "none",
                                fontWeight: "600",
                            }}
                            text = "Submit"
                            onClick = {handleSubmit} />
                    </div>
                </Form>
                <img src={Progress3} className={styles.progress3} alt="Progress (3 of 3)" />
                <img src={Progress3Mobile} className={styles.progress3_mobile} alt="Progress (3 of 3)" />
            </div>
            <div className={styles.rightContainer}>
                <img src={Testiomny} className={styles.testimony} alt="Testimony" />
            </div>
        </div>
    </LoadScriptNext>


    )
}

const initialValues = {
    username: '',
    printer: false,
    location: ''
}
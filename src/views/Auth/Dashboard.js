import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {Paper} from '@mui/material'
import { getFirestore, collection, getDocs, addDoc, setDoc, updateDoc, doc, getDoc, GeoPoint, query, where,  } from 'firebase/firestore/lite';
import axios from 'axios'
import { Typography, Snackbar, SnackbarContent, Link,
         Progress, Alert, Item, Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'

const apiKey = "AIzaSyD66Pg0s20be-L1lod3A29C8uyehouZREE"
const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="

const initalFValues = {
    id: 0,
    phone: '',
    teamnumber: '',
    address: '',
    address2: '',
    city: '',
    country:'',
    state: '',
    zipcode:'',
}

const useStyles = makeStyles(theme =>({ 
      textbox: {
        left: 50,
        width: 200,
        length: 200,
        size: 100,
        top: 20,
        bottom: 20
      },
      root: {
        margin: 50,
        width: 1320,
        height: 900,
        
      },
      submitButton: {
        background: 'linear-gradient(45deg, #00ff00 100%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 240,
        top: 31
      },
      header: {
        
      }
}))

      
export default function Dashboard() {
    const [currentUser, setCurrentUser] = useState([]);
    const user = getAuth()?.currentUser;
    useEffect(() => {
        async function fetchUser() {
            const requestUser = await user;
            setCurrentUser(requestUser)
            return requestUser
        }
        fetchUser();
    }, [user])

    const userEmail = currentUser?.email;
    const userUID = currentUser?.uid;
    const username = currentUser?.displayName
    const db = getFirestore();
    const colRef = doc(db, 'users', "" + currentUser?.uid)
    const markerColRef = doc(db, 'markers', "" + currentUser?.uid)

    console.log(username)
    const classes = useStyles();
    const [geoLocationData, setGeoLocationData] = useState(null);

    const getData = async () => {
      const docSnap = await getDoc(colRef);
      console.log((await docSnap).data())
      const street = (await docSnap).data().address;
      const city = (await docSnap).data().city;
      const state = (await docSnap).data().state;
      console.log(street, city, state)
      const formattedAddress = street + ", " + city + ", " + state;

    try {
        const {data} = await getGeoLocation(formattedAddress);
        await setGeoLocationData(data);
        console.log(data);
        await updateDoc(colRef, {
            formattedAddress: data.results[0]?.formatted_address,
            geoPoint: new GeoPoint(await (data.results[0]?.geometry?.location?.lat), await (data.results[0]?.geometry?.location?.lng))
        })
        await setDoc(markerColRef, {
            lat: await (data.results[0]?.geometry?.location?.lat),
            lng: await (data.results[0]?.geometry?.location?.lng),
            formattedAddress: data.results[0]?.formatted_address,
            teamnumber: values.teamnumber,
            uid: currentUser.uid
          })

    }catch(error) {
        console.log(error.message);
    }

    
}
const getGeoLocation = async (address) => {
    try {
        const data = await axios.get(baseUrl + `${address}&key=${apiKey}`);
        return data;
    } catch(error) {
        throw error;
    }
  }

    const uploadData = async () => {
        await updateDoc(colRef, {
            username: username,
            email: user.email,
            teamnumber: values.teamnumber,
            address: values.address,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode,
        })
        await getData();
    }
    
    
    const handleSubmit = async(e) => {        
        e.preventDefault()
        if(validate()) {
            uploadData();  
        }  
        
    }


    
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('teamnumber' in fieldValues)
            temp.teamnumber = (/..../).test(fieldValues.teamnumber)?"":"Team Number is not valid."
        if ('phone' in fieldValues)
            temp.phone = (/..../).test(fieldValues.phone)?"":"Phone Number is not valid."
        if ('address' in fieldValues)
            temp.address1 = (/..../).test(fieldValues.address1)?"":"Address is not valid."
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
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);


    const theme = createTheme();

    return(
        <ThemeProvider theme={theme}>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <h3> Edit Your Profile </h3>
           <Avatar sx={{ m: 0, bgcolor: '#00ff00', fontSize: 2 }}>

          </Avatar>

          </Box>
          <Paper sx={{
            marginTop: 2,
            marginLeft: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 450,
            width: 1200,
            }}
            variant="outlined">
          <Box component="form" noValidate sx={{ marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 23
            }}>
                
            <Form onSubmit={handleSubmit}>
                <Controls.Input
                    label = "Team Number"
                    name="teamnumber"
                    value={values.teamnumber}
                    onChange = {handleInputChange}
                    error={errors.teamnumber}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input
                    label = "Phone Number"
                    name="phone"
                    value={values.phone}
                    onChange = {handleInputChange}
                    error={errors.phone}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input
                    label = "Street"
                    name="address"
                    value={values.address}
                    onChange = {handleInputChange}
                    error={errors.address}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input 
                    label = "Street 2"
                    name="address2"
                    value={values.address2}
                    onChange = {handleInputChange}
                    error={errors.address2}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    />
                <Controls.Input 
                    label = "Zip Code"
                    name="zipcode"
                    value={values.zipcode}
                    onChange = {handleInputChange}
                    error={errors.zipcode}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input 
                    label = "City"
                    name="city"
                    value={values.city}
                    onChange = {handleInputChange}
                    error={errors.city}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input 
                    label = "State"
                    name="state"
                    value={values.state}
                    onChange = {handleInputChange}
                    error={errors.state}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input 
                    label = "Country"
                    name="country"
                    value={values.country}
                    onChange = {handleInputChange}
                    error={errors.country}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Button 
                    className = {classes.submitButton}
                    variant = "contained"
                    color = "secondary"
                    size = "large"
                    text = "Submit"
                    onClick = {handleSubmit}
                />
            </Form>
          </Box>
          </Paper>
          </ThemeProvider>
        )
}


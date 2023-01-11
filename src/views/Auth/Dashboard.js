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
import { Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "./Auth";
import styles from '../Auth/dashboard.module.css'
import {useNavigate} from "react-router-dom"


const apiKey = API_KEY
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
    printers:'',
    email:'',
    filament:'',
    price:'',
}

const useStyles = makeStyles(theme =>({ 
      textbox: {
        
      },
      root: {
        margin: 50,
        width: 1320,
        height: 900,
        
      },
      submitButton: {
        display: 'block',
        alignSelf: 'center',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        position: 'absolute',
        left: '32.5%',
        top: '3.5%',
        bottom: '3%'
      }
}))

let open = false;
module.export = {open:open}

export function setOpen(children){
    open = children;
  }
      
function Dashboard() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();


    let username=null;
    let db=null;
    let colRef=null;
    let markerColRef=null;
    if(currentUser!=null)
    {
        username = (currentUser?.displayName)
        db = (getFirestore());
        colRef = (doc(db, 'users', "" + currentUser?.uid))
        markerColRef = (doc(db, 'markers', "" + currentUser?.uid))
    }
    
    

    const checkViewable= ()=>
    {
        if(!currentUser)
        {
            navigate("/Login")
            setOpen(true)
        }
        else if(!currentUser.emailVerified)
        {
        navigate("/Verification");
        setOpen(true);
        }
    }

    

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
            uid: currentUser.uid,
            email: currentUser.email,
            printers: values.printers,
            filament: values.filament,
            price: values.price,
          })

    }catch(error) {
        console.log(error.message);
    }
}
  
    useEffect(() => {
        checkViewable()
        })


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
                email: currentUser?.email,
                teamnumber: values.teamnumber,
                address: values.address,
                city: values.city,
                state: values.state,
                zipcode: values.zipcode,
                printers: values.printers,
                filament:values.filament,
                price:values.price,
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
        if ('printers' in fieldValues)
            temp.printers = (/../).test(fieldValues.printers)?"":"Printer is not valid."
        if ('email' in fieldValues)
            temp.email = (/../).test(fieldValues.email)?"":"Email is not valid."
        if ('filament' in fieldValues)
            temp.filament = (/../).test(fieldValues.filament)?"":"Filament is not valid."
        if ('price' in fieldValues)
            temp.price = (/../).test(fieldValues.price)?"":"Price is not valid."
                
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
        <Box className={styles.topBox}>
        <h3 className={styles.text}> Edit {username}'s Profile </h3>
           <Avatar sx={{ m: 0, bgcolor: '#e0c699', fontSize: 2, marginTop: 1}}>

          </Avatar>

        </Box>
          <Paper 
            className={styles.Paper} 
            style={{
                backgroundColor: "#EDD4B2",
                square: "true"
              }}            
            variant="elevation5"
            square={true}
          >
          <Box component="form" noValidate >
                
            <Form onSubmit={handleSubmit} className={styles.botBox}>
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
                <Controls.Input
                    label = "Printers"
                    name="printers"
                    value={values.printers}
                    onChange = {handleInputChange}
                    error={errors.printers}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input
                    label = "Filaments Available"
                    name="filament"
                    value={values.filament}
                    onChange = {handleInputChange}
                    error={errors.filament}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                    <Controls.Input
                    label = "Email for Requests"
                    name="email"
                    value={values.email}
                    onChange = {handleInputChange}
                    error={errors.email}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input
                    label = "Estimated Price ($/cm^3)"
                    name="price"
                    value={values.price}
                    onChange = {handleInputChange}
                    error={errors.price}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />

                <Controls.Button 
                    className = {styles.button}
                    variant = "contained"
                    style={{
                        backgroundColor: "#001b2e",
                        width: '350px',
                        color: '#e0c699',
                        borderColor: '#e0c699',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                     }}
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

export default Dashboard


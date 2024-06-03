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
import { Avatar, ThemeProvider, createTheme, Box, Select, OutlinedInput, MenuItem } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "../Auth/Auth";
import styles from '../Profile/printer.module.css'
import {useNavigate} from "react-router-dom"


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
    'CNC Work',
    'CNC Routing',
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
    let username=null;
    let db=null;
    let colRef=null;
    let markerColRef=null;
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
    const [geoLocationData, setGeoLocationData] = useState(null);
    const [printerInfo, setPrinterInfo] = useState("Please enter your information about your printer");
    const [filament, setFilament] = useState("Please enter information about the type of filament you offer");
    const [price, setPrice] = useState("Please enter an estimate price range for your service");
    const [service, setService] = useState([]);
    const [bio, setBio] = useState("Write a short bio about the service(s) you provide");


    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(colRef);
            if ((await docSnap).data()?.address != null) {
            setPrinterInfo(((await docSnap).data().printers) !== undefined? ((await docSnap).data().printers) : "Please enter your information about your printer");  
            setFilament(((await docSnap).data().filament) !== undefined? ((await docSnap).data().filament) : "Please enter information about the type of filament you offer");   
            setPrice(((await docSnap).data().price) !== undefined? ((await docSnap).data().price) : "Please enter an estimate price range for your service");
            setBio(((await docSnap).data().bio) !== undefined? ((await docSnap).data().bio) : "Write a short bio about the service(s) you provide");
            }
        }
        fetchData()
    }, [colRef])
    
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
        const street = (await docSnap).data()?.address;
        const city = (await docSnap).data()?.city;
        const state = (await docSnap).data()?.state;
        const country = (await docSnap).data()?.country;
        const formattedAddress = street + ", " + city + ", " + state + ", " + country;
      try {
          const {data} = await getGeoLocation(formattedAddress);
          await updateDoc(colRef, {
              formattedAddress: data.results[0]?.formatted_address,
              geoPoint: new GeoPoint(await (data.results[0]?.geometry?.location?.lat), await (data.results[0]?.geometry?.location?.lng))
          })
          await setDoc(markerColRef, {
              username: currentUser.displayName,
              lat: await (data.results[0]?.geometry?.location?.lat),
              lng: await (data.results[0]?.geometry?.location?.lng),
              formattedAddress: data.results[0]?.formatted_address,
              uid: currentUser.uid,
              email: currentUser.email,
            })
  
      }catch(error) {
          alert(error.message);
      }
  }
    
      useEffect(() => {
          checkViewable()
      })
  
  

   const uploadData = async () => {
           await updateDoc(colRef, {
                printers: values.printers,
                price: values.price,
                filament: values.filament,
                service: service,
                bio: values.bio,
           })
           await getData();
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
        e.preventDefault()
        if(validate()) {
            uploadData();  
            resetForm();
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
            {/* <Box className={styles.topBox}>
                <h3 className={styles.text}> Edit {username}'s Profile </h3>
            <Avatar sx={{ m: 0, bgcolor: '#e0c699', fontSize: 2, marginTop: 1}}/>
            </Box> */}

            <Box component="form" noValidate >    
                <Form onSubmit={handleSubmit} className={styles.textboxContainer}>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Manufacturing Info *</div>
                        <Controls.Input
                            placeholder={printerInfo}
                            name="printers"
                            variant="filled"
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
                            variant="filled"
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
                            variant="filled"
                            value={values.price}
                            onChange = {handleInputChange}
                            error={errors.price}
                            InputProps={{
                                className: styles.textbox,
                            }} 
                            required
                        />
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Service Type *</div>
                        <Select
                            placeholder="Hello"
                            multiple
                            value={service}
                            onChange={handleChange}
                            required
                            sx={{width: '34vw'}}>
                            {services.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                InputProps={{
                                    className: styles.textbox,
                                }}>
                                {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className={styles.singleContainer}>
                        <div className={styles.label}>Bio</div>
                        <Controls.Input 
                            placeholder={bio}
                            name="bio"
                            variant="filled"
                            value={values.bio}
                            onChange = {handleInputChange}
                            error={errors.bio}
                            InputProps={{
                                className: styles.longTextbox,
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
          </div>
        )
}

export default Printer
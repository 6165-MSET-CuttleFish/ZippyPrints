import React, { useState, useEffect } from 'react'
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {Paper} from '@mui/material'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc,  } from 'firebase/firestore/lite';


    
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
      loginButton: {
        background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 48,
        width: 350,
        left: 58,
        top: 50
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
    const username = currentUser?.displayName;
    const userUID = currentUser?.uid;
    const db = getFirestore();
    const colRef = doc(db, 'users', "" + currentUser?.uid)
    
    console.log(username)
    const classes = useStyles();
    const uploadData = async () => {
          await updateDoc(colRef, {
            username: username,
            email: user.email,
            teamnumber: values.teamnumber,
            address: values.address,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode
        })
    }
    
    const handleSubmit = (e) => {        
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



    return(
        <Form onSubmit={handleSubmit}>
            <Paper className={classes.root} variant="outlined" elevation={10}>
                <div>{userEmail} . . . {userUID}</div>
            <div>Please fill out the following information to proceed, {username}</div>
            <Grid container>
            <Grid item xs = {6}>
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
                    label = "Address"
                    name="address"
                    value={values.address}
                    onChange = {handleInputChange}
                    error={errors.address}
                    className={classes.textbox}
                    style = {{width: '350px'}}
                    required
                    />
                <Controls.Input 
                    label = "Address 2"
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
                    className = {classes.loginButton}
                    variant = "contained"
                    color = "secondary"
                    size = "large"
                    text = "Submit"
                    onClick = {handleSubmit}
                />
            </Grid>
            </Grid>
            </Paper>
            </Form>
        )
}


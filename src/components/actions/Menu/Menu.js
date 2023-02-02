import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import useStyles from './styles';
import Details from '../Details/Details';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Box, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CssStyles from '../Menu/menu.module.css'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const Menu = () => {
    const classes = useStyles();
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    
   
    const [markers, setMarkers] = useState([]);
    const storage = getStorage();
    const [places, setPlaces] = useState([]);
    
    useEffect(() => {
        const getMarkerData = async () => {
          const db = getFirestore();
          const q = query(collection(db, "markers"));
          try {
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                setPlaces((current) => [...current,
                    {
                      lat: doc.data()?.lat,
                      lng: doc.data()?.lng,
                      team: doc.data()?.teamnumber,
                      location: doc.data()?.formattedAddress,
                      email:doc.data()?.email,
                      uid: doc.data()?.uid
                    },
                  ]);
                }
          );


          } catch (error){
            // window.alert(error) //We want to use a snackbar instead of a popup so this is commmented out
            console.log(error)
            // console.log(redirect)

          }
      }
        getMarkerData()
      }, [storage])

    useEffect(() => {
        setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
      }, [places]);
    

    
    const handleInputChange = (event) => {
        setType(event?.target.value);
    }
    return(
        <Box className = {classes.container}>
            <Autocomplete>
                <div className = {CssStyles.wrapper}>
                    <SearchIcon />
                    <InputBase className = {classes.search} sx = {{color: '##00FF00'}} placeholder = "Search..."/>
                </div>
                </Autocomplete>
            <Typography variant = 'h4'> 
                Options Around You
            </Typography>
            <FormControl className = {classes.formControl}>
                <InputLabel >What method are you looking for?</InputLabel>
                <Box sx = {{marginTop:2.85}}>
                <Select value = {type} sx = {{margin: 30}} onChange = {handleInputChange}>
                    <MenuItem value = '3D Printing'> 3D Printing </MenuItem>
                    <MenuItem value = 'Laser Cutting'> Laser Cutting </MenuItem>
                    <MenuItem value = 'CNC Work'> CNC Work </MenuItem>
                    <MenuItem value = 'CNC Routing'> CNC Routing </MenuItem>
                </Select>
                </Box>
            </FormControl>
            <Grid container spacing = {3} className = {classes.list}>
                {places?.map((place,i) =>(
                   <Grid ref={elRefs[i]} key={i} item xs={12}>
                        <Details place ={place}/>
                   </Grid> 
                ))}
            </Grid>
        </Box>
    );
}

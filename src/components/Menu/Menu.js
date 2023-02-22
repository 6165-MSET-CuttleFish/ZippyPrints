import React, { useState, useEffect, createRef, useContext } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import Details from '../Details/Details';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Box, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CssStyles from '../Menu/menu.module.css'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import styles from './menu.module.css'
import { AuthContext } from "../../views/Auth/Auth";

export const Menu = () => {
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);
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
                      uid: doc.data()?.uid,
                      username: doc.data()?.username
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
      }, [currentUser?.username, storage])

    useEffect(() => {
        setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
      }, [places]);
    
    
    const handleInputChange = (event) => {
        setType(event?.target.value);
    }

    return(
        <div className = {styles.menuScreen}>
            <Autocomplete>
                <div className = {styles.searchContainer}>
                    <SearchIcon 
                      sx={{
                        height: "35px",
                        width: "35px"
                      }}/>
                    <InputBase className = {styles.searchBar} placeholder = "Search"/>
                </div>
                </Autocomplete>
              <div clasName={styles.dropDownContainer}>
                <div className={styles.menuTitle}>Options Around You</div>
                <FormControl>
                    <InputLabel className={styles.menuSubtitle}>What method are you looking for?</InputLabel>
                    <Select value = {type} className={styles.dropDown} onChange = {handleInputChange}>
                        <MenuItem className={styles.dropDownText} value = '3D Printing'> 3D Printing </MenuItem>
                        <MenuItem className={styles.dropDownText} value = 'Laser Cutting'> Laser Cutting </MenuItem>
                        <MenuItem className={styles.dropDownText} value = 'CNC Work'> CNC Work </MenuItem>
                        <MenuItem className={styles.dropDownText} value = 'CNC Routing'> CNC Routing </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className = {styles.printerContainer}> 
              <Grid container spacing = {3} className = {styles.printerList}>
                  {places?.map((place,i) =>(
                    <Paper 
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        border: '1px solid',
                        borderColor: 'rgba(230, 232, 236, 0.502)',
                        borderRadius: '20px',
                        gap: '32px',
                        width: '25vw',
                        height: '16vw',
                        marginRight: '2.25vw',
                      }}
                    className={styles.paper} ref={elRefs[i]} key={i} item xs={12}>
                      <Details place = {place}/>
                    </Paper> 
                  ))}
              </Grid>
            </div>
        </div>
    );
}

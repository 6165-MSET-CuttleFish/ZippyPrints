import React, { useState, useEffect, createRef, useContext } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Box, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../views/Auth/Auth";
import styles from './display.module.css'
import RequestList from './RequestList';

function DisplayRequests() {
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const [req, setReq] = useState([]);

    useEffect(() => {
        const getRequests = async () => {
          const db = getFirestore();
          const q = query(collection(db, "requests"));
          try {
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                setReq((current) => [...current,
                    {
                      color: doc.data()?.color,
                      height: doc.data()?.height,
                      info: doc.data()?.info,
                      length: doc.data()?.length,
                      email:doc.data()?.email,
                      material: doc.data()?.material,
                      unit: doc.data()?.unit,
                      width: doc.data()?.width,
                      file: doc.data()?.file,
                      teamnumber: doc.data()?.teamnumber,
                      location: doc.data()?.location, 
                      email: doc.data()?.email
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
      getRequests()
      }, [currentUser?.username, storage])

      useEffect(() => {
        setElRefs((refs) => Array(req.length).fill().map((_, i) => refs[i] || createRef()));
      }, [req]);
    
    
    const handleInputChange = (event) => {
        setType(event?.target.value);
    }


    return (
      <div className = {styles.printerContainer}> 
      <Grid container spacing = {3} className = {styles.printerList}>
          {req?.map((request,i) =>(
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
              <RequestList request = {request}/>
            </Paper> 
          ))}
      </Grid>
    </div>
    )
}

export default DisplayRequests;
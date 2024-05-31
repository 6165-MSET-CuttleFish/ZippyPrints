import React, { useState, useEffect, createRef, useContext } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Box, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../views/Auth/Auth";
import styles from './display.module.css'
import RequestList from './Requests';
import Details from './Details';
import { CurrentDetailsContext } from './DetailsContext';
import { Menu } from '../../components/Menu/Menu'

function DisplayRequests() {
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const [req, setReq] = useState([]);
    const { details, setDetails } = useContext(CurrentDetailsContext);

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
                      email: doc.data()?.email,
                      type: doc.data()?.type
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
      <div>
        {/* Request List Page */}
        <div> 
        {!details &&
        <div>
          <Paper sx={{
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: '#F0F5FF',
            
          }}>
            <div className={styles.wrapper}>
              <div className = {styles.searchContainer}>
                <SearchIcon 
                  sx={{
                    height: "35px",
                    width: "35px"
                  }}/>
                <InputBase className = {styles.searchBar} placeholder = "Search"/>
              </div>
              <div className={styles.dropDownContainer}>
                <div className={styles.menuTitle}>Request Filter</div>
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
            </div>
          </Paper>

          <div className = {styles.container}> 
          <Grid container spacing = {3} className = {styles.printerList}>
            {req?.map((request, i) =>(
              <Paper 
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  border: '1px solid',
                  borderColor: 'rgba(230, 232, 236, 0.502)',
                  borderRadius: '20px',
                  gap: '32px',
                  width: '50vw',
                  height: '12vw',
                  marginRight: '2.25vw',
                }}
                className={styles.paper} ref={elRefs[i]} key={i} item xs={12}>
                  {<RequestList request = {request}/>}
                </Paper> 
            ))}
          </Grid>
          </div>
        </div>
        }
      </div>

      {/* Details Page */}
      <div className={styles.detailsContainer}>
          { details && <Details/> }
      </div>
    </div>
    )
}

export default DisplayRequests;
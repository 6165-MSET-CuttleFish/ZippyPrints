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
import Button from '../actions/Button';

export const Menu = () => {
    const [type, setType] = useState("All");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);

    const db = getFirestore();
    const q = query(collection(db, "markers"));
    const [ ref, setRef ] = useState();
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const userRef = doc(db, 'users', `${currentUser?.uid}`)
    const printerRef = doc(db, "printers", `${currentUser?.uid}`) 
    const storage = getStorage();

    const [placeholder, setPlaceholder] = useState([])
    const [places, setPlaces] = useState([]);
   

    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")
    const [ filter, setFilter ] = useState("All")

    //distance api
    const [ userLocation, setUserLocation ] = useState()
    const [ distance, setDistance ] = useState()

    
    // Function to determine account type of user
    useEffect(() => {
      const getRef = async () => {
        try {
          setError(true)
          const docSnap = await getDoc(sharedRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.printer) {
              setRef(printerRef);
            } else {
              setRef(userRef);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error)
          setError(true)
        }
      };
  
      if (sharedRef) {
        getRef();
      }
    }, []);

    useEffect(() => {
        const getLocation = async() => {
          try {
              const docSnap = await getDoc(ref)
              if (docSnap.exists()) {
                  const data = docSnap.data();   
                  setUserLocation(data.formattedAddress)
              }
          } catch (error) {
              console.log(error)
          }
      }
      
        const getMarkerData = async () => {
          try {
              const querySnapshot = await getDocs(q);
              setPlaces([])
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                setPlaces((current) => [...current,
                    {
                      lat: data?.lat,
                      lng: data?.lng,
                      team: data?.teamnumber,
                      location: data?.formattedAddress,
                      email: data?.email,
                      uid: data?.uid,
                      username: data?.username,
                      price: data?.price,
                      printers: data?.printers,
                      service: data?.service,
                      filament: data?.filament,
                      bio: data?.bio
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
        if (ref) {
          getLocation();
        }
      }, [ref])

      useEffect(() => {
        getMarkers();
    }, [userLocation]);

    // Function to calculate distance (once)
    const calculateDistance = (destination, callback) => {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
          origins: [userLocation],
          destinations: [destination],
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          travelMode: 'DRIVING',
      }, callback);
    };

    const getMarkers = async () => {
      console.log("getMarkers")
      try {
        const storedRequests = localStorage.getItem('markers');
        const lastUpdated = localStorage.getItem('lastUpdated');
        const now = new Date();
        console.log(lastUpdated)
        if (storedRequests && lastUpdated && (now - new Date(lastUpdated)) < 0.5 * 60 * 60 * 1000) {
          console.log("Fetching req from local storage")
          console.log(localStorage)
          console.log(localStorage.getItem('markers'))
          const parsedRequests = JSON.parse(storedRequests);
          console.log(parsedRequests)
          setPlaceholder(parsedRequests);
        } else {
          console.log("Fetching markers from API")
          const querySnapshot = await getDocs(q);
          setPlaceholder([])
          const promises = querySnapshot.docs.map(async (doc) => {
            if (userLocation && doc.data()?.lat && doc.data()?.lng && doc.data()?.visibility) {
              const destination = `${doc.data()?.lat},${doc.data()?.lng}`;
              return new Promise((resolve => {
                calculateDistance(destination, (response, status) => {
                  if (status === 'OK') {
                    console.log("status OK")
                    const distance = response.rows[0].elements[0].distance.text; // Distance in miles
                    const distanceValue = response.rows[0].elements[0].distance.value

                    const markerData = {
                      ...doc.data(),
                      distance: distance,
                      distance_value: distanceValue
                    };
                    console.log(markerData)

                    setPlaceholder((current) => [...current, markerData]);
                    resolve();
                  } else {
                    resolve();
                  }
                });
              })
              )}
          })
          //sorting based on distance
          await Promise.all(promises).then(() => {
            setPlaceholder((current) => 
            [...current].sort((a, b) => a.distance_value - b.distance_value)
          )
          })
        }
      } catch(error) {
        setError(true)
        console.log(error)
      }
    }

    console.log(places)


    const updateStorage = () => {
      const now = new Date()
      localStorage.setItem('markers', JSON.stringify(placeholder))
      localStorage.setItem('lastUpdated', now)
      handleFilter(filter)
    }

    const refreshPrinters = () => {
      localStorage.removeItem('markers')
      localStorage.removeItem('lastUpdated')
      console.log("storage deleted")
      getMarkers();
    }

    useEffect(() => {
      console.log(placeholder)
      if (placeholder.length > 0) {
          console.log("updateStorage")
          updateStorage();
      }
    }, [placeholder])

    useEffect(() => {
        setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
      }, [places]);
    
    
    const handleInputChange = (event) => {
        setType(event?.target.value);
    }

    const handleFilter = (newFilter) => {
      console.log("handleFilter: " + newFilter)
        setFilter(newFilter)
        console.log(placeholder)
        setPlaces([])
        switch(newFilter) {
          case 'All':
            setPlaces(placeholder)
            break;
          case '3D Printing':
          case 'Laser Cutting':
          case 'CNC':
            placeholder.forEach((place) => {
              if (place.service?.includes(newFilter)) {
                  setPlaces((current) => [...current, place])
                } 
              })
            break;
        }
    }

    return(
        <div >
          <Button onClick = {() => {refreshPrinters()}}>Refresh</Button>
          {/* header */}
              <div clasName={styles.titleContainer}>
                <div className={styles.title}>Options Around You</div>
              </div>
              <div className={styles.filterContainer}>
                    <InputLabel className={styles.subtitle}>What service are you looking for?</InputLabel>
                    <Select value = {type} className={styles.select} onChange={handleInputChange}>
                        <MenuItem className={styles.dropDownText} onClick = {() => handleFilter("All")} value = 'All'> All </MenuItem>
                        <MenuItem className={styles.dropDownText} onClick = {() => handleFilter("3D Printing")} value = '3D Printing'> 3D Printing </MenuItem>
                        <MenuItem className={styles.dropDownText} onClick = {() => handleFilter("Laser Cutting")} value = 'Laser Cutting'> Laser Cutting </MenuItem>
                        <MenuItem className={styles.dropDownText} onClick = {() => handleFilter("CNC")} value = 'CNC'> CNC </MenuItem>
                    </Select>
              </div>

            {/* list of printers */}
            <div className = {styles.printerContainer}> 
              <div className = {styles.printerList}>
                  {places?.map((place) =>(
                      <Details place = {place}/>
                  ))}
              </div>
            </div>
        </div>
    );
}

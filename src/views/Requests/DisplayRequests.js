import React, { useState, useEffect, createRef, useContext } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { Autocomplete, LoadScriptNext } from '@react-google-maps/api';
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
import { FetchContext } from './FetchContext';
import { useNavigate } from 'react-router-dom';
import {Button} from '@mui/material';
import "./Display.css"
import { API_KEY } from '../../api/firebaseConfig';

function DisplayRequests() {
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const {req, setReq} = useContext(FetchContext);
    const {filter} = useContext(FetchContext);
    const {handleFilter} = useContext(FetchContext)
    const {refreshRequests} = useContext(FetchContext);
    const {key} = useContext(FetchContext);


    const { details, setDetails } = useContext(CurrentDetailsContext);
    const db = getFirestore();
    const printerRef = doc(db, "printers", `${currentUser?.uid}`)
    const [ acceptedReq, setAcceptedReq ] = useState();
    const [ activeReq, setActiveReq ] = useState();
    const q = query(collection(db, "requests"));
    const [ ref, setRef ] = useState();
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const userRef = doc(db, 'users', `${currentUser?.uid}`)
    const [ printer, setPrinter ] = useState();
    const [ error, setError ] = useState()
    const [ userReq, setUserReq ] = useState();
    const [ userReqInfo, setUserReqInfo ] = useState();
    const navigate = useNavigate();

    const [printReq, setPrintReq] = useState([])
    const [laserReq, setLaserReq] = useState([])
    const [CNCReq, setCNCReq] = useState([])

    //setting variant of different buttons
    const { allSelect } = useContext(FetchContext)
    const { printSelect } = useContext(FetchContext)
    const { laserSelect } = useContext(FetchContext)
    const { CNCSelect } = useContext(FetchContext)

    //switching between awaiting requests, accepted requests, and current user's requests
    const [active, setActive] = useState("Awaiting Requests");
    const [requestSelect, setRequestSelect] = useState('#717B8C');
    const [acceptedSelect, setAcceptedSelect] = useState('#717B8C');
    const [awaitingSelect, setAwaitingSelect] = useState('#717B8C');

    //distance sorting algorithm
    const [ userLocation, setUserLocation ] = useState();
    const [ distance, setDistance ] = useState("WRONG")


    
    useEffect(() => {
      const checkViewable = () => {
        handleFilter("All")
        if (!currentUser) {
          navigate("/login")
        } else if (!currentUser.emailVerified) {
          navigate("/verification")
        } else if (currentUser?.displayName == null) {
            navigate("/setup");
        }
      };
      checkViewable();
  }, [ref]);
    useEffect(() => {    
      const handleColor = () => {
          switch(active) {
              case "Your Requests":
                  handleFilter("All")
                  setRequestSelect("#FFC107");
                  setAcceptedSelect("#717B8C");
                  setAwaitingSelect("#717B8C");
                  break;
              case "Accepted Requests":
                  handleFilter("All")
                  setRequestSelect("#717B8C");
                  setAcceptedSelect("#FFC107");
                  setAwaitingSelect("#717B8C");
                  break;
              case "Awaiting Requests":
                  handleFilter("All")
                  setRequestSelect("#717B8C");
                  setAcceptedSelect("#717B8C");
                  setAwaitingSelect("#FFC107");
                  break;
              default:
          }
      }
    handleColor();
  }, [active])

    useEffect(() => {
      setDetails(false)
      const getRef = async () => {
        try {
          setError(true)
          const docSnap = await getDoc(sharedRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.printer) {
              setPrinter(true);
              setRef(printerRef);
            } else {
              setPrinter(false);
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


    // const calculateDistance = (destination, callback) => {
    //   const service = new window.google.maps.DistanceMatrixService();
    //   service.getDistanceMatrix({
    //       origins: [userLocation],
    //       destinations: [destination],
    //       unitSystem: window.google.maps.UnitSystem.IMPERIAL,
    //       travelMode: 'DRIVING',
    //   }, callback);
    // };
    
    useEffect(() => {
      const getAcceptedDocs = async () => {
        try {
            const docSnap = await getDoc(printerRef);
            setAcceptedReq((await docSnap).data()?.request)
            if (acceptedReq != undefined) {
              setActiveReq(true);
            } else {
              setActiveReq(false)
            }
          } catch (error) {
          console.log(error)
        }
      }

        try {
          getAcceptedDocs()
        } catch (error) {
          console.log(error)
        }
      }, [req, details])
      // console.log(req )


      useEffect(() => {
        const getRequestedDocs = async () => {
          try {
            const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                const data = docSnap.data()
                setUserLocation(data.formattedAddress)
                setUserReqInfo(data.userRequest)
                if (userReqInfo != null) {
                  setUserReq(true);
                } else {
                  setUserReq(false);
                }
              }
          } catch (error) {
            console.log(error)
          }
        } 
        if (ref) {
          try {
            getRequestedDocs();
          } catch (error) {
            console.log('getRequestedDocs: ' + error)
          }
        }
      }, [req, userReq])

      

      

      useEffect(() => {
        setElRefs((refs) => Array(req.length).fill().map((_, i) => refs[i] || createRef()));
      }, [req]);

      // useEffect(() => {
      //   const getRequests = async () => {
      //     try {
      //       const querySnapshot = await getDocs(q);
      //       setReq([]);
      //       setPrintReq([]);
      //       setLaserReq([]);
      //       setCNCReq([]);
      
      //       const promises = querySnapshot.docs.map(async (doc) => {
      //         if (userLocation && doc.data()?.location) {
      //           return new Promise((resolve) => {
      //             calculateDistance(doc.data()?.location, (response, status) => {
      //               // console.log("fetch api")
      //               if (status === 'OK') {
      //                 const distance = response.rows[0].elements[0].distance.text; // Distance in miles
      //                 const distanceValue = response.rows[0].elements[0].distance.value
      
      //                 const requestData = {
      //                   ...doc.data(),
      //                   distance: distance,
      //                   distance_value: distanceValue
      //                 };
      
      //                 // Updating arrays directly inside the callback
      //                 setReq((current) => [...current, requestData]);
      
      //                 if (doc.data()?.type === "3D Printing") {
      //                   setPrintReq((current) => [...current, requestData]);
      //                 } else if (doc.data()?.type === "Laser Cutting") {
      //                   setLaserReq((current) => [...current, requestData]);
      //                 } else if (doc.data()?.type === "CNCing") {
      //                   setCNCReq((current) => [...current, requestData]);
      //                 }
      
      //                 resolve(); // Resolve the promise once the state has been updated
      //               } else {
      //                 resolve(); // Resolve even if the status is not OK
      //               }
      //             });
      //           });
      //         }
      //       });
      
      //       await Promise.all(promises); // Wait for all distance calculations to finish
      //        setReq((current) => 
      //           [...current].sort((a, b) => a.distance_value - b.distance_value)
      //         );

      //         setPrintReq((current) => 
      //           [...current].sort((a, b) => a.distance_value - b.distance_value)
      //         );

      //         setLaserReq((current) => 
      //           [...current].sort((a, b) => a.distance_value - b.distance_value)
      //         );

      //         setCNCReq((current) => 
      //           [...current].sort((a, b) => a.distance_value - b.distance_value)
      //         );
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   };
      
      //   getRequests();
      // }, [details, userLocation, ref]);



    return (
      <LoadScriptNext googleMapsApiKey={API_KEY}>
      <div className={styles.entireContainer}>
        <Button onClick={() => refreshRequests()}>CLICK ME TO REFRESH</Button>
      {/* Request List Page */}
        <div> 
          {!details &&
            <div>
              {/* Title and Filter Section*/}
              <div className={styles.titleContainer}>
                <div className={styles.title}>Part Requests</div>
                <div className={styles.subtitle}>See requests awaiting to be fulfilled below!</div>
              </div>
              <div className={styles.filterNav}>
                <Button 
                  variant={allSelect ? "contained" : "text"}
                  sx={{
                    border: 0,
                    borderRadius: '2px',
                    textTransform: 'none',
                    color: 'black',
                    margin: '0.3rem', }}
                  onClick={() => handleFilter("All")}>
                  <div className={styles.filterButton}>Show all</div>
                </Button>
                <Button 
                  variant={printSelect ? "contained" : "text"}
                  sx={{
                    border: 0,
                    textTransform: 'none',
                    borderRadius: '2px',
                    margin: '0.3rem',
                    color: 'black' }}
                  onClick={() => handleFilter("3D Prints")}>
                  <div className={styles.filterButton}>3D Prints</div>
                </Button>
                <Button 
                  variant={laserSelect ? "contained" : "text"}
                  sx={{
                    border: 0,
                    textTransform: 'none',
                    borderRadius: '2px',
                    margin: '0.3rem',
                    color: 'black' }}
                  onClick={() => handleFilter("Laser Cut")}>
                  <div className={styles.filterButton}>Laser Cut</div>
                </Button>
                <Button 
                  variant={CNCSelect ? "contained" : "text"}
                  sx={{
                    border: 0,
                    textTransform: 'none',
                    borderRadius: '2px',
                    margin: '0.3rem',
                    color: 'black' }}
                  onClick={() => handleFilter("CNC")}>
                  <div className={styles.filterButton}>CNC</div>
                </Button>
              </div>
              <div className={styles.requestsNav}> 
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: awaitingSelect,
                        }}
                        onClick={() => setActive("Awaiting Requests")}>
                        <div 
                          className={styles.requestButtonText} 
                          style={{ textDecoration: active == "Awaiting Requests" ? 'underline' : 'none' }}>
                            Awaiting Requests({req.length})
                        </div>
                    </Button>
                  <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: requestSelect,
                        }}
                        onClick={() => setActive("Your Requests")}>
                        <div 
                        className={styles.requestButtonText} 
                        style={{ textDecoration: active == "Your Requests" ? 'underline' : 'none' }}>
                          Your Requests {userReq ? "(1)" : "(0)"}
                        </div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: acceptedSelect,
                            
                        }}
                        onClick={() => setActive("Accepted Requests")}>
                        <div 
                          className={styles.requestButtonText}
                          style={{ textDecoration: active == "Accepted Requests" ? 'underline' : 'none' }}>
                            Accepted Requests {acceptedReq ? "(1)" : "(0)"}
                          </div>
                    </Button>
              </div>

          <div className = {styles.bodyContainer}> 
          { userReq && active == "Your Requests" && 
            <div> 
              <div className={styles.paper}>
                  {<RequestList request = {userReqInfo}/>}
              </div>
            </div>
          }

          { acceptedReq != null && active == "Accepted Requests" && 
            <div> 
              <div className={styles.paper}>
                  {<RequestList request = {acceptedReq}/>}
              </div>
            </div>
          }
          { active == "Awaiting Requests" &&
            <div>
                {req?.map((request, i) =>(
                  <div 
                    className={styles.paper} 
                    ref={elRefs[i]} 
                    key={i} 
                    item 
                    xs={12}>
                      {<RequestList request = {request}/>}
                  </div>
                ))}
            </div>
          }
          </div>
        </div>
        }
      </div>

      {/* Details Page */}
      <div className={styles.detailsContainer}>
          { details && <Details/> }
      </div>
    </div>
    </LoadScriptNext>
    )
}

export default DisplayRequests;
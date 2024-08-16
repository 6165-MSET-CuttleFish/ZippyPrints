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
import { RequestContext } from './RequestContext';
import { useNavigate } from 'react-router-dom';

function DisplayRequests() {
    const [type, setType] = useState("3D Printing");
    const [elRefs, setElRefs] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const [req, setReq] = useState([]);
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

    useEffect(() => {
      const checkViewable = () => {
        if (!currentUser) {
          navigate("/login")
        } else if (!currentUser.emailVerified) {
          navigate("/verification")
        } else if (currentUser?.displayName == null) {
            navigate("/setup");
        }
      };
      checkViewable();
  }, [currentUser]);


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

    useEffect(() => {
      const getRequests = async () => {
        try {
          const querySnapshot = await getDocs(q);
          setReq([])
          querySnapshot.forEach((doc) => {
            setReq((current) => [...current, {
              color: doc.data()?.color,
              height: doc.data()?.height,
              info: doc.data()?.info,
              length: doc.data()?.length,
              email:doc.data()?.email,
              material: doc.data()?.material,
              unit: doc.data()?.unit,
              width: doc.data()?.width,
              files: doc.data()?.files,
              teamnumber: doc.data()?.teamnumber,
              location: doc.data()?.location, 
              email: doc.data()?.email,
              type: doc.data()?.type,
              thickness: doc.data()?.thickness,
              accepted: doc.data()?.accepted,
              uid: doc.data()?.uid
            },]);
          });
        } catch (error){
          // window.alert(error) //We want to use a snackbar instead of a popup so this is commmented out
          console.log(error)
          // console.log(redirect)
        }
      }
      getRequests()
    }, [details])

    
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

      useEffect(() => {
        const getRequestedDocs = async () => {
          try {
            const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                const data = docSnap.data()
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
          { userReq &&
          <div> 
              <div className={styles.listTitle}>Your Request </div>
              <Grid container spacing = {3} className = {styles.printerList}>
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
                    className={styles.paper}>
                      {<RequestList request = {userReqInfo}/>}
                    </Paper>
              </Grid>
            </div>
          }

          { activeReq &&
          <div> 
              <div className={styles.listTitle}>Your Accepted Requests </div>
              <Grid container spacing = {3} className = {styles.printerList}>
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
                    className={styles.paper}>
                      {<RequestList request = {acceptedReq}/>}
                    </Paper>
              </Grid>
            </div>
          }

          <div className={styles.listTitle}>Active Requests </div>
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
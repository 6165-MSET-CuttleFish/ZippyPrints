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
import {Button} from '@mui/material';
import "./Display.css"

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

    const [printReq, setPrintReq] = useState([])
    const [laserReq, setLaserReq] = useState([])
    const [CNCReq, setCNCReq] = useState([])

    //setting variant of different buttons
    const [ allSelect, setAllSelect] = useState(true)
    const [ printSelect, setPrintSelect] = useState(false)
    const [ laserSelect, setLaserSelect] = useState(false)
    const [ CNCSelect, setCNCSelect] = useState(false)

    //switching between awaiting requests, accepted requests, and current user's requests
    const [active, setActive] = useState("Awaiting Requests");
    const [requestSelect, setRequestSelect] = useState('#717B8C');
    const [acceptedSelect, setAcceptedSelect] = useState('#717B8C');
    const [awaitingSelect, setAwaitingSelect] = useState('#717B8C');


    
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
      const handleColor = () => {
          switch(active) {
              case "Your Requests":
                  setRequestSelect("#FFC107");
                  setAcceptedSelect("#717B8C");
                  setAwaitingSelect("#717B8C");
                  break;
              case "Accepted Requests":
                  setRequestSelect("#717B8C");
                  setAcceptedSelect("#FFC107");
                  setAwaitingSelect("#717B8C");
                  break;
              case "Awaiting Requests":
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

    useEffect(() => {
      const getRequests = async () => {
        try {
          const querySnapshot = await getDocs(q);
          setReq([])
          setPrintReq([])
          setLaserReq([])
          setCNCReq([])
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
            if (doc.data()?.type == "3D Printing") {
              setPrintReq((current) => [...current, {
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
            } else if (doc.data()?.type == "Laser Cutting") {
              setLaserReq((current) => [...current, {
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
            } else if (doc.data()?.type == "CNCing") {
              setCNCReq((current) => [...current, {
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
            }
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


    const handleFilter = (filterType) => {
      if (filterType == "All") {
        setReq([...printReq, ...laserReq, ...CNCReq])
        setPrintSelect(false)
        setAllSelect(true)
        setLaserSelect(false)
        setCNCSelect(false)
      } else if (filterType == "3D Prints") {
        setReq(printReq)
        setPrintSelect(true)
        setAllSelect(false)
        setLaserSelect(false)
        setCNCSelect(false)
      } else if (filterType == "Laser Cut") {
        setReq(laserReq)
        setPrintSelect(false)
        setAllSelect(false)
        setLaserSelect(true)
        setCNCSelect(false)
      } else if (filterType == "CNC") {
        setReq(CNCReq)
        setPrintSelect(false)
        setAllSelect(false)
        setLaserSelect(false)
        setCNCSelect(true)
      }
    }


    return (
      <div className={styles.entireContainer}>
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

          { activeReq && active == "Accepted Requests" && 
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
    )
}

export default DisplayRequests;
import React, {useState, useEffect, useContext,  Component} from 'react';
import styles from './list.module.css'
import {Button} from '@mui/material'
import { GoogleMap, useLoadScript, Marker, InfoWindow, LoadScriptNext } from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {AuthContext} from "../Auth/Auth"
import {useForm} from '../../components/useForm'
import { v4 as uuidv4 } from 'uuid';
import {useNavigate} from "react-router-dom"
import { CurrentDetailsContext } from './DetailsContext';
import { RequestContext } from './RequestContext';
import { API_KEY } from '../../api/firebaseConfig';

const RequestList = ({request}) => {
    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const db = getFirestore();
    const navigate = useNavigate();
    const { details, setDetails } = useContext(CurrentDetailsContext);
    const { req, setReq } = useContext(RequestContext);
    
    const q = query(collection(db, "requests"));
    const [ ref, setRef ] = useState();
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const userRef = doc(db, 'users', `${currentUser?.uid}`)
    const printerRef = doc(db, "printers", `${currentUser?.uid}`)   
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

    //distance api
    const [ userLocation, setUserLocation ] = useState()
    const [ distance, setDistance ] = useState()


    useEffect(() => {
        setDetails(false)
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
        //get current user's general location
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
        if (ref) {
            getLocation()
        }
      }, [ref, details])


    
    useEffect(() => {
        if (userLocation && request?.location && request?.accepted) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                    origins: [userLocation],
                    destinations: [request?.location],
                    unitSystem: window.google.maps.UnitSystem.IMPERIAL,
                    travelMode: 'DRIVING',
                }, callback);
            }
        }, [userLocation, request?.location]);

        const callback = (response, status) => {
            if (status === 'OK') {
                const origins = response.originAddresses;
                for (let i = 0; i < origins.length; i++) {
                    const results = response.rows[i].elements;
                    for (let j = 0; j < results.length; j++) {
                        const element = results[j];
                        setDistance(element.distance.text);
                    }
                }
            }
        }

    return(
    <LoadScriptNext googleMapsApiKey={API_KEY}>
        {/* { distance != null && */
        <div className = {styles.entireContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.topContainer}>
                    <div className={styles.titleContainer}>
                        <div className={styles.printerTitle}>Team {request?.teamnumber} - {request?.type} </div>
                        {(distance || request.distance) &&
                        <div className={styles.printerTitle}>Distance: {request.accepted ? distance : request.distance}</div>
                        }
                    </div>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.infoContainer2}>
                        <div className={styles.printerHeading}>Material:</div>
                        <div className={styles.printerSubtitle}>{request?.material}</div>
                    </div>
                    <div className={styles.infoContainer2}>
                        <div className={styles.printerHeading}>General Location:</div>
                        <div className={styles.printerSubtitle}>{request?.location}</div>
                    </div>
                    <div className={styles.infoContainer2}>
                        <div className={styles.printerHeading}>Contact Info:</div>
                        <div className={styles.printerSubtitle}>{request?.email}</div>
                    </div>
                </div>
                <div className={styles.buttonContainer}> 
                    <Button
                    variant = "contained"
                    sx={{
                        backgroundColor: "#015F8F",
                        textTransform: "none",
                        fontWeight: "600", 
                        "&:hover": {
                            backgroundColor: "#015F8F"
                        }}}
                        onClick = {() => {
                            setReq(request)
                            setDetails(true)
                        }}
                    >
                        View Details
                    </Button>   
                </div>
            </div>
        </div>
        }
    </LoadScriptNext>
    );
    
}
export default RequestList
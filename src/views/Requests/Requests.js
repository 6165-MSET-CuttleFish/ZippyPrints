import React, {useState, useEffect, useContext,  Component} from 'react';
import styles from './list.module.css'
import {Button} from '@mui/material'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getAuth, updateCurrentUser, updateProfile,  } from "firebase/auth";
import { getDatabase, set, onValue} from "firebase/database";
import { getMarkerData} from '../../components/actions/Location'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { Typography, Box } from '@mui/material'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { API_KEY } from "../../api/firebaseConfig"
import {AuthContext} from "../Auth/Auth"
import Popup from "../../components/Popup";
import {useForm, Form} from '../../components/useForm'
import { v4 as uuidv4 } from 'uuid';
import {useNavigate} from "react-router-dom"
import { CurrentDetailsContext } from './DetailsContext';
import Details from './Details';
import { RequestContext } from './RequestContext';

const RequestList = ({request}) => {
    const useStyles = makeStyles(theme =>({ 
        requestButton: {
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            height: 48,
            width: 220,
          },
          submitButton:{
          right: -3,
          top: 7,
          width:350,
          },
          textbox:{
          right:5
          }
        
      }))
    const classes = useStyles();
    const initalFValues = {
        requester_email: '',
        teamnumber: '',
        cad_link: '',
        filament: '',
        supports: '',
        addt_info:'',
        time_frame: '',
        infill:'',
    }
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('teamnumber' in fieldValues)
            temp.teamnumber = (/./).test(fieldValues.teamnumber)?"":"Team Number is required."
        if ('requester_email' in fieldValues)
            temp.requester_email = (/./).test(fieldValues.requester_email)?"":"Email is required."
        if ('cad_link' in fieldValues)
            temp.cad_link = (/./).test(fieldValues.cad_link)?"":"Cad Link is required."
        if ('supports' in fieldValues)
            temp.supports = (/./).test(fieldValues.supports)?"":"Support info is required."
        if ('filament' in fieldValues)
            temp.filament = (/./).test(fieldValues.filament)?"":"Filament info is required."
        if ('time_frame' in fieldValues)
            temp.time_frame = (/./).test(fieldValues.time_frame)?"":"Time frame is required."
        if ('infill' in fieldValues)
            temp.infill = (/./).test(fieldValues.infill)?"":"Infill Info is required."

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

    const {currentUser} = useContext(AuthContext);
    const storage = getStorage();
    const db = getFirestore();
    const navigate = useNavigate();
    const { details, setDetails } = useContext(CurrentDetailsContext);
    const { req, setReq } = useContext(RequestContext);

    const getData = async () => {
        try {
         await addDoc(collection(db, "email"), {
          to: [request.email, currentUser.email],
          message:{subject: 'New ZippyPrints Request #' + uuidv4().split("-")[1],
          text:
            'Hello ' + request.username + ', we have a new request from Team '+ values.teamnumber+ '\n\n'+
            'Requester\'s email: ' + values.requester_email+ '\n'+
            'Filament Info: '+values.filament +'\n'+
            'Supports Info: ' + values.supports +'\n'+
            'Infill Percentage + Info: ' + values.infill+'\n'+
            'Requested Time Frame: '+  values.time_frame +'\n'+
            'Additional Information: '  +  values.addt_info+'\n\n'+
            'Link to Requested CAD: ' + values.cad_link +'\n\n'+
            'Please contact the requester through their email for further communications'+'\n\n'+
            'Thanks for your continued support of ZippyPrints! \n'+
            'To stop receiving requests, go to your account page and disable your printer.'+'\n\n' 
          }
        });
          } catch(error) {
              console.log(error.message);
          }
    }

    const handleDownload = async() => {
        getDownloadURL(ref(storage, `prints/${request.file}`))
        .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
            const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            window.open(url)
        })
        .catch((error) => {
            alert(error.message)
        });
      }
      const handleSubmit = async(e) => {
        getData();
        setValues(initalFValues);
      }

    return(
        <div>
            <div className={styles.titleContainer}>
                <div className={styles.printerTitle}>Team {request?.teamnumber} - {request?.type}
                    <div className={styles.line}></div>
                </div>
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#0B63E5',
                    borderRadius: '7px',
                    padding: '0px 24px',
                    width: 'fit-content',
                    transitionDuration: '500ms',
                    "&.MuiButton-contained": {
                      color: '#F0F5FF',
                      fontFamily: "Lexend Regular",
                      fontSize: 'clamp(10px, 0.9vw, 18px)',
                      fontWeight: '500',
                      letterSpacing: '0',
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      background: "#035ee6",
                      boxShadow: '5px 5px 5px #02142e8e',
                      transitionDuration: '500ms'
                    },
                  }}
                    onClick = {() => {
                        setReq(request)
                        setDetails(true)
                    }}
                  >
                      View Details
                  </Button>   
            </div>
        </div>
    );
    
}
export default RequestList